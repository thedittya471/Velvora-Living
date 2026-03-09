import { Wishlist } from '../models/wishlist.model.js';
import { Product } from '../models/product.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';

const addToWishlist = asyncHandler(async (req, res) => {
    const { productId } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
        throw new apiError(404, 'Product not found');
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
        wishlist = await Wishlist.create({
            user: req.user._id,
            products: [productId],
        });
    } else {
        if (wishlist.products.includes(productId)) {
            throw new apiError(400, 'Product already in wishlist');
        }

        wishlist.products.push(productId);

        await wishlist.save();
    }

    return res
        .status(200)
        .json(new apiResponse(200, wishlist, 'Product added to wishlist'));
});

const getWishlist = asyncHandler(async (req, res) => {
    const wishlist = await Wishlist.findOne({ user: req.user._id }).populate({
        path: 'products',
        select: 'name price images stock',
    });

    if (!wishlist) {
        return res
            .status(200)
            .json(new apiResponse(200, { products: [] }, 'Wishlist is empty'));
    }

    return res
        .status(200)
        .json(new apiResponse(200, wishlist, 'Wishlist fetched successfully'));
});

export { addToWishlist, getWishlist };
