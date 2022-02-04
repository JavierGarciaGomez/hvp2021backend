// importations
const express = require("express");
const path = require("path");
const cors = require("cors");
const { dbConnection } = require("./database/config");

require("dotenv").config();
// Create express server

const app = express();
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

// collaborator
app.use("/api/collaborators", require("./routes/collaboratorsRoutes"));

// 332 users routes
app.use("/api/auth", require("./routes/authRoutes"));

app.use("/api/cleanups", require("./routes/cleanUpsRoutes"));

app.use("/api/rfc", require("./routes/rfcRoutes"));

// 350 events routes
// app.use("/api/events", require("./routes/events"));

// app.get("*", (req, res) => {
//   console.log("se requirió *");
//   res.sendFile(path.resolve(__dirname, "public", "index.html"));
// });

// 330
app.listen(process.env.PORT || 4000, () => {
  console.log("Server running in port " + process.env.PORT);
});
