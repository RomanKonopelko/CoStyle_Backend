const express = require("express");
const ctrl = require("../../../controllers/user");
const guard = require("../../../middlewares/guard");
const { validatedNewUser } = require("../../../middlewares/validation");
const { GET_ACCESS_TOKEN } = require("../../../helpers/tokenCreation");
const { verifyRefreshToken, verifyToken } = require("../../../middlewares/auth.tokenValidation");

const { registerUser, loginUser, logoutUser, getCurrentUserData } = ctrl;

const router = express.Router();

router.post("/register", validatedNewUser, registerUser);
router.post("/login", loginUser);
router.post("/logout", guard, verifyToken, logoutUser);
router.post("/token", guard, verifyRefreshToken, GET_ACCESS_TOKEN);
router.get("/current", getCurrentUserData);

module.exports = router;
