const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");

const sequelize = require("./models").sequelize;

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

// test connection to the database
(async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection to the database successful!");
    } catch (error) {
        console.error("Error connecting to the database: ", error);
    }
})();

// catch 404 and forward to error handler
app.use((req, res) => {
    const err = new Error();

    err.message = "Sorry! We couldn't find the page you were looking for.";

    res.status(404);
    res.render("page-not-found", { title: "Page Not Found", err });
});

// error handler
app.use((err, req, res) => {
    err.message = "Sorry! There was an unexpected error on the server.";

    res.status(err.status || 500);
    res.render("error", { title: "Server Error", err });

    console.log(err);
});

module.exports = app;
