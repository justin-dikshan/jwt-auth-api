const bcrypt = require('bcryptjs');
const User = require('../modules/User');
const { BadRequestException, ValidationError } = require("../utils/error");
const jwt = require('jsonwebtoken');
const {getExpiryTime, getTokens } = require("../utils/tokenUtil");

/**
 * Authenticates a user and issues access and refresh tokens
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing login credentials
 * @param {string} req.body.username - User's username
 * @param {string} req.body.password - User's password
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Response with access and refresh tokens
 */
const login = async (req, res, next) => {
    try {
        // Extract username and password from request body
        const { username, password } = req.body;
        // Find user by username
        const user = await User.findOne({username : username});
        if (!user) throw new BadRequestException('No user found');
        // Verify password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) throw new ValidationError('Incorrect password');
        // Generate access and refresh tokens
        const tokens = getTokens(user, process.env.ACCESS_TOKEN_SECRET, process.env.REFRESH_TOKEN_SECRET, process.env.ACCESS_TOKEN_EXPIRE, process.env.REFRESH_TOKEN_EXPIRE)
        // Store refresh token in user document
        user.refreshTokens.push(tokens.refreshToken);
        await user.save();
        // Send tokens in response
        return res.send({accessToken : tokens.accessToken, refreshToken: tokens.refreshToken})
    } catch (e){
        // Pass any errors to the global error handler
        return next(e)
    }
}


const logout = async (req, res, next) => {
    try {  
        // Extract refresh token from cookies
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) throw new BadRequestException('refresh token not found')
        // Verify the refresh token and decode its payload
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) throw new BadRequestException('Invalid refresh token');
            return decoded;                         
        })  
        // Find the user associated with the token
        const user = await User.findOne({_id : decoded._id});
        // Validate user exists and token is in their refreshTokens array
        if (!user ||!user.refreshTokens.includes(refreshToken)) throw new BadRequestException('User not found');
        // Remove the refresh token from the user's refreshTokens array
        user.refreshTokens = user.refreshTokens.filter(token => token !== refreshToken);
        await user.save();
        // Clear the refresh token cookie
        res.clearCookie('refreshToken');
        // Return success response
        return res.status(200).json({message : 'Logged out successfully'});
        
    } catch (e){
        return next(e)
    }
}

/**
 * Registers a new user
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing registration details
 * @param {string} req.body.username - User's username
 * @param {string} req.body.password - User's password
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Response with success message
 */
const register = async (req, res, next) => {
    try {
        // Extract username and password from request body
        const { username, password } = req.body;
        // Generate a salt for password hashing
        const salt = await bcrypt.genSalt(10);
        // Hash the password with the generated salt
        const hasPassword  = await bcrypt.hash(password, salt);
        // Create new user document in database with hashed password
        const user = await User.insertOne({username : username, password : hasPassword})
        // Return success response with created username
        return res.status(200).json({message : `successfully created : ${user.username}`})
    } catch (e){
        // Pass any errors to global error handler
        return next(e)
    }
}

const tokenRefresh = async (req, res, next) => {
    try {
        // Extract refresh token from cookies
        const refreshToken = req.cookies.refreshToken;
        console.log("req.cookies", req.cookies.refreshToken)
        if (!refreshToken) throw new BadRequestException('refresh token not found')
        // Verify the refresh token and decode its payload
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) throw new BadRequestException('Invalid refresh token');
            return decoded;
        });
        // Find the user associated with the token
        const user = await User.findOne({_id : decoded._id});
        // Validate user exists and token is in their refreshTokens array
        if (!user || !user.refreshTokens.includes(refreshToken)) throw new BadRequestException('User not found');
        // Generate new access and refresh tokens
        const tokens = getTokens(user, process.env.ACCESS_TOKEN_SECRET, process.env.REFRESH_TOKEN_SECRET, process.env.ACCESS_TOKEN_EXPIRE, process.env.REFRESH_TOKEN_EXPIRE)
        // Store the new refresh token in user's refreshTokens array
        user.refreshTokens.push(tokens.refreshToken);
        await user.save();
        // Calculate cookie expiration time
        const maxAge = getExpiryTime(process.env.REFRESH_TOKEN_EXPIRE)
        // Set the refresh token as an HTTP-only cookie
        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: maxAge 
        });
        // Send the new access token in the response
        res.json({ accessToken: tokens.accessToken });
    } catch (e) {
        // Pass any errors to the global error handler
        return next(e)
    }
}

module.exports = {
    register,
    login,
    tokenRefresh,
    logout
}