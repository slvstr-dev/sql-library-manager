const express = require("express");
const router = express.Router();

/**
 * GET routes
 */
router.get("/", (req, res, next) => {
    res.redirect("/books");
});

module.exports = router;
