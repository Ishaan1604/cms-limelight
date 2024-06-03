const swaggerJSDocs = require('swagger-jsdoc');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Claims Management System',
        version: '1.0.0',
        description: 'A simple program that helps am insurance company create policies and manage claims while also allowing users to buy these policies and make necessary claims'
    },
    servers: [
        {
            url: 'http://localhost:3000/api/v1/cms'
        }
    ],
    components: {
        schemas: {
            Person: {
                type: 'object',
                properties: {
                    name: {
                        type: 'string',
                        description: 'The name of the person'
                    },
                    email: {
                        type: 'string',
                        format: 'email',
                        properties: 'unique',
                        description: 'The email of the person'
                    },
                    password: {
                        type: 'string',
                        description: 'The password of the person'
                    },
                    personType: {
                        type: 'string',
                        enum: ['admin', 'user'],
                        description: 'The role of the person'
                    }
                },
            },
        Error: {
            type: 'object',
            properties: {
                msg: {
                    type: 'string',
                    description: 'Contains the error message'
                },
                statusCode: {
                    type: 'number',
                    description: 'Contains the status code of the error'
                }
            }
        }
        }
    }
}

const options = {
    swaggerDefinition,
    apis: ['./routers/*.js']
};

const swaggerSpecs = swaggerJSDocs(options)

module.exports = swaggerSpecs;