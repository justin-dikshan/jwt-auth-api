const {UnauthorizedException} = require("../utils/error");
const jwt = require('jsonwebtoken');


const jwtMiddleware = async (req, res, next) => {
    try {
        if(checkAllowedRoutes(req)) return next()
        const headers = req.headers.authorization;
        const token = headers && headers.split(' ')[1];
        if(!token) throw new UnauthorizedException('Unauthorized');
        const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) throw new UnauthorizedException('Unauthorized');
            return decoded;
        });
        req.user = decode;
        next();
    } catch (e) {
        return next(e)
    }
}

const checkAllowedRoutes = req => {
    if (req.url === '/') {
        return true;
}}

module.exports = { jwtMiddleware }