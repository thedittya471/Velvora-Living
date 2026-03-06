import { Router } from 'express'
import { addToCart, getCart } from '../controllers/cart.controller.js'
import { jwtVerify } from '../middlewares/auth.middleware.js'

const router = Router()

router.route('/add-to-cart').post(
    jwtVerify,
    addToCart
)
router.route('/get-cart').get(
    jwtVerify,
    getCart
)

export default router