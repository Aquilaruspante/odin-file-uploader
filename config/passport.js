const passport = require('passport');
const { Strategy } = require('passport-local');
const db = require('../db/queries');
const bcrypt = require('bcrypt');

passport.use(new Strategy(async (username, password, done) => {
    try {
        const user = await db.userGetByUsername(username);

        if (!user) return done(null, false);

        const match = await bcrypt.compare(password, user.hashedPW);
        if (!match) return done(null, false);

        return done(null, user);
    } catch (e) {
        done(e);
    };
    
}));

passport.serializeUser((user, done) => {
    console.log('user', user);
    done(null, user.id)
});

passport.deserializeUser(async (user_id, done) => {
    try {
        const user = await db.userGetById(user_id);
        done(null, user);
    } catch (e) {
        done(e);
    };
});