// importations
import { NextFunction, Request } from "express";
import { errorHandler } from "./middlewares/errorHandler";
import { TimeOffRequestsRoutes } from "./presentation/resources/timeOffRequests/timeOffRequestsRoutes";
import { TasksRoutes } from "./presentation/resources/tasks/tasksRoutes";
import { WorkLogsRoutes } from "./presentation/resources/workLogs/workLogsRoutes";
import TaskModel from "./data/models/TaskModel";
import { AttendanceRecordsRoutes } from "./presentation/resources/attendanceRecords/attendanceRecordsRoutes";
import { mainRoutes } from "./mainRoutes";
require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");
const { dbConnection } = require("./database/config");
const passport = require("passport");
const passportSetup = require("./config/passportSetup");
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

app.use(
  cookieSession({
    name: "session",
    keys: ["whatever"],
    maxAge: 24 * 60 * 60 * 100,
  })
);

// My middleware to console log
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`Requested path: ${req.path}`);
  next();
});

// dbConnection
dbConnection();

// CORS
app.use(
  cors({
    origin: [process.env.CLIENT_URL, process.env.CLIENT_URL2],
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

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, "/public")));

// 334 reading and parsing
app.use(express.json());

// routes
app.use(mainRoutes.auth, authRoutes);
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

app.use(errorHandler);

app.listen(process.env.PORT || 4000, () => {
  console.log("Server running in port " + process.env.PORT);
});
