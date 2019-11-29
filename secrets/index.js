const HeaderAPIKeyStrategy = require('passport-headerapikey').HeaderAPIKeyStrategy
const passport = require('passport');

const APP_SECRET = 'KK2Kj88FG)BUBIYTCYVUOU(*^(&TYVIHB';
const API_KEY = 'BIDiyGDyT6%&65MNuig';

// passport.use(new HeaderAPIKeyStrategy(
//     { header: 'apikey', prefix: API_KEY },
//     false,
//     function (API_KEY, done) {
//         return done();
//     }
// ));

module.exports = { passport, APP_SECRET, API_KEY };