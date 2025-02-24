import { Router } from 'express';
import { uploadToCloudinary, upload } from '../../utilts/multer.js';
import { validation } from '../../utilts/validation.js';
import { checkRole } from '../../midlleware/role.js';
import { auth } from '../../midlleware/auth.js';
import { addTagSchema, createProductSchema, deleteProductSchema, fileSchema, getProductByIdSchema, restoreProductSchema, updateProductSchema } from './product.validation.js';
import { createProduct, getAllProducts, getProductById, getAllAdminProducts, getAllDeletedProducts, updateProduct, deleteProduct, restoreProduct, addedTag } from './product.service.js';

const router = Router({
    mergeParams: true,
    strict: true
});

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *         name:
 *           type: string
 *           example: "Test Tire"
 *         slug:
 *           type: string
 *           example: "test-tire"
 *         price:
 *           type: number
 *           example: 100
 *         priceAfterDiscount:
 *           type: number
 *           example: 90
 *         description:
 *           type: string
 *           example: "A durable tire for all seasons"
 *         stock:
 *           type: number
 *           example: 50
 *         sold:
 *           type: number
 *           example: 10
 *         imageCover:
 *           type: string
 *           example: "http://cloudinary.com/image1.jpg"
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           example: ["http://cloudinary.com/image2.jpg"]
 *         category:
 *           type: string
 *           example: "507f191e810c19729de860ea"
 *         subCategory:
 *           type: string
 *           example: "507f191e810c19729de860eb"
 *         brand:
 *           type: string
 *           example: "507f191e810c19729de860ec"
 *         tag:
 *           type: array
 *           items:
 *             type: string
 *           example: ["507f191e810c19729de860ed"]
 *         productType:
 *           type: string
 *           enum: ["tire", "battary"]
 *           example: "tire"
 *         isDeleted:
 *           type: boolean
 *           example: false
 *       required:
 *         - name
 *         - price
 *         - description
 *         - stock
 *         - imageCover
 *         - images
 *         - category
 *         - subCategory
 *         - brand
 *     Error:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "fail"
 *         message:
 *           type: string
 *           example: "Product not found"
 */

/**
 * @swagger
 * /create-product:
 *   post:
 *     summary: Create a new product
 *     description: Allows Admins or Agents to create a product with images uploaded to Cloudinary.
 *     tags: [Products]
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
 *                 example: "Test Tire"
 *               price:
 *                 type: number
 *                 example: 100
 *               description:
 *                 type: string
 *                 example: "A durable tire for all seasons"
 *               stock:
 *                 type: number
 *                 example: 50
 *               imageCover:
 *                 type: string
 *                 format: binary
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               category:
 *                 type: string
 *                 example: "507f191e810c19729de860ea"
 *               subCategory:
 *                 type: string
 *                 example: "507f191e810c19729de860eb"
 *               brand:
 *                 type: string
 *                 example: "507f191e810c19729de860ec"
 *               tag:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["507f191e810c19729de860ed"]
 *               productType:
 *                 type: string
 *                 enum: ["tire", "battary"]
 *                 example: "tire"
 *             required:
 *               - name
 *               - price
 *               - description
 *               - stock
 *               - imageCover
 *               - images
 *               - category
 *               - subCategory
 *               - brand
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   $ref: '#/components/schemas/Product'
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
 */
