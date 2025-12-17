const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

const authMiddleware = async (req, res, next) => {
    try {
        let token = null;
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }
        if (!token) return res.status(401).json({message:'Not authorized, token missing'});

        jwt.verify(token,process.env.MY_JWT_TOKEN, (err, user) => {
        if (err) return res.sendStatus(403);

        req.user = user;
        next();
    });
       
    } catch (err) {
        return res.status(401).json({message: ' Not authorized, token invalid'});
    };
};


module.exports = authMiddleware;