import express from 'express';
import { addProductToCart, removeProductFromCart, getLoggedUserCart, updateProductQuantity, deleteUserCart, applyCoupon } from './cart.service.js';
import { auth } from '../../midlleware/auth.js';
import { validation } from '../../utilts/validation.js';
import { addProductToCartSchema, removeProductFromCartSchema, updateProductQuantitySchema, applyCouponSchema } from './cart.validation.js'
const router = express.Router();

router.post('/add-product', auth, validation(addProductToCartSchema), addProductToCart);
router.delete('/remove-product/:id', auth, validation(removeProductFromCartSchema), removeProductFromCart);
router.get('/get-user-cart', auth, getLoggedUserCart);
router.put('/update/:id', auth, validation(updateProductQuantitySchema), updateProductQuantity);
router.delete('/delete', auth, deleteUserCart);
router.post('/apply-coupon', validation(applyCouponSchema), auth, applyCoupon);
export default router;
