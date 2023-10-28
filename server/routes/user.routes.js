const express = require("express");

const router = express.Router();

const userControllers = require("../controllers/user.controller");
const authenticationMiddleware = require("../middleware/authentication.middleware");
router.post("/register", userControllers.register);
router.post("/login", userControllers.login);
router.put("/:id/reset", authenticationMiddleware, userControllers.reset);
router.put(
  "/:id/profile",
  authenticationMiddleware,
  userControllers.updateProfile
);

module.exports = router;
