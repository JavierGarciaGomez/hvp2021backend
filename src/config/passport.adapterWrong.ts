// import passport from "passport";
// import CollaboratorModel, {
//   Collaborator,
// } from "../data/models/CollaboratorModel";
// import { CollaboratorAuth } from "../data/types";

// const GoogleStrategy = require("passport-google-oauth20").Strategy;
// // const GithubStrategy = require("passport-github2").Strategy;
// // const FacebookStrategy = require("passport-facebook").Strategy;

// // TODO: PENDING
// // const { createUserIfNotExist } = require("../controllers/authController");

// export class PassportAdapter {
//   constructor() {
//     this.initializeGoogleStrategy();
//   }

//   private initializeGoogleStrategy() {
//     passport.use(
//       new GoogleStrategy(
//         {
//           clientID: process.env.GOOGLE_CLIENT_ID,
//           clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//           callbackURL: "/api/auth/collaborator/google-callback",
//         },
//         async (
//           _accessToken: string,
//           _refreshToken: string,
//           profile: any,
//           done: (error: any, user?: any) => void
//         ) => {
//           try {
//             let user = await CollaboratorModel.findOne({
//               googleId: profile.id,
//             });
//             // todo, i dont think so
//             if (!user) {
//               user = await CollaboratorModel.create({
//                 googleId: profile.id,
//                 email: profile.emails[0].value,
//                 name: profile.displayName,
//                 imgUrl: profile.photos[0].value,
//               });
//             }
//             done(null, user);
//           } catch (error) {
//             done(error, null);
//           }
//         }
//       )
//     );
//   }

//   public serializeUser() {
//     passport.serializeUser((user, done) => {
//       done(null, user);
//     });
//   }

//   public deserializeUser() {
//     passport.deserializeUser((user, done) => {
//       done(null, user as CollaboratorAuth);
//     });
//   }

//   public getPassport() {
//     return passport;
//   }
// }
