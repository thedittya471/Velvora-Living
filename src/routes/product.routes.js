import { Router } from 'express';
import { createProduct, getProducts } from '../controllers/product.controller.js';
import { jwtVerify } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();

router.route('/create-product').post(
    jwtVerify,
    upload.array('images', 5), 
    createProduct
);
router.route('/get-products').get(getProducts)

export default router;
