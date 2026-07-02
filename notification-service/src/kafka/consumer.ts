import { Kafka, Consumer, Partitioners } from 'kafkajs';
import { config } from '../config';
import { publishNotificationTask } from '../rabbitmq/publisher';

let consumer: Consumer

export const startKafkaConsumer = async (): Promise<void> => {
    
    //debugging: log the Kafka broker from config to ensure it's being read correctly.
    console.log('Kafka broker from config:', config.kafka.broker);
    
    const kafka = new Kafka ({
        clientId: 'notification-service',
        brokers: [config.kafka.broker],
    });

    consumer = kafka.consumer({
        groupId: config.kafka.groupId,
    });

    await consumer.subscribe({
        topic: config.kafka.topic,
        fromBeginning: true, // read all events from the start of the topic.
    });

    await consumer.run({
        eachMessage: async({ message }) => {
            if(!message.value) return;
            
            const event = JSON.parse(message.value.toString());
            console.log('Kafka event received: ', event);

            // Only notify parents when a student is absent or late
            // no need if present.
            if(event.status === 'absent' || event.status === 'late'){
                await publishNotificationTask({
                    studentId: event.studentId,
                    status: event.status,
                    date: event.date,
                    className: event.className,
                    section: event.section,
                });
            } else {
                console.log(`Student ${event.studentId} is present: no notification needed.`);
            }
        },
    });
};

export const disconnectKafkaConsumer = async (): Promise<void> => {
    await consumer?.disconnect();
}   