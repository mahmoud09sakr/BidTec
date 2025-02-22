import { Router } from 'express';
import { auth } from '../../midlleware/auth.js';
import { checkRole } from '../../midlleware/role.js';
import { upload, uploadToCloudinary } from '../../utilts/multer.js';
import { createSubCategory, deleteSubCategory, getAdminSubCategories, getAllDeletedSubCategories, getAllSubCategories, getSubCategoryById, restoreSubCategory, updateSubCategory } from './subcategory.service.js';
import { createSubCategorySchema, deleteSubCategorySchema, getSubCategorySchema, restoreSubCategorySchema, updateSubCategorySchema } from './subcategory.validation.js';
import { validation } from '../../utilts/validation.js';
const router = Router(
    {
        mergeParams: true,
        strict: true
    }
);
/**
 * @swagger
 * components:
 *   schemas:
 *     SubCategory:
 *       type: object
 *       required:
 *         - name
 *         - image
 *         - categoryId
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the subcategory
 *         image:
 *           type: string
 *           format: uri
 *           description: URL of the subcategory image
 *         categoryId:
 *           type: string
 *           description: ID of the parent category
 */
/**
 * @swagger
 * /create-subcategory:
 *   post:
 *     summary: Create a new subcategory
 *     security:
 *       - BearerAuth: []
 *     tags: [Subcategories]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/SubCategory'
 *     responses:
 *       201:
 *         description: Subcategory created successfully
 */
router.post('/create-subcategory', auth, checkRole('Admin', 'Agent'), upload.single('image'), uploadToCloudinary(), validation(createSubCategorySchema), createSubCategory);

/**
 * @swagger
 * /get-all-subcategories:
 *   get:
 *     summary: Get all subcategories
 *     security:
 *       - BearerAuth: []
 *     tags: [Subcategories]
 *     responses:
 *       200:
 *         description: List of subcategories
 */
router.get('/get-all-subcategories', auth, checkRole('Admin', 'Agent'), validation(getSubCategorySchema), getAllSubCategories);

/**
 * @swagger
 * /get-all-admin-subcategories:
 *   get:
 *     summary: Get all subcategories for admin
 *     security:
 *       - BearerAuth: []
 *     tags: [Subcategories]
 *     responses:
 *       200:
 *         description: List of admin subcategories
 */
router.get('/get-all-admin-subcategories', auth, checkRole('Admin'), validation(getSubCategorySchema), getAdminSubCategories);

/**
 * @swagger
 * /get-all-deleted-subcategories:
 *   get:
 *     summary: Get all deleted subcategories
 *     security:
 *       - BearerAuth: []
 *     tags: [Subcategories]
 *     responses:
 *       200:
 *         description: List of deleted subcategories
 */
router.get('/get-all-deleted-subcategories', auth, checkRole('Admin'), validation(getSubCategorySchema), getAllDeletedSubCategories);
/**
 * @swagger
 * /restore-subcategory/{subCategoryId}:
 *   patch:
 *     summary: Restore a deleted subcategory
 *     security:
 *       - BearerAuth: []
 *     tags: [Subcategories]
 *     parameters:
 *       - in: path
 *         name: subCategoryId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subcategory restored successfully
 */
router.patch('/restore-subcategory/:subCategoryId', auth, checkRole('Admin'), validation(restoreSubCategorySchema), restoreSubCategory);

/**
 * @swagger
 * /update-subcategory/{subCategoryId}:
 *   patch:
 *     summary: Update a subcategory
 *     security:
 *       - BearerAuth: []
 *     tags: [Subcategories]
 *     parameters:
 *       - in: path
 *         name: subCategoryId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/SubCategory'
 *     responses:
 *       200:
 *         description: Subcategory updated successfully
 */
router.patch('/update-subcategory/:subCategoryId', auth, checkRole('Admin'), upload.single('image'), uploadToCloudinary(false), validation(updateSubCategorySchema), updateSubCategory);

/**
 * @swagger
 * /delete-subcategory/{subCategoryId}:
 *   delete:
 *     summary: Delete a subcategory
 *     security:
 *       - BearerAuth: []
 *     tags: [Subcategories]
 *     parameters:
 *       - in: path
 *         name: subCategoryId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subcategory deleted successfully
 */
router.delete('/delete-subcategory/:subCategoryId', auth, checkRole('Admin'), validation(deleteSubCategorySchema), deleteSubCategory);

router.get('/get-subcategory-by-id/:subCategoryId', auth, validation(getSubCategorySchema), getSubCategoryById);
export default router;
