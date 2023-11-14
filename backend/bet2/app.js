const express = require("express");
const morgan = require("morgan");
const path = require("path");
const rateLimiter = require("express-rate-limit");
const AppError = require("./src/utils/appError");
const errorController = require("./src/controllers/errorController");
const matchRoutes = require("./src/routes/matchRoutes");
const leagueRoutes = require("./src/routes/leagueRoutes");
const betRoutes = require("./src/routes/betRoutes");
const userRoutes = require("./src/routes/userRoutes");
const resultRoutes = require("./src/routes/resultRoutes");
const bonusRoutes = require("./src/routes/bonusRoutes");
const bonusBetRoutes = require("./src/routes/bonusBetRoutes");

const adminRoutes = require("./src/routes/adminRoutes");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const app = express();
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(cors());
app.use(cors({
    origin: "*",
}));
app.set(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public")));
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}
const limiter = rateLimiter({
    max: 9000,
    windowMs: 60 * 60 * 1000,
    message: "Too many requests from this IP. please try again in an hour",
});
app.use("/api", limiter);
app.use(express.json({}));
app.use(express.urlencoded({
    extended: true,
    limit: "10kb"
}));
app.use(cookieParser());
console.log("Running on :", process.env.NODE_ENV);
app.use("/geez/admin", adminRoutes);
app.use("/geez/api/v1/users", userRoutes);
app.use("/geez/api/v1/bets", betRoutes);
app.use("/geez/api/v1/leagues", leagueRoutes);
app.use("/geez/api/v1/matches", matchRoutes);
app.use("/geez/api/v1/matchResult", resultRoutes);
app.use("/geez/api/v1/bonus", bonusRoutes);
app.use("/geez/api/v1/bonusBets", bonusBetRoutes);
app.all("*", (req, res, next) => {
    next(new AppError(`Can't find this ${req.originalUrl} on this server`), 404);
});
app.use(errorController);
module.exports = app;