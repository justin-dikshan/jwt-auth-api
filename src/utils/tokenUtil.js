const jwt = require("jsonwebtoken");

const TIME_UNITS = {
    's': 1000,              // seconds to milliseconds
    'm': 60 * 1000,        // minutes to milliseconds
    'h': 3600 * 1000,      // hours to milliseconds
    'd': 86400 * 1000      // days to milliseconds
};
/**
 * Converts a time value from environment variables to milliseconds
 * @param {string} value - Environment variable name (e.g., 'ACCESS_TOKEN_EXPIRY')
 * @param {any} defaultValue - Default value in milliseconds if env var is not set
 * @returns {number} Time in milliseconds
 */
const getExpiryTime = (value, defaultValue = '1d') => {
    try {
        if (!value) return defaultValue;

        if (typeof value === 'string') {
            const unit = value.slice(-1).toLowerCase();
            const amount = parseInt(value.slice(0, -1), 10);
            // Return default if amount is not a valid number
            if (isNaN(amount)) return defaultValue;
            // If unit exists in our mapping, use it; otherwise treat as seconds
            const multiplier = TIME_UNITS[unit] || 1000;
            return amount * multiplier;
        }
        // If value is not a string, assume it's in seconds
        return parseInt(value, 10) * 1000;
    } catch (e) {
        throw e;
    }
};

/**
 * Issues a JWT token for a user
 * @param {Object} user - User object containing username, roles, and _id
 * @param {string} secret - Secret key for signing the token
 * @param {string|number} expiresIn - Token expiration time
 * @param {Object} [additionalParams={}] - Additional parameters to include in the token payload
 * @returns {string} Signed JWT token
 */
const issueToken = (user, secret, expiresIn, additionalParams = {}) => {
    try {
        const payload = {
            username: user.username,
            roles: user.roles,
            _id: user._id,
            ...additionalParams
        };
        return jwt.sign(payload, secret, { expiresIn: `${expiresIn}` });
    } catch (e) {
        throw e;
    }
}


/**
 * Generates access and refresh tokens for a user
 * @param {Object} user - User object containing username, roles, and _id
 * @param {string} accessTokenSecret - Secret key for signing access token
 * @param {string} refreshTokenSecret - Secret key for signing refresh token
 * @param {string|number} accessTokenExpire - Expiration time for access token
 * @param {string|number} refreshTokenExpire - Expiration time for refresh token
 * @returns {Object} Object containing access token and refresh token
 * @throws {Error} If token generation fails
 */
const getTokens = (user, accessTokenSecret, refreshTokenSecret, accessTokenExpire, refreshTokenExpire) => {
    try {
        const accessTokenExpireTime = getExpiryTime(accessTokenExpire);
        const refreshTokenExpireTime = getExpiryTime(refreshTokenExpire);
        const accessToken = issueToken(user, accessTokenSecret, accessTokenExpireTime);
        const refreshToken = issueToken(user, refreshTokenSecret, refreshTokenExpireTime);
        return { accessToken : accessToken, refreshToken : refreshToken }
    } catch (e) {
        throw e;
    }
}

module.exports = {
    getExpiryTime,
    getTokens
};