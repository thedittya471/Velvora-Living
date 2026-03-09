import { Cart } from '../models/cart.model.js';
import { Order } from '../models/order.model.js';
import { Product } from '../models/product.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';

const createOrder = asyncHandler(async (req, res) => {
    const { shippingAddress, paymentMethod } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate(
        'items.product'
    );

    if (!cart || cart.items.length === 0) {
        throw new apiError(400, 'Your Cart is empty');
    }

    let totalPrice = 0;

    const orderItems = cart.items.map((item) => {
        totalPrice += item.price * item.quantity;

        return {
            product: item.product._id,
            quantity: item.quantity,
            price: item.price,
        };
    });

    for (const item of cart.items) {
        const product = await Product.findById(item.product._id);

        if (product.stock < item.quantity) {
            throw new apiError(400, 'Product out of stock');
        }

        product.stock -= item.quantity;

        await product.save({ validateBeforeSave: false });
    }

    const order = await Order.create({
        user: req.user._id,
        orderItems,
        shippingAddress,
        paymentMethod,
        totalPrice,
    });

    cart.items = [];
    await cart.save();

    return res
        .status(201)
        .json(new apiResponse(201, order, 'Order created successfully'));
});

const getUserOrders = asyncHandler(async (req, res) => {

  const orders = await Order.find({ user: req.user._id })
    .populate({
      path: "orderItems.product",
      select: "name images price"
    })
    .sort({ createdAt: -1 })

  return res.status(200).json(
    new apiResponse(200, orders, "User orders fetched successfully")
  )

})



export { createOrder, getUserOrders };
