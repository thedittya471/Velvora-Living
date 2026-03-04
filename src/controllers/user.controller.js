import { User } from '../models/user.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';

const registerUser = asyncHandler(async (req, res) => {
    console.log(req.body);
    const { username, email, password, fullName, role } = req.body;

    if (!fullName || !email || !username || !password || !role) {
        throw new apiError(400, 'All fields are required');
    }

    const existingUser = await User.findOne({
        $or: [{ username }, { email }],
    });

    if (existingUser) {
        throw new apiError(400, 'Username or email already exists');
    }

    const user = await User.create({
        fullName,
        email,
        username: username.toLowerCase(),
        password,
        role,
    });

    const createdUser = await User.findById(user._id).select(
        '-password -refreshToken'
    );

    if (!createdUser) {
        throw new apiError(500, 'Failed to create user');
    }

    return res
    .status(201)
    .json(new apiResponse(201, createdUser, "User registered successfully"));


});


export { registerUser };
