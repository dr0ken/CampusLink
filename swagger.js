import swaggerJSDoc from "swagger-jsdoc"

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Документация API CampusLink',
            version: '1.0.0'
        },
        servers: [
            {
                url: 'http://localhost:5000/api',
                description: 'Локальный сервер разработки',
            },
        ]
      },
    apis: ['./routes/*.js', './models/*.js']
}

const swaggerSpec = swaggerJSDoc(swaggerOptions)

export default swaggerSpec