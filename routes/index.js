const express = require("express");
const router = express.Router();

const Book = require("../models").Book;

/* Helper function to handle each route async */
const handleRouteAsync = (callback) => {
    return async (req, res, next) => {
        try {
            await callback(req, res, next);
        } catch (error) {
            next(error);
        }
    };
};

/**
 * GET routes
 */
router.get(
    "/",
    handleRouteAsync(async (req, res) => {
        /* Redirect to /books route */
        res.redirect("/books");
    })
);

router.get(
    "/books",
    handleRouteAsync(async (req, res) => {
        /* Get all books from database */
        const books = await Book.findAll();

        /* Render all books returned from database */
        res.render("index", { title: "All Books", books });
    })
);

router.get("/books/new", (req, res) => {
    /* Render form to add new book to database */
    res.render("new-book", { title: "Create New Book" });
});

router.get(
    "/books/:id",
    handleRouteAsync(async (req, res, next) => {
        /* Request book from database */
        const book = await Book.findByPk(req.params.id);

        /* Check if book request was successful */
        if (book) {
            /* Render book returned from database */
            res.render("update-book", { title: "Book Details", book });
        } else {
            /* Call 404 middleware function */
            next();
        }
    })
);

/**
 * POST routes
 */
router.post(
    "/books/new",
    handleRouteAsync(async (req, res) => {
        let book;

        /* Try adding a new book to database or handle exceptions */
        try {
            /* Add validated new book to database */
            book = await Book.create(req.body);

            /* Redirect to /books route */
            res.redirect("/books");
        } catch (error) {
            if (error.name === "SequelizeValidationError") {
                /* Store data of invalid new book */
                book = await Book.build(req.body);

                /* Render form with error message(s) and data of invalid new book */
                res.render("form-error", {
                    title: "Create New Book",
                    book,
                    errors: error.errors,
                    action: "/books/new",
                });
            } else {
                /* Throw other errors that will be caught in handleRouteAsync */
                throw error;
            }
        }
    })
);

router.post(
    "/books/:id",
    handleRouteAsync(async (req, res, next) => {
        let book;

        /* Try changing an updated book to database or handle exceptions */
        try {
            /* Request book from database */
            book = await Book.findByPk(req.params.id);

            /* Check if book request was successful */
            if (book) {
                /* Update book returned from database */
                await book.update(req.body);

                /* Redirect to /books route */
                res.redirect("/books");
            } else {
                /* Call 404 middleware function */
                next();
            }
        } catch (error) {
            if (error.name === "SequelizeValidationError") {
                /* Store data of invalid book update */
                book = await Book.build(req.body);
                book.id = req.params.id;

                /* Render form with error message(s) and data of invalid book update */
                res.render("form-error", {
                    title: "Edit Book",
                    book,
                    errors: error.errors,
                    action: `/books/${book.id}`,
                });
            } else {
                /* Throw other errors that will be caught in handleRouteAsync */
                throw error;
            }
        }
    })
);

router.post(
    "/books/:id/delete",
    handleRouteAsync(async (req, res, next) => {
        /* Request book from database */
        const book = await Book.findByPk(req.params.id);

        /* Check if book request was successful */
        if (book) {
            /* Delete book returned from database */
            await book.destroy();

            /* Redirect to /books route */
            res.redirect("/books");
        } else {
            /* Call 404 middleware function */
            next();
        }
    })
);

module.exports = router;
