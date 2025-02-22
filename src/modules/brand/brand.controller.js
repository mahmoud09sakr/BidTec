import { Router } from 'express';
import { createBrand, getAllBrands, getBrandById, getAllAdminBrands, getAllDeletedBrands, restoreBrand, updateBrand, deleteBrand } from './brand.service.js';
import { createBrandSchema, getBrandByIdSchema, updateBrandSchema, deleteBrandSchema, restoreBrandSchema } from './brand.validation.js';
import { validation } from '../../utilts/validation.js';
import { upload, uploadToCloudinary } from '../../utilts/multer.js';
import { checkRole } from '../../midlleware/role.js';
import { auth } from '../../midlleware/auth.js';
const router = Router();

router.post('/create-brand', auth, checkRole('Admin', 'Agent'), upload.single('logo'), uploadToCloudinary(true), validation(createBrandSchema), createBrand);
router.get('/get-all-brands', auth, getAllBrands);
router.get('/get-brand-by-id/:brandId', auth, validation(getBrandByIdSchema), getBrandById);
router.get('/get-all-admin-brands', auth, checkRole('Admin'), getAllAdminBrands);
router.get('/get-all-deleted-brands', auth, checkRole('Admin'), getAllDeletedBrands);
router.patch('/restore-brand/:brandId', auth, checkRole('Admin'), validation(restoreBrandSchema), restoreBrand);
router.patch('/update-brand/:brandId', auth, checkRole('Admin'), upload.single('image'), uploadToCloudinary(false), validation(updateBrandSchema), updateBrand);
router.delete('/delete-brand/:brandId', auth, checkRole('Admin'), validation(deleteBrandSchema), deleteBrand);

export default router;