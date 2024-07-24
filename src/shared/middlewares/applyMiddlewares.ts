import express, { Application } from "express";

import cors from "cors";
import { envsPlugin } from "../../infra/adapters";
import {
  AttachBaseUrlMiddleware,
  PrintRouteMiddleware,
  errorHandlerMiddleware,
} from "./";

export const applyPreRouterMiddlewares = (app: Application) => {
  //   app.use(
  //     cookieSession({
  //       name: "session",
  //       keys: ["whatever"],
  //       maxAge: 24 * 60 * 60 * 100,
  //     })
  //   );
  //   app.use(bodyParser.json());

  app.use(express.json()); // raw
  app.use(express.urlencoded({ extended: true })); // x-www-form-urlencoded
  app.use(PrintRouteMiddleware.print);
  app.use(AttachBaseUrlMiddleware.attachBaseUrl);
  app.use(
    cors({
      origin: [envsPlugin.CLIENT_URL, envsPlugin.CLIENT_URL2],
      methods: "GET,POST,PUT,DELETE, PATCH",
      credentials: true,
      maxAge: 3600,
      allowedHeaders: [
        "X-Requested-With",
        "Content-Type",
        "x-token",
        "Access-Control-Allow-Credentials",
        "Authorization", // Include the Authorization header
      ],
    })
  );

  // passport
};
