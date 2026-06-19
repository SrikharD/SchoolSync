import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'SchoolSync Auth Service API',
            version: '1.0.0',
            description: 'Handles authentication, JWT tokens, and RBAC for SchoolSync',
        },
        servers: [
            {
                url: 'http://localhost:3001',
                description: 'Development server'
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter your JWT token in the format **Bearer &lt;token&gt;**',
        },
    },
    schemas: {
        RegisterRequest: {
            type: 'object',
            required: ['email', 'password', 'firstName', 'lastName'],
            properties: {
                email: { type: 'string', example: 'ravi@school.com'},
                password: { type: 'string', example: 'Test1234!' },
                firstName: { type: 'string', example: 'Ravi' },
                lastName: { type: 'string', example: 'Kumar' },
                role: {
                    type: 'string',
                    enum: ['admin', 'teacher', 'student', 'parent', 'librarian', 'accountant'],
                    example: 'student',
                },
            },
        },
        LoginRequest: {
            type: 'object',
            required: ['email', 'password'],
            properties: {
                email: { type: 'string', example: 'ravi@school.com' },
                password: { type: 'string', example: 'Test1234!' },
            },
        },
        AuthResponse: {
            type: 'object',
            properties: {
                message: { type: 'string' },
                token: { type: 'string' },
                user: {
                    type: 'object',
                    properties: {
                        id: { type: 'number' },
                        email: { type: 'string' },
                        role: { type: 'string' },
                        firstName: { type: 'string' },
                    },
                },
            },
        },
        ErrorResponse: {
            type: 'object',
            properties: {
                message: { type: 'string' , example: 'Error message' },
                },
            },
        },
    },
},
    apis: ['./src/routes/*.ts'], // Path to swagger-jsdoc which scans for JSDoc comments to generate the documentation.
};

export const swaggerSpec = swaggerJsdoc(options);