const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const USERS = mongoose.model(process.env.USERS_MODEL);


const getAll = (req, res) => {
    const response = {
        status: process.env.HTTP_READ_STATUS_CODE,
        message: ""
    };

    let offset = parseInt(process.env.DEFAULT_FIND_OFFSET, 10);
    let count = parseInt(process.env.DEFAULT_FIND_COUNT, 10);
    let max = parseInt(process.env.MAX_FIND_COUNT, 10);


    if (req.query && req.query.offset) {
        offset = parseInt(req.query.offset, 10);
    }

    if (req.query && req.query.count) {
        count = parseInt(req.query.count, 10);
    }

    if (isNaN(offset) || isNaN(count)) {
        console.log("Offset or Count is not a number");
        response.status = process.env.HTTP_BAD_REQUEST_STATUS_CODE;
        response.message = "offset and count must be digit";
    }

    if (count > max) {
        console.log("Count greater than max");
        response.status = process.env.HTTP_BAD_REQUEST_STATUS_CODE;
        response.message = "Count cannot be greater than " + max;
    }

    if (response.status != process.env.HTTP_READ_STATUS_CODE) {
        res.status(response.status).json({ status: "failed", msg: response.message });
    } else {
        USERS.find().skip(offset).limit(count).then((users) =>
            _returnFoundUsers(users, response))
            .catch((err) => _errorHandler(err, response))
            .finally(() => _sendResponse(res, response));
    }
};


const addOne = (req, res) => {
    const response = {
        status: 201,
        message: {}
    };
    if (req.body && req.body.name && req.body.email && req.body.password) {
        const salt = bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS), (err, salt) =>
            _checkErrorThenCreateUser(err, salt, req, res, response));
    } else {
        response.status = process.env.HTTP_BAD_REQUEST_STATUS_CODE;
        response.message = process.env.USER_PARAMS_ERROR_MSG;
        _sendResponse(res, response);
    }
};


const login = (req, res) => {

    const response = {
        status: process.env.HTTP_READ_STATUS_CODE,
        message: ""
    };

    if (req.params && req.body && req.body.email && req.body.password) {
        USERS.findOne({ email: req.body.email })
            .then((user) => _findUserComparePasswordAndReturnResponse(user, req, response, res))
            .catch((err) => _errorHandler(err, response));
        // .finally((res, response)=>_sendResponse(res, response));
    } else {
        response.status = process.env.HTTP_BAD_REQUEST_STATUS_CODE;
        Response.message = "You must provide username and password";
        res.status(response.status).json(response.message);
    }
};


const blockUser = (req, res) => {
    const { userId, response } = _validateUserIdFromReqAndReturnUserIdAndResponse(req);
    if (response.status != process.env.HTTP_READ_STATUS_CODE) {
        res.status(response.status).json(response.message);

    } else {
        USERS.findById(userId)
            .then((user) => {
                console.log(user);
                _blockUser(user, res, response);
            })
            .catch((err) => _errorHandler(err, response));
        // .finally(() => _sendResponse(res, response));
    }
}

const _checkErrorThenCreateUser = (err, salt, req, res, response) => {
    if (err) {
        _errorHandler(err, response);
    } else {
        bcrypt.hash(req.body.password, salt, (err, hashedPassword) =>
            _checkErrorCreatePasswordHashThenCreateUser(err, hashedPassword, req, res, response));
    }
};

const _checkErrorCreatePasswordHashThenCreateUser = (err, hashedPassword, req, res, response) => {
    if (err) {
        _errorHandler(err, response);
    } else {
        let name = req.body.name;
        let email = req.body.email;

        let newUser = {
            name: name,
            email: email,
            password: hashedPassword
        };
        USERS.create(newUser)
            .then((savedUser) => _saveNewUserAndReturnResponse(savedUser, response))
            .catch((err) => _errorHandler(err, response))
            .finally(() => _sendResponse(res, response));
    }
};

const _sendResponse = (res, response) => {
    res.status(response.status).json(response.message);
};

const _saveNewUserAndReturnResponse = (savedUser, response) => {
    response.status = process.env.HTTP_CREATE_STATUS_CODE;
    response.message = savedUser;
};

const _errorHandler = (err, response) => {
    response.status = process.env.HTTP_SERVER_ERROR_STATUS_CODE;
    response.message = err;
};

const _returnFoundUsers = (foundUsers, response) => {
    response.status = process.env.HTTP_READ_STATUS_CODE;
    response.message = foundUsers;
};


const _findUserComparePasswordAndReturnResponse = (user, req, response, res) => {
    if (user) {
        console.log(user);
        bcrypt.compare(req.body.password, user.password)
            .then((match) => _comparePasswordAndReturnResponse(match, user, response))
            .catch((err) => _errorHandler(err, response))
            .finally(() => _sendResponse(res, response));
    } else {
        response.status = process.env.HTTP_NOT_FOUND_STATUS_CODE;
        response.message = "Invalid email";
        res.status(response.status).json(response.message);
    }

};

const _comparePasswordAndReturnResponse = (match, user, response) => {
    if (match) {
        const token = generateAccessToken(user.name);
        response.message = { success: true, token: token };
        console.log(response);
    } else {

        response.status = process.env.HTTP_BAD_REQUEST_STATUS_CODE;
        response.message = { success: false };
    }

};

const _validateUserIdFromReqAndReturnUserIdAndResponse = (req) => {
    const response = {
        status: process.env.HTTP_READ_STATUS_CODE,
        message: {}
    };
    const { userId } = req.params;

    if (req.params && userId) {
        if (!mongoose.isValidObjectId(userId)) {
            console.log("Invalid userId");
            response.status = process.env.HTTP_BAD_REQUEST_STATUS_CODE;
            response.message = "Invalid userId";
        }
    } else {
        console.log("movieId not provided");
        response.status = process.env.HTTP_BAD_REQUEST_STATUS_CODE;
        response.message = "userId not provided";
    }

    return {
        userId: userId,
        response: response
    };
};

const _blockUser = (user, res, response) => {
    if (user) {
        user.blocked = (user.blocked == "Yes") ? "No" : "Yes";
        user.save((err, updatedUser) => _updateUserAndSendResponse(err, updatedUser, response, res));
    } else {
        console.log("user with given id not found");
        response.status = process.env.HTTP_NOT_FOUND_STATUS_CODE;
        response.message = process.env.HTTP_MOVIE_NOT_FOUND_MSG;
        res.status
            (response.status).json
            (response.message);
    }

};

const _updateUserAndSendResponse = (err, user, response, res) => {

    if (err) {
        response.status = process.env.HTTP_SERVER_ERROR_STATUS_CODE;
        response.message = err;
        res.status
            (response.status).json
            (response.message);
    }
    else {
        response.status = process.env.HTTP_CREATE_STATUS_CODE;
        response.message = user;

        res.status
            (response.status).json
            (response.message);
    }
};

function generateAccessToken(username) {
    return jwt.sign({ name: username }, process.env.TOKEN_SECRET, { expiresIn: '3600s' });
}

module.exports = {
    addOne,
    getAll,
    login,
    blockUser,
};