import express from 'express'
import mongoose from 'mongoose'
import authRoutes from './routes/auth.routes.js'
import profileRoutes from './routes/profile.routes.js'
import vacancyRoutes from './routes/vacancy.routes.js'
import submissionRoutes from './routes/submission.routes.js'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './swagger.js'

dotenv.config()

const app = express()

app.use(bodyParser.json())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/vacancy', vacancyRoutes)
app.use('/api/submission', submissionRoutes)

const PORT = process.env.PORT || 5000

async function start() 
{
    try 
    {
        await mongoose.connect(process.env.MONGO_URI)

        app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`))
    } 
    catch (e) 
    {
        console.log('Server error', e.message)
        process.exit(1);
    }
}


start()