import { Express } from "express";
const app = express();
import mongoose from "mongoose";


app.use(8800, () => {
    console.log("Server is runnning...");
})