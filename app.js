import express from 'express'
import config from 'config'
import mongoose from 'mongoose'
import authRoutes from './routes/auth.routes.js'
import bodyParser from 'body-parser'

const app = express()

app.use(bodyParser.json())

app.use('/api/auth', authRoutes)

const PORT = config.get('port') || 5000

async function start() 
{
    try 
    {
        await mongoose.connect(config.get("mongoUri"))

        app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`))
    } 
    catch (e) 
    {
        console.log('Server error', e.message)
        process.exit(1);
    }
}


start()