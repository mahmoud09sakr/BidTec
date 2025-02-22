import express, { json } from 'express'
import { bootstrap } from './src/app.controller.js'
import dotenv from "dotenv"
dotenv.config()
const app = express()
const PORT = process.env.PORT || 4000; 

bootstrap(express, app)
app.get("/", (req, res) => {
    res.send("Server is running...");
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });