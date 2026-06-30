import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { connectMongoDB } from './config/database';
import { connectKafkaProducer, disconnectKafkaProducer } from './kafka/producer';
import { swaggerSpec } from './config/swagger';
import attendanceRoutes from './routes/attendance.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'attendance-service' });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/attendance', attendanceRoutes);

const start = async () => {
  // Connect MongoDB first, then Kafka, then start HTTP server
  // Order matters; don't accept requests until both are ready
  await connectMongoDB();
  await connectKafkaProducer();

  app.listen(PORT, () => {
    console.log(`Attendance service running on port ${PORT}`);
  });

  // Shutdown; disconnect cleanly when the process is killed
  process.on('SIGTERM', async () => {
    await disconnectKafkaProducer();
    process.exit(0);
  });
};

start();