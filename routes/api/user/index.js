const express = require("express");
const ctrl = require("../../../controllers/user");
const guard = require("../../../middlewares/guard");
const { validatedNewUser } = require("../../../middlewares/validation");
const { GET_ACCESS_TOKEN } = require("../../../helpers/tokenCreation");
const { VERIFY_TOKEN, REPEAT_EMAIL_VERIFICATION } = require("../../../helpers/functions");
const verifyRefreshToken = require("../../../middlewares/auth.tokenValidation");

const { registerUser, loginUser, logoutUser, getCurrentUserData } = ctrl;

const router = express.Router();

router.post("/register", validatedNewUser, registerUser);

router.post("/login", loginUser);

router.post("/logout", guard, logoutUser);

router.get("/token", verifyRefreshToken, GET_ACCESS_TOKEN);

router.get("/current", guard, getCurrentUserData);

router.get("/verify/:token", VERIFY_TOKEN);

router.post("/verify", REPEAT_EMAIL_VERIFICATION);

module.exports = router;
