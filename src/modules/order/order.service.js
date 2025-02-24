import { handleAsyncError } from "../../errorHandling/handelAsyncError.js";

import orderModel from '../../database/model/order.model.js'
import cartModel from '../../database/model/cart.model.js'
import productModel from '../../database/model/product.model.js'
import { AppError } from '../../errorHandling/AppError.js';
import Stripe from 'stripe';
import userModel from '../../database/model/user.model.js';
const stripe = new Stripe(process.env.STRIPE_SK);



const createCashOrder = handleAsyncError(async (req, res, next) => {
    const { cartId } = req.params
    let { id } = req.user
    let { serviceType, paymentMethod } = req.body
    const cart = await cartModel.findById(cartId)
    !cart && next(new AppError('cart is empty ', 404))
    const totalPrice = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalPrice
    const order = new orderModel({
        userId: id,
        cartItems: cart.cartItems,
        totalOrderPrice: totalPrice,
        serviceType,
        shippingAddress: req.body.shippingAddress
    })
    await order.save()
    if (order) {
        const options = cart.cartItems.map(item => ({
            updateOne: {
                filter: { _id: item.product },
                update: {
                    $inc: {
                        stock: -item.quantity,
                        sold: item.quantity
                    }
                }
            }
        }))
        await productModel.bulkWrite(options)
        let data = await cartModel.findByIdAndDelete(cartId)
        return res.status(201).json({ message: 'success', order, data })
    } else {
        return next(new AppError('no cart to order', 404))
    }
});

const getAllOrders = handleAsyncError(async (req, res, next) => {
    const orders = await orderModel.find()
        .populate("userId", "name , email ").populate("cartItems.productId")
    console.log(orders);

    orders && res.status(200).json({ message: 'success', orders })
    !orders && next(new AppError("no orders found."))
});

const getUserOrders = handleAsyncError(async (req, res, next) => {
    const orders = await orderModel.find({ userId: req.user._id }).populate('cartItems.productId')
    orders && res.status(200).json({ message: 'success', orders })
    !orders && next(new AppError("no orders found."))
});

const createCheckOutSession = handleAsyncError(async (req, res, next) => {
    let { cartId } = req.params
    let { shippingAddress } = req.body
    const cart = await cartModel.findById(cartId)
    !cart && next(new AppError('cart is empty ', 404))
    const totalPrice = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalPrice
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: 'egp',
                    unit_amount: totalPrice * 100,
                    product_data: {
                        name: req.user.name,
                    }
                }
                ,
                quantity: 1
            }
        ],
        mode: 'payment',
        success_url: 'https://www.google.com/',
        cancel_url: 'https://www.yahoo.com/',
        customer_email: req.user.email,
        client_reference_id: cartId,
        metadata: shippingAddress
    });
    res.json({ message: 'success', url: session.url })
})







const createOnlineOrder = handleAsyncError(async (request, response, next) => {
    const sig = request.headers['stripe-signature'].toString();
    let event;
    try {
        event = stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_SK);
    } catch (err) {
        return next(new AppError(`Webhook Error: ${err.message}`, 500))
    }
    // Handle the event
    if (event.type == 'checkout.session.completed') {
        handleWebHookEvent(event.data.object, response)
    } else {
        console.log(`Unhandled event type ${event.type}`);
    }
})





async function handleWebHookEvent(event, res) {
    const cart = await cartModel.findById(event.client_reference_id)

    const user = await userModel.findOne({ email: event.customer_email })
    //NOTE - create order
    const order = new orderModel({
        user: user._id,
        cartItems: cart.cartItems,
        totalOrderPrice: event.amount_total / 100,
        shippingAddress: event.metadata,
        paymentMethod: 'card',
        isPaid: true,
        orderdAt: Date.now()
    })
    await order.save()

    //NOTE - increase sold product && decrease quantity
    if (order) {
        const options = cart.cartItems.map(item => ({
            updateOne: {
                filter: { _id: item.product },
                update: {
                    $inc: {
                        stock: -item.quantity,
                        sold: item.quantity
                    }
                }
            }
        }))
        await productModel.bulkWrite(options)
        //NOTE - clear user cart
        await cartModel.findByIdAndDelete(cart._id)

        return res.status(201).json({ message: 'success', order })


    }

}


export {
    createCashOrder,
    getAllOrders,
    getUserOrders,
    createCheckOutSession,
    createOnlineOrder
}