//TODO: 4a8ala local bss
router.post('/add-product', auth, checkRole('Admin', 'Agent'), upload.fields([
    { name: 'imageCover', maxCount: 1 },
    { name: 'images', maxCount: 10 }
]), uploadToCloudinary(true), validation({ body: createProductSchema, files: fileSchema }), createProduct);
//TODO: 4a8ala local bss
/**
 * @swagger
 * /get-all-products:
 *   get:
 *     summary: Get all active products
 *     description: Retrieves a list of all non-deleted products.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of products retrieved
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
 *                     $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/get-all-products', auth, getAllProducts);

/**
 * @swagger
 * /get-product-by-id/{productId}:
 *   get:
 *     summary: Get a product by ID
 *     description: Retrieves a specific product by its ID.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
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
router.get('/get-product-by-id/:productId', auth, validation(getProductByIdSchema), getProductById);

/**
 * @swagger
 * /get-all-admin-products:
 *   get:
 *     summary: Get all products (Admin)
 *     description: Retrieves all products (including deleted ones) for Admins.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all products retrieved
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
 *                     $ref: '#/components/schemas/Product'
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
router.get('/get-all-admin-products', auth, checkRole('Admin'), getAllAdminProducts);

/**
 * @swagger
 * /get-all-deleted-products:
 *   get:
 *     summary: Get all deleted products (Admin)
 *     description: Retrieves all products marked as deleted for Admins.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of deleted products retrieved
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
 *                     $ref: '#/components/schemas/Product'
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
router.get('/get-all-deleted-products', auth, checkRole('Admin'), getAllDeletedProducts);

/**
 * @swagger
 * /update-product/{productId}:
 *   patch:
 *     summary: Update a product (Admin)
 *     description: Updates an existing product. Images are optional.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: productId
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
 *                 example: "Updated Tire"
 *               price:
 *                 type: number
 *                 example: 120
 *               description:
 *                 type: string
 *                 example: "Updated description"
 *               stock:
 *                 type: number
 *                 example: 40
 *               imageCover:
 *                 type: string
 *                 format: binary
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               category:
 *                 type: string
 *                 example: "507f191e810c19729de860ea"
 *               subCategory:
 *                 type: string
 *                 example: "507f191e810c19729de860eb"
 *               brand:
 *                 type: string
 *                 example: "507f191e810c19729de860ec"
 *               tag:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["507f191e810c19729de860ed"]
 *               productType:
 *                 type: string
 *                 enum: ["tire", "battary"]
 *                 example: "tire"
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
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
router.patch('/update-product/:productId', auth, checkRole('Admin'),
    upload.fields([{ name: 'imageCover', maxCount: 1 }, { name: 'images', maxCount: 10 }]),
    uploadToCloudinary(false),
    validation(updateProductSchema),
    updateProduct);

/**
 * @swagger
 * /delete-product/{productId}:
 *   delete:
 *     summary: Soft delete a product (Admin)
 *     description: Marks a product as deleted (soft delete).
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Product soft deleted successfully
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
 *                   example: "Product marked as deleted"
 *       404:
 *         description: Product not found
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
router.delete('/delete-product/:productId', auth, checkRole('Admin'), validation({ params: deleteProductSchema }), deleteProduct);

/**
 * @swagger
 * /restore-product/{productId}:
 *   patch:
 *     summary: Restore a deleted product (Admin)
 *     description: Restores a soft-deleted product.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Product restored successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
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
router.patch('/restore-product/:productId', auth, checkRole('Admin'), validation(restoreProductSchema), restoreProduct);

/**
 * @swagger
 * /add-remove-tag/{productId}/{tagId}:
 *   patch:
 *     summary: Add or remove a tag from a product (Admin)
 *     description: Toggles a tag on a product—adds if not present, removes if present. Tag ID is optional.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *       - name: tagId
 *         in: path
 *         required: false
 *         schema:
 *           type: string
 *           example: "507f191e810c19729de860ed"
 *     responses:
 *       200:
 *         description: Tag added/removed or current tags returned
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
 *                   example: "Tag added"
 *                 data:
 *                   oneOf:
 *                     - $ref: '#/components/schemas/Product'  # When tagId provided
 *                     - type: object                          # When tagId omitted
 *                       properties:
 *                         tags:
 *                           type: array
 *                           items:
 *                             type: string
 *                           example: ["507f191e810c19729de860ed"]
 *       404:
 *         description: Product not found
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
router.patch('/add-remove-tag/:productId/:tagId?', auth, checkRole("Admin"), validation({ params: addTagSchema }), addedTag);

export default router;