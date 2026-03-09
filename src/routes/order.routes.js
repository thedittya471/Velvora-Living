import { Router } from 'express';
import {
    createOrder,
    getUserOrders,
} from '../controllers/order.controller.js';
import { jwtVerify } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/create-order').post(jwtVerify, createOrder);

router.route('/get-user-orders').get(jwtVerify, getUserOrders);

