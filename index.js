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
  cors()
  //   {
  //   origin: "*",
  //   methods: "GET,POST,PUT,DELETE",
  //   credentials: true,
  // }
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE, PATCH");
  next();
});

app.options("*", cors()); // include before other routes

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
