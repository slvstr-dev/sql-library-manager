const express = require("express");
const router = express.Router();

const { Op } = require("sequelize");

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

// /**
//  * GET routes
//  */
// router.get(
//     "/",
//     handleRouteAsync(async (req, res, next) => {
//         console.log("hello");
//         console.log(req.body);

//         /* Request book from database */
//         const book = await Book.findByPk(req.params.id);

//         /* Check if book request was successful */
//         if (book) {
//             /* Render book returned from database */
//             res.render("update-book", { title: "Book Details", book });
//         } else {
//             /* Call 404 middleware function */
//             next();
//         }
//     })
// );

router.post(
    "/",
    handleRouteAsync(async (req, res) => {
        const query = req.body.search;

        console.log(query);

        /* Get all books from database */
        const books = await Book.findAll({
            where: {
                [Op.or]: [
                    {
                        title: {
                            [Op.substring]: query,
                        },
                    },
                    {
                        author: {
                            [Op.substring]: query,
                        },
                    },
                    {
                        genre: {
                            [Op.substring]: query,
                        },
                    },
                    {
                        year: {
                            [Op.eq]: query,
                        },
                    },
                ],
            },
        });

        /* Render all books returned from database */
        res.render("index", { title: "Search Results", books, button: "Home" });
    })
);

module.exports = router;
