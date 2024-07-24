"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CookieSessionAdapter = void 0;
const cookie_session_1 = __importDefault(require("cookie-session"));
class CookieSessionAdapter {
    constructor() { }
    static getInstance() {
        if (!CookieSessionAdapter.instance) {
            CookieSessionAdapter.instance = (0, cookie_session_1.default)({
                name: "session",
                keys: [process.env.SESSION_KEY || "default_key"], // Use an environment variable for the key
                maxAge: 24 * 60 * 60 * 1000, // 24 hours
            });
        }
        return CookieSessionAdapter.instance;
    }
}
exports.CookieSessionAdapter = CookieSessionAdapter;
