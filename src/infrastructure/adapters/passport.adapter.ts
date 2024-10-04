// src/infrastructure/passport.ts
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import { getEnvsByEnvironment } from "../../shared/helpers";
import { get } from "http";
import { CollaboratorModel } from "../db";
import { CollaboratorAuth } from "../../shared";

passport.use(
  new GoogleStrategy(
    {
      clientID: getEnvsByEnvironment().GOOGLE_CLIENT_ID,
      clientSecret: getEnvsByEnvironment().GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/collaborator/google-callback",
    },
    async (token, tokenSecret, profile, done) => {
      try {
        const email = profile.emails![0].value;
        const collaborators = await CollaboratorModel.find();
        console.log({ collaborators });
        const user = await CollaboratorModel.findOne({
          email,
        });
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
