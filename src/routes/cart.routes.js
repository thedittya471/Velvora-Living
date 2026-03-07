import { Router } from 'express'
import { addToCart, getCart, updateCartItem, clearCart } from '../controllers/cart.controller.js'
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
router.route('/update-cart-item/:productId').put(
    jwtVerify,
    updateCartItem
)
router.route('/clear-cart').delete(
    jwtVerify,
    clearCart
)

export default router