import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    logo: {
        type: String,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: {
        type: Date,
        default: null,
    },
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: null,
    },
}, { timestamps: true });
const brandModel = mongoose.model('Brand', brandSchema);
export default brandModel