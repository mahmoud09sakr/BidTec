
import mongoose from "mongoose";
import cartModel  from "../../database/model/cart.model.js";
import productModel from "../../database/model/product.model.js";
import { AppError } from "../../errorHandling/AppError.js";
import { handleAsyncError } from "../../errorHandling/handelAsyncError.js";

const calculateTotalPrice = (cart) => {
    cart.totalPrice = cart.cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
    if (cart.discount) {
        cart.totalPriceAfterDiscount = cart.totalPrice - (cart.totalPrice * cart.discount) / 100;
    }
};

export const addProductToCart = handleAsyncError(async (req, res, next) => {
    let { productId, quantity } = req.body;
    let { id } = req.user;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return next(new AppError('Invalid product ID', 400));
    }
    const product = await productModel.findById(productId).select('price');
    if (!product) return next(new AppError('Product does not exist.', 404));

    let cart = await cartModel.findOne({ user: id });
    if (!cart) {
        cart = await cartModel.create({
            user: req.user._id,
            cartItems: [{
                product: productId,
                quantity: quantity || 1,
                price: product.price
            }]
        });
    } else {
        const existingItem = cart.cartItems.find(item => item.product && item.product.toString() === productId.toString());
        if (existingItem) {
            existingItem.quantity += quantity || 1;
        } else {
            cart.cartItems.push({
                product: productId,
                quantity: quantity || 1,
                price: product.price
            });
        }
    }
    calculateTotalPrice(cart);
    await cart.save();
    res.status(201).json({ message: "Product added to cart", cart });
});

export const removeProductFromCart = handleAsyncError(async (req, res, next) => {
    let { id } = req.params
    const cart = await cartModel.findOne(
        { user: req.user._id }
    );
    const itemIndex = cart.cartItems.findIndex(item => item.product.toString() === id);
    if (itemIndex === -1) return next(new AppError('Item not found in cart', 404));
    cart.cartItems.splice(itemIndex, 1);
    if (!cart) return next(new AppError('Item not found in cart', 404));
    calculateTotalPrice(cart);
    if (cart.cartItems.length === 0) {
        cart.discount = 0;
    }
    await cart.save();
    res.status(200).json({ message: "Product removed from cart", cart });
});

export const getLoggedUserCart = handleAsyncError(async (req, res, next) => {
    const cart = await cartModel.findOne({ user: req.user._id }).populate('cartItems.product');
    if (!cart) return next(new AppError("Cart not found", 404));
    res.status(200).json({ message: "Success", cart });
});

export const updateProductQuantity = handleAsyncError(async (req, res, next) => {
    let { id } = req.user
    let { quantity } = req.body
    const cart = await cartModel.findOne({ user: req.user._id });
    if (!cart) return next(new AppError("Cart not found", 404));
    const item = cart.cartItems.find(item => item.product.toString() === req.params.id);
    if (!item) return next(new AppError("Product not found in cart", 404));
    item.quantity = quantity;
    calculateTotalPrice(cart);
    await cart.save();
    res.status(200).json({ message: "Product quantity updated", cart });
});

export const deleteUserCart = handleAsyncError(async (req, res, next) => {
    const cart = await cartModel.findOneAndDelete({ user: req.user._id });
    if (!cart) return next(new AppError("Cart not found", 404));
    res.status(200).json({ message: "Cart deleted successfully" });
});


//TODO: lesa el CRUD coupon mt3aml4 
export const applyCoupon = handleAsyncError(async (req, res, next) => {
    const { code } = req.body;
    const coupon = await couponModel.findOne({ code, expires: { $gt: Date.now() } });
    if (!coupon) return res.status(404).json({ message: "Coupon is expired or invalid" });
    const cart = await cartModel.findOne({ user: req.user._id });
    if (!cart) return next(new AppError("Cart not found", 404));
    cart.discount = coupon.discount;
    cart.totalPriceAfterDiscount = cart.totalPrice - (cart.totalPrice * coupon.discount) / 100;
    await cart.save();
    res.status(200).json({ message: "Coupon applied successfully", cart });
});
