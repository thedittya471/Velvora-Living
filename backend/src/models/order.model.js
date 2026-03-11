import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },

  quantity: {
    type: Number,
    required: true,
    min: 1
  },

  price: {
    type: Number,
    required: true
  }
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    orderItems: [orderItemSchema],

    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
      phone: { type: String, required: true }
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "Stripe", "Razorpay"],
      default: "COD"
    },

    totalPrice: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending"
    },

    isPaid: {
      type: Boolean,
      default: false
    },

    paidAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

export const Order = mongoose.model("Order", orderSchema);
