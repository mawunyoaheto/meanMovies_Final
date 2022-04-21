const router = require("express").Router();
const moviesController = require("../controllers/movies.controller");
const actorsController = require("../controllers/actors.controller");
const authController = require("../controllers/authentication.controller");

router.route("")
.get(authController.authenticateToken, moviesController.getAll)
.post(authController.authenticateToken, moviesController.addOne);

router.route("/:movieId")
.get(moviesController.getOne)
.delete(moviesController.deleteOne)
.put(moviesController.replaceOne)
.patch(moviesController.partialUpdateOne);

router.route("/:movieId/actors")
    .get(actorsController.getAll)
    .post(actorsController.addOne);

router.route("/:movieId/actors/:actorId")
    .get(actorsController.getOne)
    .put(actorsController.updateOne)
    .delete(actorsController.deleteOne);


module.exports=router;