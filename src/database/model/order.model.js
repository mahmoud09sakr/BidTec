import mongoose from "mongoose"

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    cartItems: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product", 
        },
    }],
    shippingAddress: {
        type: String,
    },
    totalPrice: {
        type: Number,
    },
    paymentMethod: {
        type: String,
        enum: ["cash", "visa"],
        default: "cash"
    },
    orderdAt: {
        type: Date,
        default: Date.now
    },
    isDelivered: {
        type: Boolean,
        default: false
    },
    deliveredAt: {
        type: Date,
    },
    serviceType: {
        type: String,
        required: true,
        enum: ["delivery&instulation", "instulation-in-store", "delivery"],
    }
})

let orderModel = mongoose.model("Order", orderSchema)
export default orderModel