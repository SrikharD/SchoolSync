import amqp, { Channel, ChannelModel } from 'amqplib';
import { config } from '../config';

let connection: ChannelModel;
let channel: Channel;

export const connectRabbitMQ = async (): Promise<void> => {
  connection = await amqp.connect(config.rabbitmq.url);
  channel = await connection.createChannel();

  // Assert the queue: creates if it doesn't exists.
  // does nothing if already exists. Safe to call on every startup.
  await channel.assertQueue(config.rabbitmq.queue, {
    durable: true, // QUEUE survives RabbitMQ restrats.
  })

  console.log('RabbitMQ connected!');
};

export const publishNotificationTask = async (task: object): Promise<void> => {
    if(!channel){
        console.error('RabbitMQ channel not initialized.');
        return;
    }

    channel.sendToQueue(
        config.rabbitmq.queue,
        Buffer.from(JSON.stringify(task)),
        { persistent: true } // message survives even if RabbitMQ restarts.
    );

    console.log('Notification task published to RabbitMQ: ', task);
};

export const disconnectRabbitMQ = async (): Promise<void> => {
    await channel?.close();
    await connection.close();
}