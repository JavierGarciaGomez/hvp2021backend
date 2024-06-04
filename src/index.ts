import { envs } from "./config";
import express from "express";
import { errorHandler } from "./middlewares/errorHandler";
import { TimeOffRequestsRoutes } from "./presentation/resources/timeOffRequests/timeOffRequestsRoutes";
import { TasksRoutes } from "./presentation/resources/tasks/tasksRoutes";
import { WorkLogsRoutes } from "./presentation/resources/workLogs/workLogsRoutes";
import { AttendanceRecordsRoutes } from "./presentation/resources/attendanceRecords/attendanceRecordsRoutes";
import { mainRoutes } from "./mainRoutes";
import { BillingRoutes } from "./presentation/resources/billing/billingRoutes";
import { AuthRoutes } from "./presentation/resources/auth/authRoutes";
import { PrintRouteMiddleware } from "./middlewares/printRoute.middleware";
import { AuthActivitiesRoutes } from "./presentation/resources/authActivities/authActivitiesRoutes";
import { AttachBaseUrlMiddleware } from "./middlewares";
import { PassportAdapter } from "./config/passport.adapter";
import path from "path";
import cors from "cors";

const { dbConnection } = require("./database/config");

const cleanUpsRoutes = require("./routes/cleanUpsRoutes");
const collaboratorsRoutes = require("./routes/collaboratorsRoutes");
const authRoutes = require("./routes/authRoutes");
const rfcRoutes = require("./routes/rfcRoutes");
const collaboratorLogRoutes = require("./routes/collaboratorLogRoutes");
const userLogRoutes = require("./routes/userLogRoutes");
const activityRegisterRoutes = require("./routes/activityRegisterRoutes");
const miscRoutes = require("./routes/miscRoutes");
const documentationRoutes = require("./routes/documentationRoutes");
const userClientRoutes = require("./routes/userClientRoutes");
const fcmRoutes = require("./routes/fcmRoutes");
const usersRoutes = require("./routes/usersRoutes");

const cookieSession = require("cookie-session");

// Create express server

const app = express();

console.log({ envs });
console.log("Client URL 1:", envs.CLIENT_URL);
console.log("Client URL 2:", envs.CLIENT_URL2);

app.use(
  cookieSession({
    name: "session",
    keys: ["whatever"],
    maxAge: 24 * 60 * 60 * 100,
  })
);

// My middleware to console log
app.use(PrintRouteMiddleware.print);
app.use(AttachBaseUrlMiddleware.attachBaseUrl);

// dbConnection
dbConnection();

// CORS
app.use(
  cors({
    origin: [envs.CLIENT_URL, envs.CLIENT_URL2],
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

const passportAdapter = new PassportAdapter();
const passport = passportAdapter.getPassport();

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());

// routes
// app.use(mainRoutes.auth, authRoutes);
app.use(mainRoutes.collaborators, collaboratorsRoutes);
app.use(mainRoutes.cleanUps, cleanUpsRoutes);
app.use(mainRoutes.rfc, rfcRoutes);
app.use(mainRoutes.collaboratorLog, collaboratorLogRoutes);
app.use(mainRoutes.userLog, userLogRoutes);
app.use(mainRoutes.activityRegister, activityRegisterRoutes);
app.use(mainRoutes.misc, miscRoutes);
app.use(mainRoutes.documentation, documentationRoutes);
app.use(mainRoutes.fcm, fcmRoutes);
app.use(mainRoutes.userClient, userClientRoutes);
app.use(mainRoutes.users, usersRoutes);
app.use(mainRoutes.timeOffRequests, TimeOffRequestsRoutes.routes);
app.use(mainRoutes.tasks, TasksRoutes.routes);
app.use(mainRoutes.workLogs, WorkLogsRoutes.routes);
app.use(mainRoutes.attendanceRecords, AttendanceRecordsRoutes.routes);
app.use(mainRoutes.billing, BillingRoutes.routes);
app.use(mainRoutes.auth, AuthRoutes.routes);
app.use(mainRoutes.authActivities, AuthActivitiesRoutes.routes);
// app.use(mainRoutes.bills, bills);

app.use(errorHandler);

app.listen(process.env.PORT || 4000, () => {
  console.log("Server running in port " + process.env.PORT);
});
export { passport };
