var express = require("express");
var router = express.Router();
var Book = require("../models").Book;

/* GET home page. */
router.get("/", async (req, res, next) => {
    const books = await Book.findAll();
    console.log(books);
    res.json(books);
    // res.render("index", { title: "Express" });
});

module.exports = router;
