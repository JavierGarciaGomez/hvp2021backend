"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsMiddleware = void 0;
const envHelpers_1 = require("../../shared/helpers/envHelpers");
const cors_1 = __importDefault(require("cors"));
const corsOptions = {
    origin: [
        (0, envHelpers_1.getEnvsByEnvironment)().CLIENT_URL,
        (0, envHelpers_1.getEnvsByEnvironment)().CLIENT_URL2,
    ],
    methods: "GET,POST,PUT,DELETE, PATCH",
    credentials: true,
    maxAge: 3600,
    allowedHeaders: [
        "X-Requested-With",
        "Content-Type",
        "x-token",
        "Access-Control-Allow-Credentials",
        "Authorization",
    ],
};
const corsMiddleware = (0, cors_1.default)(corsOptions);
exports.corsMiddleware = corsMiddleware;
