import Router from 'express'
import { addToWishlist } from '../controllers/wishlist.controller.js'
import { jwtVerify } from '../middlewares/auth.middleware.js'

const router = Router()

router.route('/add-to-wishlist').post(jwtVerify, addToWishlist)