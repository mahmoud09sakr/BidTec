import mongoose from "mongoose"


const orderSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    cartItems: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product", 
            required: true
        },
    }],
    shippingAddress: {
        type: String,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ["cash", "visa"],
        defaultL: "visa"
    },
    paidAt: {
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