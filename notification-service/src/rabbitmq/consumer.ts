import amqp, { Channel, ChannelModel } from 'amqplib';
import { config } from '../config';
import { sendNotificationEmail } from '../email/mailer';

let connection: ChannelModel;
let channel: Channel;

export const startRabbitMQconsumer = async (): Promise<void> => {
    connection = await amqp.connect(config.rabbitmq.url);
    channel = await connection.createChannel();

    await channel.assertQueue(config.rabbitmq.queue, {
        durable: true,
    });

    // Process one message at a time: don't grab the next message until the current one is fully processed.
    // This prevents message loss if the service crashes mid-processing.
    channel.prefetch(1);

    console.log('RabbitMQ consumer listening on queue: ', config.rabbitmq.queue);

    channel.consume(config.rabbitmq.queue, async (msg) => {
        if(!msg) return;

        try {
            const task = JSON.parse(msg.content.toString());
            console.log('processing notification task: ', task);

            // For now sending to a placeholder email.
            await sendNotificationEmail(
                'markpoovil@gmail.com',
                task.studentId,
                task.status,
                task.date
            );
            
            // Acknowledge the message: tells RabbitMQ this task was processed succesfully 
            // and can be removed from the queue.
            channel.ack(msg);

        } catch(error) {
            console.error('Failed to process notification task: ', error);
            
            // Negative acknowledge: puts the message back in the queue to be retried.
            // The false means don't requeue if it keeps failing.
            channel.nack(msg, false, false);
        }
    });
};