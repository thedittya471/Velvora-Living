import { Cart } from '../models/cart.model.js';
import { Product } from '../models/product.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';

const addToCart = asyncHandler(async (req, res) => {
    const { productId } = req.body;

    if (!productId) {
        throw new apiError(400, 'Product id is required');
    }

    const product = await Product.findById(productId);

    if (!product) {
        throw new apiError(404, 'Invalid product id');
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        cart = await Cart.create({
            user: req.user._id,
            items: [
                {
                    product: productId,
                    quantity: 1,
                    price: product.price,
                },
            ],
        });
    } else {
        const itemIndex = cart.items.findIndex(
            (item) => item.product.toString() === productId
        );

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += 1;
        } else {
            cart.items.push({
                product: productId,
                quantity: 1,
                price: product.price,
            });
        }

        await cart.save();
    }

    return res
        .status(200)
        .json(new apiResponse(200, cart, 'Product added to cart'));
});

const getCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id }).populate({
        path: 'items.product',
        select: 'name price images quantity',
    });

    if (!cart) {
        return res
            .status(200)
            .json(new apiResponse(200, { items: [] }, 'Cart is empty'));
    }

    return res
        .status(200)
        .json(new apiResponse(200, cart, 'Cart fetched successfully'));
});

const updateCartItem = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || ![1, -1].includes(quantity)) {
        throw new apiError(400, 'Quantity must be 1 or -1');
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        throw new apiError(404, 'Cart not found');
    }

    const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() == productId
    );

    if (!quantity || ![1, -1].includes(quantity)) {
        throw new apiError(400, 'Quantity must be 1 or -1');
    }

    cart.items[itemIndex].quantity += quantity;

    if (cart.items[itemIndex].quantity <= 0) {
        cart.items.splice(itemIndex, 1);
    }

    await cart.save();

    return res
        .status(200)
        .json(new apiResponse(200, cart, 'Cart updated successfully'));
});

const clearCart = asyncHandler(async (req, res) => {

    const cart = await Cart.findOne({ user: req.user._id })

    if(!cart){
        throw new apiError(404, "Cart not found")
    }

    cart.items = []

    await cart.save()

    return res
        .status(200)
        .json(new apiResponse(200, cart, 'Cart cleared successfully'))
})

export { addToCart, getCart, updateCartItem, clearCart };
