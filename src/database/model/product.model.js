import mongoose, { Schema, Types } from "mongoose";
import slugify from "slugify";
const productSchema = new Schema({
    produactName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minLength: [2, 'to short product name']
    },
    slug: {
        type: String,
        lowercase: true
    },
    price: {
        type: Number,
        default: 0,
        min: 0
    },
    priceAfterDiscount: {
        type: Number,
        default: 0,
        min: 0
    },
    description: {
        type: String,
        minLength: [10, ' product description too short'],
        maxLength: [100, 'product description too long'],
        required: true,
        trim: true
    },
    stock: {
        type: Number,
        default: 0,
        min: 0
    },
    sold: {
        type: Number,
        default: 0,
        min: 0
    },
    imageCover: {
        type: String,
        required: true
    },
    images: {
        type: [String],
        required: true
    },
    category: {
        type: Types.ObjectId,
        ref: "categories",
        required: true
    },
    subCategory: {
        type: Types.ObjectId,
        ref: "subCategory",
        required: true
    },
    brand: {
        type: Types.ObjectId,
        ref: "brand",
        required: true
    },
    tag: {
        type: [Types.ObjectId],
        ref: "tag"
    },
    productType: {
        type: String,
        enum: ["tire", "battary"],
        default: "tire"
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
productSchema.pre('save', function () {
    this.slug = slugify(this.title)
})
productSchema.virtual("reviews", {
    ref: "review",
    localField: "_id",
    foreignField: "product"
})
productSchema.pre('find', function () {
    this.populate('reviews')
})
export const productModel = model('product', productSchema);