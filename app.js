const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const schedule = require("node-schedule");

require("dotenv").config();

const indexRouter = require("./routes/index");
const scheduleGithub = require("./app/github");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);

scheduleGithub();
const dontForget = schedule.scheduleJob("0 0 13 * * 1-5", function () {
  scheduleGithub();
});

module.exports = app;
