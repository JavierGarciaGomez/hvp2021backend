"use strict";
const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const GithubStrategy = require("passport-github2").Strategy;
// const FacebookStrategy = require("passport-facebook").Strategy;
const passport = require("passport");
const { createUserIfNotExist } = require("../controllers/authController");
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback",
}, createUserIfNotExist));
// GITHUB_CLIENT_ID = "your id";
// GITHUB_CLIENT_SECRET = "your id";
// FACEBOOK_APP_ID = "your id";
// FACEBOOK_APP_SECRET = "your id";
// passport.use(
//   new GithubStrategy(
//     {
//       clientID: GITHUB_CLIENT_ID,
//       clientSecret: GITHUB_CLIENT_SECRET,
//       callbackURL: "/auth/github/callback",
//     },
//     function (accessToken, refreshToken, profile, done) {
//       done(null, profile);
//     }
//   )
// );
// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: FACEBOOK_APP_ID,
//       clientSecret: FACEBOOK_APP_SECRET,
//       callbackURL: "/auth/facebook/callback",
//     },
//     function (accessToken, refreshToken, profile, done) {
//       done(null, profile);
//     }
//   )
// );
// @ts-ignore
passport.serializeUser((user, done) => {
    done(null, user);
});
// @ts-ignore
passport.deserializeUser((user, done) => {
    done(null, user);
});
