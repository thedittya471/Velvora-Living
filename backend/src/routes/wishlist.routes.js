import Router from 'express';
import {
    addToWishlist,
    getWishlist,
    removeFromWishlist
} from '../controllers/wishlist.controller.js';
import { jwtVerify } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/add-to-wishlist').post(jwtVerify, addToWishlist);

router.route('/get-wishlist').get(jwtVerify, getWishlist);

router.route('/remove-from-wishlist/:productId').delete(jwtVerify, removeFromWishlist);

export default router;
