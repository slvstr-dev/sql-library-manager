const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const booksRouter = require("./routes/books");
const searchRouter = require("./routes/search");

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
app.use("/books", booksRouter);
app.use("/search", searchRouter);

// Test connection to the database
(async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection to the database successful!");
    } catch (error) {
        console.error("Error connecting to the database: ", error);
    }
})();

// 404 error handler
app.use((req, res, next) => {
    next(createError(404));
});

// Global errors handler
app.use((err, req, res, next) => {
    if (err.status === 404) {
        res.status(404).render("page-not-found", { err });
    } else {
        err.message =
            err.message ||
            "Sorry! There was an unexpected error on the server.";

        res.status(err.status || 500).render("error", {
            title: "Server Error",
            err,
        });
    }
});

module.exports = app;
