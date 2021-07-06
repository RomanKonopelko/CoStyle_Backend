const express = require("express");
const ctrl = require("../../../controllers/user");
const guard = require("../../../helpers/guard");
const { validatedNewUser } = require("../../../helpers/validation");

const { registerUser, loginUser, logoutUser, getCurrentUserData } = ctrl;

const router = express.Router();

router.post("/register", validatedNewUser, registerUser);
router.post("/login", loginUser);
router.post("/logout", guard, logoutUser);
router.get("/current", guard, getCurrentUserData);

module.exports = router;
