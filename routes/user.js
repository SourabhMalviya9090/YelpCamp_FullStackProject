const express = require("express");
const User = require("../Model/user");
const router = express.Router();
const passport= require("passport");
const catchAsync = require("../Utils/catchAsync");
const storeReturnTo = require("../middlewares/storeReturnTo");
const userController = require("../controllers/user");

// register routes
router.get("/register",userController.registerForm);

router.post("/register", catchAsync(userController.registerUser));

// login routes
router.get("/login",userController.loginForm);

router.post("/login", storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login' }), userController.loginUser);

// logout routes
router.get("/logout", userController.logoutUser);

module.exports = router;