import express from 'express'
import config from 'config'

const app = express()

const PORT = config.get('port') || 5000


app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`))

