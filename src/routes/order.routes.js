import { Router } from 'express';
import { createOrder } from '../controllers/order.controller.js';
import { jwtVerify } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/create-order').post(jwtVerify, createOrder);
