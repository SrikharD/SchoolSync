import { config } from './config';
import { initMailer } from './email/mailer';
import { connectRabbitMQ, disconnectRabbitMQ } from './rabbitmq/publisher';
import { startRabbitMQconsumer } from './rabbitmq/consumer';
import { startKafkaConsumer, disconnectKafkaConsumer } from './kafka/consumer';

const start = async (): Promise<void> => {
    console.log('Starting Notification Service...');

    // here: initMailer -> connectRabbitMQ publisher -> startRabbitMQ consumer -> startKafkaConsumer

    await initMailer();
    await connectRabbitMQ();
    await startRabbitMQconsumer();
    await startKafkaConsumer(); 

    console.log(`Notification Service is running on port ${config.port}`);

    process.on('SIGTERM', async () => {
        await disconnectKafkaConsumer();
        await disconnectRabbitMQ();
        process.exit(0);
    });
};

start().catch((error) => {
  console.error('Failed to start Notification Service:', error);
  process.exit(1);
});
