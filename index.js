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
const cookieSession = require("cookie-session");

// Create express server

const app = express();

app.use(
  cookieSession({ name: "session", keys: ["lama"], maxAge: 24 * 60 * 60 * 100 })
);

app.use(passport.initialize());
app.use(passport.session());
// dbConnection
dbConnection();

// CORS
app.use(
  cors({
    origin: true,
    methods: "GET,POST,PUT,DELETE, PATCH",
    credentials: true,
  })
);

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

app.listen(process.env.PORT || 4000, () => {
  console.log("Server running in port " + process.env.PORT);
});
