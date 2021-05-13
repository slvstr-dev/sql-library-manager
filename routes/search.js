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

router.post(
    "/",
    handleRouteAsync(async (req, res) => {
        const query = req.body.search;

        console.log(query);

        /* Get all books from database */
        const { count, rows } = await Book.findAndCountAll({
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
            limit: 5,
        });

        /* Render all books returned from database */
        res.render("index", {
            title: "Search Results",
            count,
            rows,
            button: "Home",
        });
    })
);

module.exports = router;
