import express from 'express';
import { addProductToCart, removeProductFromCart, getLoggedUserCart, updateProductQuantity, deleteUserCart, applyCoupon } from './cart.service.js';
import { auth } from '../../midlleware/auth.js';
import { validation } from '../../utilts/validation.js';
import { addProductToCartSchema, removeProductFromCartSchema, updateProductQuantitySchema, applyCouponSchema } from './cart.validation.js'
import Joi from 'joi';

const router = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Cart:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *         products:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: number
 *         total:
 *           type: number
 */

/**
 * @swagger
 * /cart/add-product:
 *   post:
 *     summary: Add product to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: number
 *             required:
 *               - productId
 *     responses:
 *       200:
 *         description: Product added to cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       401:
 *         description: Unauthorized
 */
router.post('/add-product', auth, validation({ body: addProductToCartSchema }), addProductToCart);

/**
 * @swagger
 * /cart/remove-product/{id}:
 *   delete:
 *     summary: Remove product from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID to remove
 *     responses:
 *       200:
 *         description: Product removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found in cart
 */
router.delete('/remove-product/:id', auth, validation({ params: removeProductFromCartSchema }), removeProductFromCart);

/**
 * @swagger
 * /cart/get-user-cart:
 *   get:
 *     summary: Get logged user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's cart retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       401:
 *         description: Unauthorized
 */
router.get('/get-user-cart', auth, getLoggedUserCart);

/**
 * @swagger
 * /cart/update/{id}:
 *   put:
 *     summary: Update product quantity in cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *             required:
 *               - quantity
 *     responses:
 *       200:
 *         description: Quantity updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found in cart
 */
router.put('/update/:id', auth, validation({
    params: Joi.object({ id: updateProductQuantitySchema.extract('id') }),
    body: Joi.object({ quantity: updateProductQuantitySchema.extract('quantity') })
}), updateProductQuantity);

/**
 * @swagger
 * /cart/delete:
 *   delete:
 *     summary: Delete user's entire cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart deleted successfully
 *       401:
 *         description: Unauthorized
 */
router.delete('/delete', auth, deleteUserCart);



//TODO: lesa ma5alast444
/**
 * @swagger
 * /cart/apply-coupon:
 *   post:
 *     summary: Apply coupon to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               couponCode:
 *                 type: string
 *             required:
 *               - couponCode
 *     responses:
 *       200:
 *         description: Coupon applied successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Invalid coupon
 */
router.post('/apply-coupon', validation({ body: applyCouponSchema }), auth, applyCoupon);

export default router;