import { Router } from 'express';
import { validation } from '../../utilts/validation.js';
import { loginSchema, signUpSchema } from './auth.validation.js';
import userModel from '../../database/model/user.model.js'
import { AppError } from '../../errorHandling/AppError.js'

import { confirmEmail, login, resetPassword, sendOTP, signUp } from './auth.service.js';
import { auth } from '../../midlleware/auth.js';
import { handleAsyncError } from '../../errorHandling/handelAsyncError.js';
const router = Router(
    {
        mergeParams: true,
        strict: true
    }
);
/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API endpoints related to authentication
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserSignUp:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - confirmPassword
 *       properties:
 *         name:
 *           type: string
 *           description: Full name of the user
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         password:
 *           type: string
 *           format: password
 *           description: User's password (minimum 6 characters)
 *         confirmPassword:
 *           type: string
 *           format: password
 *           description: Must match the password
 *         phone:
 *           type: string
 *           description: User's phone number (optional)
 *         address:
 *           type: string
 *           description: User's address (optional)
 *         role:
 *           type: string
 *           enum: [Admin, Agent, Maintenance_Center, User]
 *           description: User's role in the system
 *         gender:
 *           type: string
 *           enum: [Male, Female, Other]
 *           description: User's gender (optional)
 *         age:
 *           type: integer
 *           description: User's age (optional)
 *         location:
 *           type: string
 *           description: User's location (optional)
 *
 *     UserLogin:
 *       type: object
 *       required:
 *         - identifier
 *         - password
 *       properties:
 *         identifier:
 *           type: string
 *           description: Email or phone number of the user
 *         password:
 *           type: string
 *           format: password
 *           description: User's password
 *
 *     EmailConfirmation:
 *       type: object
 *       required:
 *         - token
 *       properties:
 *         token:
 *           type: string
 *           description: JWT token sent via email
 *
 *     SendOTP:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *
 *     ResetPassword:
 *       type: object
 *       required:
 *         - email
 *         - otp
 *         - newPassword
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         otp:
 *           type: string
 *           description: OTP received via email
 *         newPassword:
 *           type: string
 *           format: password
 *           description: New password to be set
 */

/**
 * @swagger
 * /auth/signUp:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserSignUp'
 *     responses:
 *       201:
 *         description: User registered successfully. Verification email sent.
 *       400:
 *         description: User already exists or password mismatch
 */

/**
 * @swagger
 * /auth/confirm-email/{token}:
 *   get:
 *     summary: Confirm user email
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Token sent via email
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired token
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: Login successful, returns a token
 *       400:
 *         description: Invalid credentials or email not verified
 */

/**
 * @swagger
 * /auth/sendOTP:
 *   post:
 *     summary: Send OTP for password reset
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SendOTP'
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       400:
 *         description: User not found
 */

/**
 * @swagger
 * /auth/resetPassword:
 *   patch:
 *     summary: Reset user password using OTP
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPassword'
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid OTP or user not found
 */



router.post('/signUp', validation(signUpSchema), signUp)
router.post('/login', validation(loginSchema), login)
router.post("/sendOTP", sendOTP)
router.get('/confirm-email/:token', confirmEmail)
router.patch("/resetPassword", resetPassword)

export default router