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
exports.Server = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const adapters_1 = require("../infrastructure/adapters");
const cookie_session_adapter_1 = require("../infrastructure/adapters/cookie-session.adapter");
const passport_adapter_1 = require("../infrastructure/adapters/passport.adapter");
const shared_1 = require("../shared");
const middlewares_1 = require("./middlewares");
const errorHandler_1 = require("./middlewares/errorHandler");
class Server {
    constructor(options) {
        this.app = (0, express_1.default)();
        const { port, routes, public_path = "public" } = options;
        this.port = port;
        this.publicPath = public_path;
        this.routes = routes;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log({ env: adapters_1.envsPlugin.NODE_ENV });
            //* Middlewares
            this.app.use(express_1.default.json());
            this.app.use(express_1.default.urlencoded({ extended: true }));
            this.app.use(shared_1.PrintRouteMiddleware.print);
            this.app.use(middlewares_1.AttachBaseUrlMiddleware.attachBaseUrl);
            this.app.use(adapters_1.corsMiddleware);
            this.app.use(cookie_session_adapter_1.CookieSessionAdapter.getInstance());
            this.app.use(passport_adapter_1.passportAdapter.initialize());
            this.app.use(passport_adapter_1.passportAdapter.session());
            //* Public Folder
            this.app.use(express_1.default.static(path_1.default.join(__dirname, "/public")));
            //* Routes
            this.app.use(this.routes);
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
                const error = shared_1.BaseError.notFound("Resource not found");
                next(error);
            });
            this.app.use(errorHandler_1.errorHandler);
            this.serverListener = this.app.listen(this.port, () => {
                console.log(`Server running on port ${this.port}`);
            });
        });
    }
    close() {
        var _a;
        (_a = this.serverListener) === null || _a === void 0 ? void 0 : _a.close();
    }
}
exports.Server = Server;
