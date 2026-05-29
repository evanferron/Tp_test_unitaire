const express = require("express");
const router = express.Router();
const booksController = require("../controllers/books.controller");

router.get("/", booksController.getBooks);
router.post("/", booksController.createBook);
router.get("/search", (req, res) => {
  const { q } = req.query;
  const books = require("../models/books.model").findAll();
  const results = books.filter(
    (b) =>
      b.title.toLowerCase().includes((q || "").toLowerCase()) ||
      b.author.toLowerCase().includes((q || "").toLowerCase()),
  );
  res.json({ success: true, data: results });
});
router.get("/:id", booksController.getBookById);
router.put("/:id", booksController.updateBook);
router.delete("/:id", booksController.deleteBook);
router.post("/:id/borrow", booksController.borrowBook);
router.post("/:id/return", booksController.returnBook);

module.exports = router;
