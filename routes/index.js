const express = require("express");
const router = express.Router();
const Book = require("../models").Book;

/* GET home page. */
router.get("/", async (req, res, next) => {
    const books = await Book.findAll();
    res.render("index", { books });
});

module.exports = router;
