const express = require("express");
const ctrl = require("../../../controllers/user");
const guard = require("../../../helpers/guard");

const { registerUser, loginUser, logoutUser, getCurrentUserData } = ctrl;

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/current", guard, getCurrentUserData);

module.exports = router;
