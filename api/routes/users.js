const router = require("express").Router();
const users_controller = require("../controllers/users.controller");

router.route("")
.get(users_controller.getAll)
.post(users_controller.addOne);


router.route("/:userId")
.delete(users_controller.blockUser);

router.route("/login")
.post(users_controller.login);


module.exports=router;