import { getEnvsByEnvironment } from "../../shared/helpers/envHelpers";
import cors from "cors";

const corsOptions = {
  origin: [
    getEnvsByEnvironment().CLIENT_URL,
    getEnvsByEnvironment().CLIENT_URL2,
    "https://683d90567a1491009cee92b5--stellar-toffee-e9c8c4.netlify.app",
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

const corsMiddleware = cors(corsOptions);

export { corsMiddleware };
