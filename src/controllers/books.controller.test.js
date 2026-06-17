const booksController = require("./books.controller");
const BookModel = require("../models/books.model");
const { validateISBN } = require("../utils/validators");

jest.mock("../models/books.model");
jest.mock("../utils/validators");

const mockBook = {
  id: 1,
  title: "Le Petit Prince",
  author: "Antoine de Saint-Exupéry",
  isbn: "9782070612758",
  year: 1943,
  available: true,
  borrower: null,
  borrowedAt: null,
};

let req, res;

beforeEach(() => {
  req = { params: {}, query: {}, body: {} };
  res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  jest.clearAllMocks();
});

describe("getBooks", () => {
  it("should return all books", () => {
    BookModel.findAll.mockReturnValue([mockBook]);
    booksController.getBooks(req, res);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: [mockBook] });
  });

  it("should filter available books when available query param is set", () => {
    const unavailable = { ...mockBook, id: 2, available: false };
    BookModel.findAll.mockReturnValue([mockBook, unavailable]);
    req.query.available = "true";
    booksController.getBooks(req, res);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: [mockBook] });
  });
});

describe("getBookById", () => {
  it("should return the book when found", () => {
    BookModel.findById.mockReturnValue(mockBook);
    req.params.id = 1;
    booksController.getBookById(req, res);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: mockBook });
  });

  it("should return 404 when book not found", () => {
    BookModel.findById.mockReturnValue(null);
    req.params.id = 999;
    booksController.getBookById(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ success: false, error: "Book not found" });
  });
});

describe("createBook", () => {
  it("should create and return the book", () => {
    validateISBN.mockReturnValue(true);
    BookModel.create.mockReturnValue(mockBook);
    req.body = { title: "Le Petit Prince", author: "Antoine de Saint-Exupéry", isbn: "9782070612758", year: 1943 };
    booksController.createBook(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: mockBook });
  });

  it("should return 400 when a required field is missing", () => {
    req.body = { title: "Le Petit Prince", author: "Antoine de Saint-Exupéry", isbn: "9782070612758" };
    booksController.createBook(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: "Missing required fields: title, author, isbn, year",
    });
  });

  it("should return 400 when ISBN is invalid", () => {
    validateISBN.mockReturnValue(false);
    req.body = { title: "Le Petit Prince", author: "Antoine de Saint-Exupéry", isbn: "invalid", year: 1943 };
    booksController.createBook(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ success: false, error: "Invalid ISBN format" });
  });
});

describe("updateBook", () => {
  it("should return the updated book", () => {
    const updated = { ...mockBook, title: "Le Grand Prince" };
    BookModel.findById.mockReturnValue(mockBook);
    BookModel.update.mockReturnValue(updated);
    req.params.id = 1;
    req.body = { title: "Le Grand Prince" };
    booksController.updateBook(req, res);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: updated });
  });

  it("should return 404 when book not found", () => {
    BookModel.findById.mockReturnValue(null);
    req.params.id = 999;
    booksController.updateBook(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ success: false, error: "Book not found" });
  });
});

describe("deleteBook", () => {
  it("should return the deleted book", () => {
    BookModel.delete.mockReturnValue(mockBook);
    req.params.id = 1;
    booksController.deleteBook(req, res);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: mockBook });
  });

  it("should return 404 when book not found", () => {
    BookModel.delete.mockReturnValue(null);
    req.params.id = 999;
    booksController.deleteBook(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ success: false, error: "Book not found" });
  });
});

describe("borrow", () => {
  it("should borrow a book", () => {
    const borrowed = { ...mockBook, available: false, borrower: "John Doe", borrowedAt: expect.any(String) };
    BookModel.findById.mockReturnValue(mockBook);
    BookModel.update.mockReturnValue(borrowed);
    req.params.id = 1;
    req.body = { borrower: "John Doe" };
    booksController.borrowBook(req, res);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: borrowed });
  });

  it("should return 404 when book not found", () => {
    BookModel.findById.mockReturnValue(null);
    req.params.id = 999;
    req.body = { borrower: "John Doe" };
    booksController.borrowBook(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ success: false, error: "Book not found" });
  });

  it("should return 400 when book is not available", () => {
    BookModel.findById.mockReturnValue({ ...mockBook, available: false });
    req.params.id = 1;
    req.body = { borrower: "John Doe" };
    booksController.borrowBook(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ success: false, error: "Book is not available" });
  });

  it("should return 400 when borrower is missing", () => {
    BookModel.findById.mockReturnValue(mockBook);
    req.params.id = 1;
    req.body = {};
    booksController.borrowBook(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ success: false, error: "Borrower name is required" });
  });
});

describe("returnBook", () => {
  it("should return the book successfully", () => {
    const borrowed = { ...mockBook, available: false, borrower: "John Doe" };
    const returned = { ...mockBook, available: true, borrower: null, borrowedAt: null };
    BookModel.findById.mockReturnValue(borrowed);
    BookModel.update.mockReturnValue(returned);
    req.params.id = 1;
    booksController.returnBook(req, res);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: returned });
  });

  it("should return 404 when book not found", () => {
    BookModel.findById.mockReturnValue(null);
    req.params.id = 999;
    booksController.returnBook(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ success: false, error: "Book not found" });
  });

  it("should return 400 when book is not currently borrowed", () => {
    BookModel.findById.mockReturnValue(mockBook);
    req.params.id = 1;
    booksController.returnBook(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ success: false, error: "Book is not currently borrowed" });
  });
});
