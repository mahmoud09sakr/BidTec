import { Router } from 'express';
import categoriesModel from '../../database/model/category.model.js';
import { uploadToCloudinary, upload } from '../../utilts/multer.js';
import { validation } from '../../utilts/validation.js';
import { checkRole } from '../../midlleware/role.js'
import { auth } from '../../midlleware/auth.js';
import { createCategorySchema, deleteCategorySchema, getCategoryByIdSchema, restoreCategorySchema, updateCategorySchema } from './category.validation.js';
import { createCategory, deleteCategory, getAllAdminCategories, getAllCategories, getAllDeletedCategories, getCategoryById, restoreCategory, updateCategory } from './category.service.js'
const router = Router(
    {
        mergeParams: true,
        strict: true
    }
);
/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: API endpoints for managing categories
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
 *     Category:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - image
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the category
 *         description:
 *           type: string
 *           description: Description of the category
 *         image:
 *           type: string
 *           format: binary
 *           description: Image file for the category
 */

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Invalid input or category already exists
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Get a category by ID
 *     tags: [Categories]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The category ID
 *     responses:
 *       200:
 *         description: Category details
 *       404:
 *         description: Category not found
 */

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Update a category by ID
 *     tags: [Categories]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The category ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Category not found
 */

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete a category by ID
 *     tags: [Categories]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 */

router.post('/create-category', auth, checkRole('Admin', 'Agent'), upload.single('image'), uploadToCloudinary(true), validation(createCategorySchema), createCategory);
router.get('/get-all-categories', auth, getAllCategories);
router.get('/get-category-by-id/:categoryId', auth, validation(getCategoryByIdSchema), getCategoryById);
router.get('/get-all-admin-categories', auth, checkRole('Admin'), getAllAdminCategories);
router.get('/get-all-deleted-categories', auth, checkRole('Admin'), getAllDeletedCategories);
router.patch('/restore-category/:categoryId', auth, checkRole('Admin'),validation(restoreCategorySchema), restoreCategory);
router.patch('/update-category/:categoryId', auth, checkRole('Admin'), upload.single('image'), validation(updateCategorySchema), uploadToCloudinary(false), validation(updateCategorySchema), updateCategory);
router.delete('/delete-category/:categoryId', auth, checkRole('Admin'), validation(deleteCategorySchema), deleteCategory);


export default router;