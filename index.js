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

// Create express server

const app = express();

app.use(passport.initialize());
// TODO ¿is need it?
// app.use(passport.session());
// dbConnection
dbConnection();

// CORS
app.use(cors());
app.options("*", cors()); // include before other routes

// Public directory
app.use(express.static(path.join(__dirname, "/public")));

// 334 reading and parsing
app.use(express.json());

// routes
app.use("/api/collaborators", collaboratorsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cleanups", cleanUpsRoutes);
app.use("/api/rfc", rfcRoutes);

app.listen(process.env.PORT || 4000, () => {
  console.log("Server running in port " + process.env.PORT);
});
