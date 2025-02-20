import { Schema, Types, model } from "mongoose";
import slugify from "slugify";
const brandSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    slug: {
        type: String,
        lowercase: true
    },
    logo: {
        type: String,
        required: true
    }
}, { timestamps: true });
brandSchema.pre('save', function () {
    this.slug = slugify(this.name)
})
export const brandModel = model('brand', brandSchema);