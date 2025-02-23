import mongoose from "mongoose"
const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: false
    },
    address: String,
    image: String,
    role: {
        type: String,
        enum: ["User", "Admin", "Agent", "Maintenance_Center"],
        default: "User"
    },
    gender: {
        type: String,
        enum: ["male", "female"],
    },
    age: Number,
    location: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: Number
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    },
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: null
    }
}, { timestamps: true })
const userModel = mongoose.model("user", userSchema)

export default userModel