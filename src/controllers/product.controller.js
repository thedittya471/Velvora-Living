import { Product } from '../models/product.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

const createProduct = asyncHandler(async (req, res) => {
    const { name, description, price, type, stock } = req.body;

    if (!name || !description || !price || !type || !stock) {
        throw new apiError(400, 'All fields are required');
    }

    const files = Array.isArray(req.files)
        ? req.files
        : req.files?.images || [];

    let imageUrls = [];

    if (files.length === 0) {
        throw new apiError(400, 'At least one image is required');
    }
    for (const file of files) {
        const uploadedImage = await uploadOnCloudinary(file.path);

        if (uploadedImage?.secure_url) {
            imageUrls.push(uploadedImage.secure_url);
        }
    }

    const product = await Product.create({
        name,
        description,
        price,
        type,
        stock,
        images: imageUrls,
        createdBy: req.user._id,
    });

    return res
        .status(201)
        .json(new apiResponse(201, product, 'Product created successfully'));
});

const getProducts = asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.type) {
        filter.type = req.query.type;
    }

    let sortOption = { createdAt: -1 }
    
    if (req.query.sort === "price_asc") {
        sortOption = { price: 1 }
    }

    if (req.query.sort === "price_desc") {
        sortOption = { price: -1 }
    }

    if (req.query.sort === "oldest") {
        sortOption = { createdAt: 1 }
    }

    const products = await Product.find(filter)
        .skip(skip)
        .limit(limit)
        .sort(sortOption);

    const totalProducts = await Product.countDocuments(filter);

    return res.status(200).json(
        new apiResponse(
            200,
            {
                products,
                totalProducts,
                page,
                totalPages: Math.ceil(totalProducts / limit),
            },
            'Products fetched successfully'
        )
    );
});

const getProductsById = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
        throw new apiError(404, 'Product not found');
    }

    return res
        .status(200)
        .json(new apiResponse(200, product, 'Product fetched successfully'));
});

const updateProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
        throw new apiError(404, 'Invalid product id');
    }

    const { name, description, price, stock } = req.body;

    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (stock) product.stock = stock;

    if (req.files && req.files.length > 0) {
        const imageUrls = [];

        for (const file of req.files) {
            const uploadedImage = await uploadOnCloudinary(file.path);

            if (uploadedImage?.secure_url) {
                imageUrls.push(uploadedImage.secure_url);
            }
        }

        product.images = imageUrls;
    }

    await product.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new apiResponse(200, product, 'Product updated successfully'));
});

const deleteProduct = asyncHandler(async (req, res) => {

    const { productId } = req.params

    const product = await Product.findById(productId)

    if(!product){
        throw new apiError(404, "Invalid product id")
    }

    await product.deleteOne()
    
    return res.status(200).json(new apiResponse(200, null, "Product deleted successfully"))
})

export { createProduct, getProducts, getProductsById, updateProduct, deleteProduct };
