const passport = require("passport");
require("../config/passport");
const { HTTP_CODES, HTTP_MESSAGES } = require("../helpers/constants");

const { UNAUTHORIZED, ERROR } = HTTP_CODES;
const { INVALID_CREDENTIALS } = HTTP_MESSAGES;

const guard = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    const headerAuth = req.get("Authorization");
    let token = null;
    if (headerAuth) {
      console.log(headerAuth);
      token = headerAuth.split(" ")[1];
    }
    console.log(user, "user");
    console.log(token);

    if (err || !user || token !== user?.token) {
      return res.status(UNAUTHORIZED).json({
        status: ERROR,
        code: UNAUTHORIZED,
        message: INVALID_CREDENTIALS,
      });
    }
    req.user = user;
    return next();
  })(req, res, next);
};

module.exports = guard;
