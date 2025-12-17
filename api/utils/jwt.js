const jwt = require("jsonwebtoken");

const signToken = (payload) => {
    return jwt.sign(payload, process.env.MY_JWT_TOKEN, {expiresIn: "1h"});

};

const verifyToken = (token) => {
    return jwt.verify(token, process.env.MY_JWT_TOKEN,);
};

module.exports = { signToken, verifyToken };