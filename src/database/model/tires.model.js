import mongoose from "mongoose";

const tireSchema = new mongoose.Schema({
    tire_width: {
        type: Number,
        required: true
    },
    aspect_ratio: {
        type: Number,
        required: true
    },
    wheel_diameter: {
        type: Number,
        required: true
    },
    tire_type: {
        type: String,
        required: true
    },
    tire_brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "brand",
        required: true
    },
})

const tireModel = mongoose.model('tires', tireSchema)
export default tireModel