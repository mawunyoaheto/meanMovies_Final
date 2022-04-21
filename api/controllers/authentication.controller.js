const jwt = require("jsonwebtoken");
const util = require("util");



const authenticateToken = (req, res, next) => {
    const response = {
    status: process.env.HTTP_FORBIDDEN_STATUS_CODE,
    message: process.env.UNAUTHORIZED_MSG
    };

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.status(process.env.HTTP_BAD_REQUEST_STATUS_CODE).json(process.env.NO_TOKEN_PROVIDED_MSG);
    const jwtVerifyPromise = util.promisify(jwt.verify, {context:jwt});
        jwtVerifyPromise(token, process.env.TOKEN_SECRET)
        .then(() => next())
        .catch((err) => _invalidAuthorizationToken(err, res, response));
};

const _invalidAuthorizationToken = (err, res, response) => {
    console.log(err);
    res.status(response.status).json(response.message);
};

module.exports = {
    authenticateToken
};