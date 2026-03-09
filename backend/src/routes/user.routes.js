import { Router } from 'express';
import { registerUser, loginUser, logOutUser, refreshAccessToken } from '../controllers/user.controller.js';
import { jwtVerify } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);

// secured routes

router.route('/logout').post(jwtVerify, logOutUser);
router.route('/refresh-token').post(refreshAccessToken);

export default router;
