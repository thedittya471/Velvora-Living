import { Router } from 'express';
import { registerUser, loginUser, logOutUser } from '../controllers/user.controller.js';
import { jwtVerify } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);

// secured routes

router.route('/logout').post(jwtVerify, logOutUser);

export default router;
