import express from "express";
import { bootstrap } from "./src/app.controller.js";

const app = express();
console.log("Initializing Express app...");
bootstrap(express, app);

export default app;