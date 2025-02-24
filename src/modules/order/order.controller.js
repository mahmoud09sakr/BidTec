import express from 'express'
import { checkRole } from '../../midlleware/role.js'
import { auth } from '../../midlleware/auth.js'
import { createCashOrder, createCheckOutSession, getAllOrders, getUserOrders } from './order.service.js';
const router = express.Router();


router.get('/get-all-orders-for-admin',auth ,checkRole('Admin'), getAllOrders)
router.get('/get-user-orders', auth, checkRole('User', 'Admin'), getUserOrders)
router.post('/create-cash-order/:cartId', auth, checkRole('User', 'Admin'), createCashOrder)
router.post('/checkOut-session/:cartId', auth,checkRole('User', 'Admin'), createCheckOutSession)

export default router  