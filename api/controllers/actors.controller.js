const { response } = require("express");
const mongoose = require("mongoose");
const MOVIES = mongoose.model(process.env.MOVIES_MODEL);

const getAll = (req, res) => {

    console.log("Get All Actors by Movie Controller");
    let movieId;
    const response = {
        status: process.env.HTTP_READ_STATUS_CODE,
        message: {}
    };
    if (req.params && req.params.movieId) {
        movieId = req.params.movieId;
        if (!mongoose.isValidObjectId(movieId)) {
            response.status = process.env.HTTP_BAD_REQUEST_STATUS_CODE;
            response.message = "Invalid movieId";
        }
    } else {
        response.status = process.env.HTTP_BAD_REQUEST_STATUS_CODE;
        response.message = "Cannot find without movieId";
    }

    if (response.status != process.env.HTTP_READ_STATUS_CODE) {
        res.status(response.status).json(response.message);
    } else {
        MOVIES.findById(movieId).select("actors")
            .then((movie) => _findMovieByIdAndReturnResponse(movie, response, res))
            .catch((err) => _errorHandler(err, response))
            .finally(() => _sendResponse(res, response));
    }
};

const getOne = (req, res) => {

    const { movieId, actorId, response } = _validateMovieIdAndActorIdFromReqAndReturnActorIdMovieIdAndResponse(req);

    if (response.status != process.env.HTTP_READ_STATUS_CODE && response.status != process.env.HTTP_CREATE_STATUS_CODE) {
        res.status(response.status).json(response.message);
    } else {
        MOVIES.findById(movieId)
            .then((movie) => _getOneActor(movie, actorId, response))
            .catch((err) => _errorHandler(err, response))
            .finally(() => _sendResponse(res, response));
    }
};

const addOne = (req, res) => {
    console.log("Add One Actor Controller");
    const { movieId, response } = _validateMovieIdAndActorIdFromReqAndReturnActorIdMovieIdAndResponse(req);

    if (response.status != process.env.HTTP_READ_STATUS_CODE) {
        res.status(response.status).json(response.message);
    } else {

        MOVIES.findById(movieId).select("actors")
            .then((movie) => _addActor(movie, req, res))
            .then((response) => response)
            .catch((err) => _errorHandler(err, response))
            .finally(() => _sendResponse(res, response));
    }


};

const updateOne = (req, res) => {
    const { movieId, actorId, response } = _validateMovieIdAndActorIdFromReqAndReturnActorIdMovieIdAndResponse(req);
    console.log(movieId, actorId, response);

    if (response.status != process.env.HTTP_READ_STATUS_CODE) {
        res.status(response.status).json(response.message);
    } else {
        MOVIES.findById(movieId).exec((err, movie) => _updateActor(err, req, movie, res));
    }

};

const deleteOne = (req, res) => {
    const { movieId, response } = _validateMovieIdAndActorIdFromReqAndReturnActorIdMovieIdAndResponse(req);
    if (response.status != process.env.HTTP_READ_STATUS_CODE) {
        res.status(response.status).json(response.message);
    } else {
        MOVIES.findById(movieId)
            .then((movie) => _deleteActor(movie, req, res))
            .then((response) => response)
            .catch((err) => _errorHandler(err, response))
            .finally(() => _sendResponse(res, response));
    }
};

const _validateMovieIdAndActorIdFromReqAndReturnActorIdMovieIdAndResponse = (req) => {
    const response = {
        status: process.env.HTTP_READ_STATUS_CODE,
        message: {}
    };
    const { movieId, actorId } = req.params;

    if (req.params && movieId) {
        if (!mongoose.isValidObjectId(movieId)) {
            response.status = process.env.HTTP_BAD_REQUEST_STATUS_CODE;
            response.message = process.env.INVALID_ID_MSG;
        }
    } else {
        response.status = process.env.HTTP_BAD_REQUEST_STATUS_CODE;
        response.message = process.env.ID_NOT_PROVIDED_MSG;
    }

    if (req.params && actorId) {
        if (!mongoose.isValidObjectId(actorId)) {
            response.status = process.env.HTTP_BAD_REQUEST_STATUS_CODE;
            response.message = process.env.INVALID_ID_MSG;
        }
    }

    return {
        movieId: movieId,
        actorId: actorId,
        response: response
    };
};
const _addActor = (movie, req, res) => {

    if (movie) {
        const { newActor, response } = _validateActorToBeCreated(movie, req);

        if (response.status != process.env.HTTP_CREATE_STATUS_CODE) {
            res.status(response.status).json(response.message);
        } else {
            movie.actors.push(newActor);
            movie.save()
                .then((res) => _sendResponse(res, response))
                .catch((err) => _errorHandler(err, response));
        }
    } else {
        response.status = process.env.HTTP_NOT_FOUND_STATUS_CODE;
        response.message = process.env.HTTP_MOVIE_NOT_FOUND_MSG;
    }

};

