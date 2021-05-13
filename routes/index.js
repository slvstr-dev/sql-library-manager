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

        res.render("index", { books });
    })
);

router.get("/books/new", (req, res) => {
    res.render("new-book");
});

router.get(
    "/books/:id",
    handleRouteAsync(async (req, res) => {
        const book = await Book.findByPk(req.params.id);

        res.render("update-book", { book });
    })
);

/* POST routes */
router.post(
    "/books/new",
    handleRouteAsync(async (req, res) => {
        let book;

        try {
            book = await Book.create(req.body);

            res.redirect(`/books/${book.id}`);
        } catch (error) {
            if (error.name === "SequelizeValidationError") {
                book = await Book.build(req.body);

                res.render("form-error", { book });
                // res.render("new-book", {
                //     book,
                //     errors: errors.errors,
                //     title: "New Book",
                // });
            } else {
                throw error;
            }
        }
    })
);

router.post(
    "/books/:id",
    handleRouteAsync(async (req, res) => {
        const book = await Book.findByPk(req.params.id);
        await book.update(req.body);

        res.redirect("/books");
    })
);

router.post(
    "/books/:id/delete",
    handleRouteAsync(async (req, res) => {
        const book = await Book.findByPk(req.params.id);
        await book.destroy();

        res.redirect("/books");
    })
);

module.exports = router;
