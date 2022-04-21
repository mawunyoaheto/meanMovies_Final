const router = require("express").Router();
const movies_route = require("./movies");
const users_route = require("./users");

router.use("/movies", movies_route);
router.use("/users", users_route);

module.exports = router;

