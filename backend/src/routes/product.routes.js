import { Router } from 'express';
import { createProduct, getProducts, getProductsById, updateProduct, deleteProduct } from '../controllers/product.controller.js';
import { jwtVerify, adminVerify } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();

router.route('/get-products').get(getProducts)
router.route('/get-products/:productId').get(getProductsById)

// admin secured route
router.route('/create-product').post(
    jwtVerify,
    adminVerify,
    upload.array('images', 5), 
    createProduct
);
router.route('/update-product/:productId').put(
    jwtVerify,
    adminVerify,
    upload.array('images', 5),
    updateProduct
)
router.route('/delete-product/:productId').delete(
    jwtVerify,
    adminVerify,
    deleteProduct
)

export default router;
