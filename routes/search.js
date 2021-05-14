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

router.get(
    "/",
    handleRouteAsync(async (req, res) => {
        /* Store search and page query params */
        const search = req.query.s;
        const pageNumber = parseInt(req.query.p);

        /* Declare pages object used for pagination */
        const pages = {
            current: isNaN(pageNumber) ? 1 : pageNumber,
            limit: 10,
        };

        /* Get all books from database */
        const { count, rows } = await Book.findAndCountAll({
            where: {
                [Op.or]: [
                    {
                        title: {
                            [Op.substring]: search,
                        },
                    },
                    {
                        author: {
                            [Op.substring]: search,
                        },
                    },
                    {
                        genre: {
                            [Op.substring]: search,
                        },
                    },
                    {
                        year: {
                            [Op.eq]: search,
                        },
                    },
                ],
            },
            limit: pages.limit,
            offset: (pages.current - 1) * pages.limit,
        });

        /* Add pagination keys based on books returned from database */
        pages.total = Math.ceil(count / pages.limit);
        pages.previous =
            pages.current > 1 && pages.total > 1
                ? `/search?s=${search}&p=${pages.current - 1}`
                : false;
        pages.next =
            pages.current < pages.total && pages.total > 1
                ? `/search?s=${search}&p=${pages.current + 1}`
                : false;

        /* Render all books returned from database */
        res.render("index", {
            title: `Search results for: '${search}'`,
            rows,
            pages,
            showHomeButton: true,
        });
    })
);

module.exports = router;