const _updateActor = (err, req, movie, res) => {
    if (err) {
        res.status(process.env.HTTP_SERVER_ERROR_STATUS_CODE).json(err);
    } else {
        let actor = movie.actors.id(req.params.actorId);
        if (actor) {
            actor.name = req.body.name;
            actor.awards = req.body.awards;
            movie.save((err) => {
                if (err) res.status(process.env.HTTP_SERVER_ERROR_STATUS_CODE).json(err);
                res.status(process.env.HTTP_UPDATE_STATUS_CODE).json("update successful");
            });
        }
    }
};

const _deleteActor = (movie, req, res) => {
    let actor = movie.actors.id(req.params.actorId);
    if (actor) {
        actor.remove();
        movie.save()
            .then((res) => _sendResponse(res, response))
            .err((err) => _errorHandler(err, response));
    } else {
        res.status(process.env.HTTP_NOT_FOUND_STATUS_CODE).json(`Actor with given id: ${actorId} not found`);
    }
};

const _getOneActor = (movie, actorId, response) => {
    if (movie) {
        let actor = movie.actors.id(actorId);
        if (actor) {
            response.status = process.env.HTTP_READ_STATUS_CODE;
            response.message = actor;
        } else {
            response.status = process.env.HTTP_NOT_FOUND_STATUS_CODE;
            response.message = process.env.HTTP_ACTORS_NOT_FOUND_MSG;
        }
    } else {
        response.status = process.env.HTTP_NOT_FOUND_STATUS_CODE;
        response.message = process.env.HTTP_MOVIE_NOT_FOUND_MSG;
    }

};

const _findMovieByIdAndReturnResponse = (movie, response, res) => {
    if (movie) {
        response.status = process.env.HTTP_READ_STATUS_CODE;
        response.message = movie;

    } else {
        response.status = process.env.HTTP_NOT_FOUND_STATUS_CODE;
        response.message = process.env.HTTP_ACTORS_NOT_FOUND_MSG;

    }


};

const _errorHandler = (err, response) => {
    response.status = process.env.HTTP_SERVER_ERROR_STATUS_CODE;
    response.message = err;
};

const _sendResponse = (res, response) => {
    res.status(response.status).json(response.message);
};

const _validateActorToBeCreated = (movie, req) => {
    const response = {
        status: process.env.HTTP_CREATE_STATUS_CODE,
        message: {}
    };

    const { name, awards } = req.body;
    if (name) {
        if (isNaN(name)) {
            movie.actors.name = name;
        } else {
            response.status = process.env.HTTP_BAD_REQUEST_STATUS_CODE;
            response.message = process.env.INVALID_ACTOR_NAME_MSG;
        }

    } else {
        response.status = process.env.HTTP_BAD_REQUEST_STATUS_CODE;
        response.message = process.env.NULL_ACTOR_NAME_MSG;
    }

    if (awards) {
        if (isNaN(awards)) {
            console.log("Awards cannot be a string");
            response.status = process.env.HTTP_BAD_REQUEST_STATUS_CODE;
            response.message = process.env.INVALID_ACTOR_AWARDS_MSG;
        } else {
            movie.actors.awards = parseInt(awards, 10);
        }
    }

    let newActor = {
        name: name,
        awards: awards
    };

    return {
        newActor: newActor,
        response: response
    };

};

module.exports = {
    getAll,
    getOne,
    addOne,
    updateOne,
    deleteOne
};