"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.passportAdapter = void 0;
// src/infrastructure/passport.ts
const passport_1 = __importDefault(require("passport"));
exports.passportAdapter = passport_1.default;
const passport_google_oauth20_1 = require("passport-google-oauth20");
const helpers_1 = require("../../shared/helpers");
const db_1 = require("../db");
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: (0, helpers_1.getEnvsByEnvironment)().GOOGLE_CLIENT_ID,
    clientSecret: (0, helpers_1.getEnvsByEnvironment)().GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/collaborator/google-callback",
}, (token, tokenSecret, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield db_1.CollaboratorModel.findOne({
            email: profile.emails[0].value,
        });
        if (!user) {
            const newUser = yield db_1.CollaboratorModel.create({
                googleId: profile.id,
                email: profile.emails[0].value,
                name: profile.displayName,
                imgUrl: profile.photos[0].value,
            });
            return done(null, newUser);
        }
        done(null, user);
    }
    catch (error) {
        done(error);
    }
})));
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser((user, done) => {
    done(null, user);
});
