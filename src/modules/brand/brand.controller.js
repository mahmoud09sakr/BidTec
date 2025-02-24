import { Router } from 'express';
import { createBrand, getAllBrands, getBrandById, getAllAdminBrands, getAllDeletedBrands, restoreBrand, updateBrand, deleteBrand } from './brand.service.js';
import { createBrandSchema, getBrandByIdSchema, updateBrandSchema, deleteBrandSchema, restoreBrandSchema } from './brand.validation.js';
import { validation } from '../../utilts/validation.js';
import { upload, uploadToCloudinary } from '../../utilts/multer.js';
import { checkRole } from '../../midlleware/role.js';
import { auth } from '../../midlleware/auth.js';

const router = Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Brand:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *         name:
 *           type: string
 *           example: "BrandX"
 *         logo:
 *           type: string
 *           example: "http://cloudinary.com/brandx-logo.jpg"
 *         isDeleted:
 *           type: boolean
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-02-22T10:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-02-22T12:00:00Z"
 *       required:
 *         - name
 *         - logo
 *     Error:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "fail"
 *         message:
 *           type: string
 *           example: "Brand not found"
 */

/**
 * @swagger
 * /create-brand:
 *   post:
 *     summary: Create a new brand
 *     description: Allows Admins or Agents to create a brand with a logo uploaded to Cloudinary.
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "BrandX"
 *               logo:
 *                 type: string
 *                 format: binary
 *                 description: "Brand logo image file"
 *             required:
 *               - name
 *               - logo
 *     responses:
 *       201:
 *         description: Brand created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   $ref: '#/components/schemas/Brand'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Admin or Agent role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/create-brand', auth, checkRole('Admin', 'Agent'), upload.single('logo'), uploadToCloudinary(true, "single"), validation({ body: createBrandSchema }), createBrand);

/**
 * @swagger
 * /get-all-brands:
 *   get:
 *     summary: Get all active brands
 *     description: Retrieves a list of all non-deleted brands.
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of brands retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Brand'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/get-all-brands', auth, getAllBrands);

/**
 * @swagger
 * /get-brand-by-id/{brandId}:
 *   get:
 *     summary: Get a brand by ID
 *     description: Retrieves a specific brand by its ID.
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: brandId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Brand retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   $ref: '#/components/schemas/Brand'
 *       404:
 *         description: Brand not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/get-brand-by-id/:brandId', auth, validation({ params: getBrandByIdSchema }), getBrandById);

/**
 * @swagger
 * /get-all-admin-brands:
 *   get:
 *     summary: Get all brands (Admin)
 *     description: Retrieves all brands (including deleted ones) for Admins.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all brands retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Brand'
 *       403:
 *         description: Forbidden - Admin role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/get-all-admin-brands', auth, checkRole('Admin'), getAllAdminBrands);

/**
 * @swagger
 * /get-all-deleted-brands:
 *   get:
 *     summary: Get all deleted brands (Admin)
 *     description: Retrieves all brands marked as deleted for Admins.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of deleted brands retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Brand'
 *       403:
 *         description: Forbidden - Admin role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/get-all-deleted-brands', auth, checkRole('Admin'), getAllDeletedBrands);

/**
 * @swagger
 * /restore-brand/{brandId}:
 *   patch:
 *     summary: Restore a deleted brand (Admin)
 *     description: Restores a soft-deleted brand.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: brandId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Brand restored successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   $ref: '#/components/schemas/Brand'
 *       404:
 *         description: Brand not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Admin role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch('/restore-brand/:brandId', auth, checkRole('Admin'), validation({ params: restoreBrandSchema }), restoreBrand);

/**
 * @swagger
 * /update-brand/{brandId}:
 *   patch:
 *     summary: Update a brand (Admin)
 *     description: Updates an existing brand. Logo is optional.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: brandId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated BrandX"
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: "Optional new logo image"
 *     responses:
 *       200:
 *         description: Brand updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   $ref: '#/components/schemas/Brand'
 *       404:
 *         description: Brand not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Admin role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch('/update-brand/:brandId', auth, checkRole('Admin'), upload.single('image'), uploadToCloudinary(false), validation({ body: updateBrandSchema, params: getBrandByIdSchema }), updateBrand);

/**
 * @swagger
 * /delete-brand/{brandId}:
 *   delete:
 *     summary: Soft delete a brand (Admin)
 *     description: Marks a brand as deleted (soft delete).
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: brandId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Brand soft deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Brand marked as deleted"
 *       404:
 *         description: Brand not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Admin role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/delete-brand/:brandId', auth, checkRole('Admin'), validation({ params: deleteBrandSchema }), deleteBrand);

export default router;