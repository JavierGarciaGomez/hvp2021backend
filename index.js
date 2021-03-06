// importations
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

// dbConnection
dbConnection();

console.log("review url", process.env.CLIENT_URL);
// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: "GET,POST,PUT,DELETE, PATCH",
    credentials: true,
    maxAge: 3600,
    allowedHeaders:
      "X-Requested-With,content-type, x-token, Access-Control-Allow-Credentials",
  })
);

app.use(passport.initialize());
app.use(passport.session());

/*
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://www.hospitalveterinariopeninsular.com"
  );

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});
*/

// app.options(
//   "*",
//   cors({
//     origin: true,
//     methods: "GET,POST,PUT,DELETE, PATCH",
//     credentials: true,
//   })
// );

// Public directory
app.use(express.static(path.join(__dirname, "/public")));

// 334 reading and parsing
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/collaborators", collaboratorsRoutes);
app.use("/api/cleanups", cleanUpsRoutes);
app.use("/api/rfc", rfcRoutes);
app.use("/api/collaboratorLog", collaboratorLogRoutes);
app.use("/api/userLog", userLogRoutes);
app.use("/api/activityRegister", activityRegisterRoutes);
app.use("/api/misc", miscRoutes);
app.use("/api/documentation", documentationRoutes);
app.use("/api/fcm", fcmRoutes);
app.use("/api/userClient", userClientRoutes);
app.use("/api/users", usersRoutes);

app.listen(process.env.PORT || 4000, () => {
  console.log("Server running in port " + process.env.PORT);
});
