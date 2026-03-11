import { Cart } from '../models/cart.model.js';
import { Product } from '../models/product.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';

const addToCart = asyncHandler(async (req, res) => {
    const { productId } = req.body;

    if (!productId) throw new apiError(400, 'Product id is required');

    const product = await Product.findById(productId);
    if (!product) throw new apiError(404, 'Invalid product id');

    if (product.stock <= 0) {
        throw new apiError(400, 'Product is out of stock');
    }

    // support different product field names safely
    const productName = product?.name || product?.title || product?.productName;
    if (!productName) {
        throw new apiError(400, 'Product name is missing in product document');
    }

    // normalize images to string[]
    const productImages = Array.isArray(product?.images)
        ? product.images.map((img) => (typeof img === 'string' ? img : img?.url)).filter(Boolean)
        : [];

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        cart = await Cart.create({
            user: req.user._id,
            items: [
                {
                    product: product._id,
                    name: productName,
                    images: productImages,
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
            if (cart.items[itemIndex].quantity >= product.stock) {
                throw new apiError(400, 'Product is out of stock');
            }

            cart.items[itemIndex].quantity += 1;
            cart.items[itemIndex].name = productName;
            cart.items[itemIndex].images = productImages;
            cart.items[itemIndex].price = product.price;
        } else {
            cart.items.push({
                product: product._id,
                name: productName,
                images: productImages,
                quantity: 1,
                price: product.price,
            });
        }

        await cart.save();
    }

    await cart.populate({
        path: 'items.product',
        select: 'name price images stock',
    });

    return res
        .status(200)
        .json(new apiResponse(200, cart, 'Product added to cart'));
});

const getCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id }).populate({
        path: 'items.product',
        select: 'name price images stock',
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

    if (itemIndex === -1) {
        throw new apiError(404, 'Cart item not found');
    }

    if (quantity === 1) {
        const product = await Product.findById(productId).select('stock name');

        if (!product) {
            throw new apiError(404, 'Product not found');
        }

        if (product.stock <= cart.items[itemIndex].quantity) {
            throw new apiError(400, 'Product is out of stock');
        }

        cart.items[itemIndex].name = product.name;
    }

    cart.items[itemIndex].quantity += quantity;

    if (cart.items[itemIndex].quantity <= 0) {
        cart.items.splice(itemIndex, 1);
    }

    await cart.save();

    await cart.populate({
        path: 'items.product',
        select: 'name price images stock',
    });

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