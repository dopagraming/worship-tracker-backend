import swaggerJSDoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Ibadat App API',
            version: '1.0.0',
            description: 'وثائق API لنظام إدارة العبادة',
        },
        servers: [
            { url: 'http://localhost:5000', description: 'Local server' }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [{ bearerAuth: [] }]
    },
    apis: ['./routes/*.js', './models/*.js'], // وسيتم مسح تعليقات JSDoc من هذه الملفات
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;