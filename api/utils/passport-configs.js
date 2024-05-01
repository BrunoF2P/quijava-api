const passport = require('passport');
const sequelize = require("../config/db.js");
const initModels = require("../models/init-models");
const models = initModels(sequelize)
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
require('dotenv').config();

const  opts = {}


opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET;

passport.use(new JwtStrategy(opts, async (jwtPayload, done) => {
    try {
        console.log(jwtPayload)
        const user = await models.users.findOne({ where: { username: jwtPayload.username } });
        if (!user) {
            return done(null, false, { message: 'Usuário não encontrado.' });
        }
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

module.exports = passport;
