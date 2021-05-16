const express = require("express");
const router = express.Router();

const Book = require("../models").Book;

/* Helper function to handle each route async */
const handleRouteAsync = (callback) => {
    return async (req, res, next) => {
        try {
            await callback(req, res, next);
        } catch (err) {
            next(err);
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
        /* Store search and page query params */
        const pageNumber = parseInt(req.query.p);

        /* Declare pages object used for pagination */
        const pages = {
            current: isNaN(pageNumber) ? 1 : pageNumber,
            limit: 10,
        };

        /* Get all books from database */
        const { count, rows } = await Book.findAndCountAll({
            limit: pages.limit,
            offset: (pages.current - 1) * pages.limit,
        });

        /* Add pagination keys based on books returned from database */
        pages.total = Math.ceil(count / pages.limit);
        pages.previous =
            pages.current > 1 && pages.total > 1
                ? `/books?p=${pages.current - 1}`
                : false;
        pages.next =
            pages.current < pages.total && pages.total > 1
                ? `/books?p=${pages.current + 1}`
                : false;

        /* Render all books returned from database */
        res.render("index", {
            title: "All Books",
            rows,
            pages,
            showHomeButton: false,
        });
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
        } catch (err) {
            if (err.name === "SequelizeValidationError") {
                /* Store data of invalid new book */
                book = await Book.build(req.body);

                /* Render form with error message(s) and data of invalid new book */
                res.render("form-error", {
                    title: "Create New Book",
                    book,
                    errors: err.errors,
                    action: "/books/new",
                });
            } else {
                /* Throw other errors that will be caught in handleRouteAsync */
                throw err;
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
        } catch (err) {
            if (err.name === "SequelizeValidationError") {
                /* Store data of invalid book update */
                book = await Book.build(req.body);
                book.id = req.params.id;

                /* Render form with error message(s) and data of invalid book update */
                res.render("form-error", {
                    title: "Edit Book",
                    book,
                    errors: err.errors,
                    action: `/books/${book.id}`,
                });
            } else {
                /* Throw other errors that will be caught in handleRouteAsync */
                throw err;
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
