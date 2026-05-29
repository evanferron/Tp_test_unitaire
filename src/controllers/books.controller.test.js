const booksController = require("./books.controller");

describe("borrow", () => {
  it("should borrow a book", () => {
    const req = { params: { id: 1 }, body: { borrower: "John Doe" } };
    const res = { json: jest.fn() };
    booksController.borrowBook(req, res);
    console.log(res.json);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: {
        author: "Antoine de Saint-Exupéry",
        available: false,
        borrower: "John Doe",
        borrowedAt: expect.any(String),
        id: 1,
        isbn: "9782070612758",
        title: "Le Petit Prince",
        year: 1943,
      },
    });
  });
});
