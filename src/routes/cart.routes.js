import { Router } from 'express'
import { addToCart } from '../controllers/cart.controller.js'
import { jwtVerify } from '../middlewares/auth.middleware.js'

const router = Router()

router.route('/add-to-cart').post(
    jwtVerify,
    addToCart
)

export default router