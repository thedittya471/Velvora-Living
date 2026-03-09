import { Router } from 'express';
import {
    createOrder,
    getUserOrders,
    getOrderById,
    getAllOrders,
} from '../controllers/order.controller.js';
import { jwtVerify, adminVerify } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/create-order').post(jwtVerify, createOrder);

router.route('/get-user-orders').get(jwtVerify, getUserOrders);

router.route('/get-order/:id').get(jwtVerify, getOrderById);

router.route('./get-all-orders').get(jwtVerify, adminVerify, getAllOrders);
