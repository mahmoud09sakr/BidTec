import express, { json } from 'express'
import { bootstrap } from './src/app.controller.js'
import dotenv from "dotenv"
dotenv.config()
const app = express()
const port = 3000

bootstrap(express, app)

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
});