import { Kafka, Producer, Partitioners } from 'Kafkajs';

const kafka = new Kafka({
    clientId: 'attendance-service',
    brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
});

let producer: Producer;

// Connect once when the service starts, reuse the connection.
export const connectKafkaProducer = async (): Promise<void> => {
    producer = kafka.producer({
        createPartitioner: Partitioners.LegacyPartitioner,
    });

    await producer.connect();
    console.log('kafka producer connected!');
};

// Publish an event to a kafka topic.
// topic → the channel name (e.g. "attendance.marked")
// message → the event payload as a plain object.

export const publishEvent = async ( topic: string, message: object ): Promise<void> => {
    if(!producer){
        console.error("kafka producer not initialized!");
        return;
    }

    await producer.send({
        topic,
        messages: [
            {
                // key = studentId so all events for one student go to the same Kafka Partition; guarenteed order per student
                key: String((message as any).studentId),
                value: JSON.stringify(message),
            },
        ],
    });
};

export const disconnectKafkaProducer = async (): Promise<void> => {
    if(producer){
        await producer.disconnect();
    }
};