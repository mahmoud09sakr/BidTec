import express from "express";
import { bootstrap } from "./src/app.controller.js";

const app = express();
bootstrap(express, app);

export default app;
