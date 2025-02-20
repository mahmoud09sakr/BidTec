import express, { json } from 'express'
import { bootstrap } from './src/app.controller.js'
import dotenv from "dotenv"
dotenv.config()
const app = express()
const port = 3000

bootstrap(express, app)

app.listen(port, () => console.log(`Example app listening at http://localhost:${process.env.PORT}`))