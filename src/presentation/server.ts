import session from "express-session";
import express, { Router } from "express";
import path from "path";
import { corsMiddleware, envsPlugin } from "../infrastructure/adapters";
import { CookieSessionAdapter } from "../infrastructure/adapters/cookie-session.adapter";
import { PrintRouteMiddleware } from "../middlewares/printRoute.middleware";
import { AttachBaseUrlMiddleware } from "../middlewares";
import { passportAdapter } from "../config/passport.adapter";
import { errorHandler } from "../middlewares/errorHandler";

interface Options {
  port: number;
  routes: Router;
  public_path?: string;
}

export class Server {
  public readonly app = express();
  private serverListener?: any;
  private readonly port: number;
  private readonly publicPath: string;
  private readonly routes: Router;

  constructor(options: Options) {
    const { port, routes, public_path = "public" } = options;
    this.port = port;
    this.publicPath = public_path;
    this.routes = routes;
  }

  async start() {
    console.log({ env: envsPlugin.NODE_ENV });
    //* Middlewares
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(PrintRouteMiddleware.print);
    this.app.use(AttachBaseUrlMiddleware.attachBaseUrl);
    this.app.use(corsMiddleware);

    this.app.use(CookieSessionAdapter.getInstance());
    this.app.use(passportAdapter.initialize());
    this.app.use(passportAdapter.session());

    //* Public Folder
    this.app.use(express.static(path.join(__dirname, "/public")));

    //* Routes
    this.app.use(this.routes);

    //* SPA /^\/(?!api).*/  <== Únicamente si no empieza con la palabra api
    this.app.get("*", (req, res) => {
      const indexPath = path.join(
        __dirname + `../../../${this.publicPath}/index.html`
      );
      res.sendFile(indexPath);
    });

    this.app.use(errorHandler);

    this.serverListener = this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }

  public close() {
    this.serverListener?.close();
  }
}
