import express from 'express'
import cors from 'cors'
import chalk from 'chalk'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

const PORT = 5000;
app.listen(PORT, () =>
    console.log(`Server listening on port ${PORT}`))
