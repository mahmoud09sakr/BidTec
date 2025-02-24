import { Router } from 'express';
import { auth } from '../../midlleware/auth.js';
import { checkRole } from '../../midlleware/role.js';
import { deletedUser, getAllDeletedUser, getAllUsers, restoreUser, updateProfile, upgradeRole } from './user.service.js';
import { deleteUserSchema, updateProfileSchema } from './user.validation.js';
import { validation } from '../../utilts/validation.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API endpoints for managing users
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The user ID
 *         name:
 *           type: string
 *           description: Name of the user
 *         email:
 *           type: string
 *           description: Email of the user
 *         phone:
 *           type: string
 *           description: Phone number of the user
 *         address:
 *           type: string
 *           description: Address of the user
 *         gender:
 *           type: string
 *           enum: [male, female, other]
 *           description: Gender of the user
 *         age:
 *           type: integer
 *           description: Age of the user
 *         location:
 *           type: string
 *           description: Location of the user
 *         image:
 *           type: string
 *           description: URL of the user’s profile image
 *         role:
 *           type: string
 *           description: Role of the user (e.g., User, Admin)
 *         deleted:
 *           type: boolean
 *           description: Whether the user is marked as deleted
 *     UpdateProfileRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 50
 *           description: Name of the user
 *         email:
 *           type: string
 *           format: email
 *           description: Email of the user
 *         phone:
 *           type: string
 *           minLength: 10
 *           maxLength: 15
 *           description: Phone number of the user
 *         address:
 *           type: string
 *           minLength: 10
 *           maxLength: 100
 *           description: Address of the user
 *         gender:
 *           type: string
 *           enum: [male, female, other]
 *           description: Gender of the user
 *         age:
 *           type: integer
 *           minimum: 18
 *           maximum: 100
 *           description: Age of the user
 *         location:
 *           type: string
 *           maxLength: 255
 *           description: Location of the user
 *         image:
 *           type: string
 *           format: uri
 *           description: URL of the user’s profile image
 */

/**
 * @swagger
 * /users/get-all-deleted-users:
 *   get:
 *     summary: Get all deleted users
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of deleted users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - User is not an Admin
 */
router.get('/get-all-deleted-users', auth, checkRole('Admin'), getAllDeletedUser);

/**
 * @swagger
 * /users/update-profile:
 *   patch:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfileRequest'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request - Validation error
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */
router.patch('/update-profile', auth, validation({ body: updateProfileSchema }), updateProfile);

/**
 * @swagger
 * /users/delete-user/{userId}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User deleted successfully"
 *       400:
 *         description: Bad request - Invalid userId
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - User is not an Admin
 */
router.delete('/delete-user/:userId', auth, checkRole('Admin'), validation(deleteUserSchema), deletedUser);

/**
 * @swagger
 * /users/get-all-users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - User is not an Admin
 */
router.get('/get-all-users', auth, checkRole('Admin'), getAllUsers);

/**
 * @swagger
 * /users/restore-user/{userId}:
 *   patch:
 *     summary: Restore a deleted user by ID
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User restored successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request - Invalid userId
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - User is not an Admin
 */
router.patch('/restore-user/:userId', auth, checkRole('Admin'), validation(deleteUserSchema), restoreUser);

/**
 * @swagger
 * /users/upgrade-role/{userId}:
 *   patch:
 *     summary: Upgrade a user’s role by ID
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User role upgraded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request - Invalid userId
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - User is not an Admin
 */
router.patch('/upgrade-role/:userId', auth, checkRole('Admin'), validation(deleteUserSchema), upgradeRole);

export default router;