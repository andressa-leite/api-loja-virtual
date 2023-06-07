const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/login", userController.login);
router.post("/", userController.createUser);

//router.use(authMiddleware(["ADMIN"]));

router.get("/", userController.getUsers);

router.get("/:id", userController.getUser);

router.put("/:id", userController.updateUser);

router.delete("/:id", userController.deleteUser);

module.exports = router;
