import { required } from "joi";
import mongoose from "mongoose";

const battarySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "brand",
        required: true
    },
    voltage: {
        type: Number,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    dimention: {
        type: String,
        required: true
    },
    weight: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const battaryModel = mongoose.model('battary', battarySchema)
export default battaryModel