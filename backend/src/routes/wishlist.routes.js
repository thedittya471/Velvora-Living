import Router from 'express';
import {
    addToWishlist,
    getWishlist,
} from '../controllers/wishlist.controller.js';
import { jwtVerify } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/add-to-wishlist').post(jwtVerify, addToWishlist);

router.route('/get-wishlist').get(jwtVerify, getWishlist);

export default router;
