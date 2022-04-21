const mongoose = require("mongoose");
const MOVIES = mongoose.model(process.env.MOVIES_MODEL);

const getAll = (req, res) => {
    console.log("Get All Movies Controller");

    if (req.query && req.query.search) {
        _searchByTitle(req, res);
        return;
    }
    const { offset, count, response } = _validateOffsetCountFromReqAndReturnOffsetCountAndResponse(req);
    if (response.status != process.env.HTTP_READ_STATUS_CODE) {
        res.status(response.status).json(response.message);
    } else {
        MOVIES.find().skip(offset).limit(count)
            .then((movies) => _getAllMoviesAndReturnResponse(movies, response))
            .catch((err) => _errorHandler(err, response))
            .finally(() => _sendResponse(res, response));
    }
};

const addOne = (req, res) => {
    const response = {
        status: process.env.HTTP_CREATE_STATUS_CODE,
        message: {}
    };

    let newMovie = {};

    newMovie.title = req.body.title;
    newMovie.year = parseInt(req.body.year, 10);

    if (req.body.actors) {
        newMovie.actors = req.body.actors;
    } else {
        newMovie.actors = [];
    }

    if (isNaN(newMovie.year)) {
        console.log("Year cannot be a string");
        response.status = process.env.HTTP_BAD_REQUEST_STATUS_CODE;
        response.message = process.env.INVALID_INPUT_MSG;
    }

    if (response.status != process.env.HTTP_CREATE_STATUS_CODE) {
        res.status(response.status).json(response.message);
    } else {
        MOVIES.create(newMovie)
            .then((savedMovie) => _saveNewMovieAndSendResponse(savedMovie, response))
            .catch((err) => _errorHandler(err, response))
            .finally(() => _sendResponse(res, response));
    }
};

const getOne = (req, res) => {
    console.log("Get One Movie Controller");
    const { movieId, response } = _validateMovieIdFromReqAndReturnMovieIdAndResponse(req);

    if (response.status != process.env.HTTP_READ_STATUS_CODE) {
        res.status(response.status).json({ status: "failed", msg: response.message });
    } else {
        MOVIES.findById(movieId)
            .then((movie) => _findMovieByIdAndReturnResponse(movie, response))
            .catch((err) => _errorHandler(err, response))
            .finally(() => _sendResponse(res, response));
    }
};

const _updateOne = (req, res, updateMoviecallBack) => {
    console.log("Update One  controller");

    const { movieId, response } = _validateMovieIdFromReqAndReturnMovieIdAndResponse(req);
    if (response.status != process.env.HTTP_READ_STATUS_CODE) {
        res.status(response.status).json(response.message);

    } else {
        MOVIES.findById(movieId)
            .then((movie) => {
                console.log(movie);
                updateMoviecallBack(movie, req, res, response);
            })
            .catch((err) => _errorHandler(err, response));
        // .finally(() => _sendResponse(res, response));
    }
};

const partialUpdateOne = async (req, res) => {
    movieUpdate = function (req, res, movie, response) {
        movie.title = req.body.title || movie.title;
        movie.year = req.body.year || movie.year;
        movie.actors = req.body.actors || movie.actors;
        movie.save((err, updatedMovie) => _updateMovieAndSendResponse(err, updatedMovie, response, res));
    };
    _updateOne(req, res, movieUpdate);
};

const replaceOne = (req, res) => {
    console.log("Full Update One Game Controller");
    movieUpdate = function (movie, req, res, response) {
        movie.title = req.body.title;
        movie.year = req.body.year;
        movie.actors = [];
        movie.save((err, updatedMovie) => _updateMovieAndSendResponse(err, updatedMovie, response, res));
        // movie.save(err, updatedMovie).then((updatedMovie) => _updateMovieAndSendResponse(updatedMovie, response))
        //     .catch((err) => _errorHandler(err, response))
        //     .finally(() => _sendResponse(res, response));
    };
    _updateOne(req, res, movieUpdate);
};


