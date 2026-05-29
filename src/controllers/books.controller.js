const BookModel = require("../models/books.model");
const { validateISBN } = require("../utils/validators");

const booksController = {
  getBooks(req, res) {
    const { available } = req.query;
    let books = BookModel.findAll();

    if (available !== undefined) {
      books = books.filter((b) => b.available === true);
    }
    res.json({ success: true, data: books });
  },

  getBookById(req, res) {
    const book = BookModel.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, error: "Book not found" });
    }
    res.json({ success: true, data: book });
  },

  createBook(req, res) {
    const { title, author, isbn, year } = req.body;

    if (!title || !author || !isbn || !year) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: title, author, isbn, year",
      });
    }

    if (!validateISBN(isbn)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid ISBN format" });
    }

    const book = BookModel.create({ title, author, isbn, year });
    res.status(201).json({ success: true, data: book });
  },

  updateBook(req, res) {
    const book = BookModel.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, error: "Book not found" });
    }

    const updated = BookModel.update(req.params.id, req.body);
    res.json({ success: true, data: updated });
  },

  deleteBook(req, res) {
    const deleted = BookModel.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: "Book not found" });
    }
    res.json({ success: true, data: deleted });
  },

  borrowBook(req, res) {
    const book = BookModel.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, error: "Book not found" });
    }

    if (!book.available) {
      return res
        .status(400)
        .json({ success: false, error: "Book is not available" });
    }

    const { borrower } = req.body;
    if (!borrower) {
      return res
        .status(400)
        .json({ success: false, error: "Borrower name is required" });
    }

    const updated = BookModel.update(req.params.id, {
      available: false,
      borrower,
      borrowedAt: new Date().toISOString(),
    });

    res.json({ success: true, data: updated });
  },

  returnBook(req, res) {
    const book = BookModel.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, error: "Book not found" });
    }

    if (book.available) {
      return res
        .status(400)
        .json({ success: false, error: "Book is not currently borrowed" });
    }

    const updated = BookModel.update(req.params.id, {
      available: true,
      borrower: null,
      borrowedAt: null,
    });

    res.json({ success: true, data: updated });
  },
};

module.exports = booksController;
