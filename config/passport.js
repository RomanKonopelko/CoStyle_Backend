const passport = require("passport");
const User = require("../repositories/user");
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;

const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = SECRET_KEY;

passport.use(
  new JwtStrategy(opts, async (payload, done) => {
    try {
      const user = await User.findById(payload.id);
      if (!user) {
        return done(null, user);
      }
      if (!user.token) {
        return done(null, false);
      }
      return done(null, user);
    } catch (err) {
      done(err, false);
    }
  })
);
