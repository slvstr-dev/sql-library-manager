const express = require("express");
const router = express.Router();
const Book = require("../models").Book;

/* Helper function to handle each route async */
const handleRouteAsync = (cb) => {
    return async (req, res, next) => {
        try {
            await cb(req, res, next);
        } catch (error) {
            next(error);
        }
    };
};

/* GET routes */
router.get(
    "/",
    handleRouteAsync(async (req, res) => {
        res.redirect("/books");
    })
);

router.get(
    "/books",
    handleRouteAsync(async (req, res) => {
        const books = await Book.findAll();

        res.render("index", { title: "Books", books });
    })
);

router.get("/books/new", (req, res) => {
    res.render("new-book", { title: "Create New Book" });
});

router.get(
    "/books/:id",
    handleRouteAsync(async (req, res, next) => {
        const book = await Book.findByPk(req.params.id);

        if (book) {
            res.render("update-book", { title: "Book Info", book });
        } else {
            next();
        }
    })
);

/* POST routes */
router.post(
    "/books/new",
    handleRouteAsync(async (req, res) => {
        let book;

        try {
            book = await Book.create(req.body);

            res.redirect("/books");
        } catch (error) {
            if (error.name === "SequelizeValidationError") {
                book = await Book.build(req.body);

                res.render("form-error", {
                    title: "Create New Book",
                    book,
                    errors: error.errors,
                    action: "/books/new",
                });
            } else {
                throw error;
            }
        }
    })
);

router.post(
    "/books/:id",
    handleRouteAsync(async (req, res, next) => {
        let book;

        try {
            book = await Book.findByPk(req.params.id);

            if (book) {
                await book.update(req.body);
                res.redirect("/books");
            } else {
                next();
            }
        } catch (error) {
            if (error.name === "SequelizeValidationError") {
                book = await Book.build(req.body);

                book.id = req.params.id;

                res.render("form-error", {
                    title: "Edit Book",
                    book,
                    errors: error.errors,
                    action: `/books/${book.id}`,
                });
            } else {
                throw error;
            }
        }
    })
);

router.post(
    "/books/:id/delete",
    handleRouteAsync(async (req, res, next) => {
        const book = await Book.findByPk(req.params.id);

        if (book) {
            await book.destroy();

            res.redirect("/books");
        } else {
            next();
        }
    })
);

module.exports = router;
