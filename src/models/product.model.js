import mongoose, { Schema } from 'mongoose';
import slugify from 'slugify';

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
            maxlength: 200,
            index: true,
        },

        description: {
            type: String,
            required: [true, 'Product description is required'],
            trim: true,
            maxlength: 2000,
            index: true,
        },

        price: {
            type: Number,
            required: true,
            min: [0, 'Price cannot be negative'],
        },

        type: {
            type: String,
            required: true,
            enum: [
                'Bed',
                'Sofa',
                'Chair',
                'Table',
                'Wardrobe',
                'Cabinet',
                'Bookshelf',
                'Desk',
                'Dresser',
                'TV Stand',
                'Nightstand',
                'Outdoor Furniture',
                'Other',
            ],
        },

        images: [
            {
                type: String,
            },
        ],

        stock: {
            type: Number,
            required: true,
            min: [0, 'Stock cannot be negative'],
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

productSchema.pre('save', async function () {
    if (!this.isModified("name")) return;
    this.slug = slugify(this.name, { lower: true });
});

export const Product = mongoose.model('Product', productSchema);