const deleteOne = (req, res) => {
    console.log("DELETE Movie Controller");
    const { movieId, response } = _validateMovieIdFromReqAndReturnMovieIdAndResponse(req);

    if (response.status != process.env.HTTP_READ_STATUS_CODE) {
        res.status(response.status).json(response.message);
    } else {
        MOVIES.deleteOne({ _id: movieId })
            .then((deletedMovie) => _deleteMovieByIdAndReturnResponse(deletedMovie, response))
            .catch((err) => _errorHandler(err, response))
            .finally(() => _sendResponse(res, response));
    }
};


const _getAllMoviesAndReturnResponse = (movies, response) => {
    response.status = process.env.HTTP_READ_STATUS_CODE;
    response.message = movies;
};

const _findMovieByIdAndReturnResponse = (movie, response) => {
    response.status = process.env.HTTP_READ_STATUS_CODE;
    response.message = movie;
};

const _saveNewMovieAndSendResponse = (savedMovie, response) => {
    response.status = process.env.HTTP_CREATE_STATUS_CODE;
    response.message = savedMovie;
};

const _updateMovieAndSendResponse = (err, movie, response, res) => {
    response = { status: process.env.HTTP_CREATE_STATUS_CODE, message: movie };
    if (!movie) {
        console.log("movie with given id not found");
        response.status = process.env.HTTP_NOT_FOUND_STATUS_CODE;
        response.message = process.env.HTTP_MOVIE_NOT_FOUND_MSG;
    }
    else {
        response.status = process.env.HTTP_CREATE_STATUS_CODE;
        response.message = movie;

        res.status
            (response.status).json
            (response.message);
    }
};

const _deleteMovieByIdAndReturnResponse = (deletedMovie, response) => {
    response.status = process.env.HTTP_CREATE_STATUS_CODE;
    response.message = process.env.HTPP_DELETE_RESPONSE_MSG;
};

const _errorHandler = (err, response) => {
    response.status = process.env.HTTP_SERVER_ERROR_STATUS_CODE;
    response.message = err;
};

const _sendResponse = (res, response) => {
    res.status(response.status).json(response.message);
};

const _validateMovieIdFromReqAndReturnMovieIdAndResponse = (req) => {
    const response = {
        status: process.env.HTTP_READ_STATUS_CODE,
        message: {}
    };
    const { movieId } = req.params;

    if (req.params && movieId) {
        if (!mongoose.isValidObjectId(movieId)) {
            console.log("Invalid movieId");
            response.status = process.env.HTTP_BAD_REQUEST_STATUS_CODE;
            response.message = process.env.INVALID_ID_MSG;
        }
    } else {
        console.log("movieId not provided");
        response.status = process.env.HTTP_BAD_REQUEST_STATUS_CODE;
        response.message = process.env.ID_NOT_PROVIDED_MSG;
    }

    return {
        movieId: movieId,
        response: response
    };
};

const _validateOffsetCountFromReqAndReturnOffsetCountAndResponse = (req) => {
    const response = {
        status: process.env.HTTP_READ_STATUS_CODE,
        message: {}
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

    return {
        count: count,
        offset: offset,
        response: response
    };
};

const _searchByTitle = function (req, res) {
    const title = req.query.search;
    const query = {
        "title": {$regex: title,'$options' : 'i'}
    };
    MOVIES.find(query).exec(function (err, movies) {
        const response = {
            status: parseInt(process.env.HTTP_READ_STATUS_CODE, 10),
            message: movies
        };
        if (err) {
            response.status= parseInt(process.env.HTTP_SERVER_ERROR_STATUS_CODE, 10);
            response.message= err;
        }
        console.log('search',movies);
        res.status(response.status).json(response.message);
    });
}
module.exports = {
    getAll,
    getOne,
    addOne,
    replaceOne,
    partialUpdateOne,
    deleteOne,
};