import dotenv from 'dotenv';


dotenv.config({ override: false });

export const config = {
    kafka: {
        broker: process.env.KAFKA_BROKER || 'localhost:9092', 
        groupId: 'notification-service-group',
        topic: 'attendance.marked',
    },
    rabbitmq: {
        url: process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672',
        queue: 'notification.tasks',
    },
    port: process.env.PORT || 3004,

}