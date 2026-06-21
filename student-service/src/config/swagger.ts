import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SchoolSync Student Service',
      version: '1.0.0',
      description: 'Manages student records, class assignments, and parent linkage for SchoolSync',
    },
    servers: [
      {
        url: 'http://localhost:3002',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Paste the JWT token issued by Auth Service',
        },
      },
      schemas: {
        CreateStudentRequest: {
          type: 'object',
          required: ['userId', 'firstName', 'lastName', 'rollNumber', 'className', 'section', 'dateOfBirth'],
          properties: {
            userId:       { type: 'number', example: 5 },
            firstName:    { type: 'string', example: 'Ravi' },
            lastName:     { type: 'string', example: 'Kumar' },
            rollNumber:   { type: 'string', example: '10A-01' },
            className:    { type: 'string', example: '10th Grade' },
            section:      { type: 'string', example: 'A' },
            dateOfBirth:  { type: 'string', example: '2010-05-14' },
            parentUserId: { type: 'number', example: 12, nullable: true },
          },
        },
        Student: {
          type: 'object',
          properties: {
            id:           { type: 'number' },
            userId:       { type: 'number' },
            firstName:    { type: 'string' },
            lastName:     { type: 'string' },
            rollNumber:   { type: 'string' },
            className:    { type: 'string' },
            section:      { type: 'string' },
            dateOfBirth:  { type: 'string' },
            parentUserId: { type: 'number', nullable: true },
            isActive:     { type: 'boolean' },
            createdAt:    { type: 'string' },
            updatedAt:    { type: 'string' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Student not found' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);