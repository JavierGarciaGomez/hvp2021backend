import express, { Router } from "express";
import path from "path";
import { corsMiddleware, envsPlugin } from "../infrastructure/adapters";
import { CookieSessionAdapter } from "../infrastructure/adapters/cookie-session.adapter";
import { passportAdapter } from "../infrastructure/adapters/passport.adapter";
import { BaseError, PrintRouteMiddleware } from "../shared";
import { AttachBaseUrlMiddleware } from "./middlewares";
import { errorHandler } from "./middlewares/errorHandler";
import { updateShiftDateField } from "../shared/scripts/upsateShifts";
import { seedSimplifiedBranchCashReconciliation } from "../shared/seeds/simplifiedBranchCashReconciliationSeed";

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

    //* Seeds
    // await seedSimplifiedBranchCashReconciliation();

    //* SPA /^\/(?!api).*/  <== Únicamente si no empieza con la palabra api
    // this.app.get("*", (req, res) => {
    //   const indexPath = path.join(
    //     __dirname + `../../../${this.publicPath}/index.html`
    //   );
    //   res.sendFile(indexPath);
    // });

    // Handle 404 errors
    // Handle 404 errors
    this.app.use((req, res, next) => {
      const error = BaseError.notFound("Resource not found");

      next(error);
    });

    this.app.use(errorHandler);

    // await updateShiftDateField();

    this.serverListener = this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }

  public close() {
    this.serverListener?.close();
  }
}
