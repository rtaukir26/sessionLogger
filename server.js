const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const logRoute = require("./routes/logRoutes");
// const session = require("express-session");

dotenv.config();

//middleware
app.use(cors());
app.use(express.json());
// app.use(session({ secret: "1234", resave: false, saveUninitialized: true }));

//Routes
app.use("/session-log", logRoute);

app.listen(process.env.PORT || 4001, () => {
  console.log(`sever running on ${process.env.PORT}`);
});
