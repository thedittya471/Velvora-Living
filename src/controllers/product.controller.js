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

    const files = Array.isArray(req.files) ? req.files : req.files?.images || [];

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

export { createProduct };
