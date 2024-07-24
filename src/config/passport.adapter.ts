// src/infrastructure/passport.ts
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import { getEnvsByEnvironment } from "../shared/helpers";
import { get } from "http";
import CollaboratorModel from "../data/models/CollaboratorModel";
import { CollaboratorAuth } from "../data/types";

passport.use(
  new GoogleStrategy(
    {
      clientID: getEnvsByEnvironment().GOOGLE_CLIENT_ID,
      clientSecret: getEnvsByEnvironment().GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/collaborator/google-callback",
    },
    async (token, tokenSecret, profile, done) => {
      try {
        const user = await CollaboratorModel.findOne({ googleId: profile.id });
        if (!user) {
          const newUser = await CollaboratorModel.create({
            googleId: profile.id,
            email: profile.emails![0].value,
            name: profile.displayName,
            imgUrl: profile.photos![0].value,
          });
          return done(null, newUser);
        }

        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser((user, done) => {
  done(null, user as CollaboratorAuth);
});

export { passport as passportAdapter };
