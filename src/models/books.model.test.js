jest.mock("fs");

const SEED_DATA = [
  {
    id: 1,
    title: "Le Petit Prince",
    author: "Antoine de Saint-Exupéry",
    isbn: "9782070612758",
    year: 1943,
    available: true,
    borrower: null,
    borrowedAt: null,
  },
  {
    id: 2,
    title: "L'Étranger",
    author: "Albert Camus",
    isbn: "9782070360024",
    year: 1942,
    available: false,
    borrower: "Marie Martin",
    borrowedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: 3,
    title: "Germinal",
    author: "Émile Zola",
    isbn: "2070413101",
    year: 1885,
    available: true,
    borrower: null,
    borrowedAt: null,
  },
];

let BookModel;

beforeEach(() => {
  jest.resetModules();
  const fs = require("fs");
  fs.readFileSync.mockReturnValue(JSON.stringify(SEED_DATA));
  BookModel = require("./books.model");
});

describe("findAll", () => {
  it("should return an array", () => {
    expect(Array.isArray(BookModel.findAll())).toBe(true);
  });

  it("should return all books from seed data", () => {
    expect(BookModel.findAll()).toHaveLength(SEED_DATA.length);
  });

  it("should contain the seed data", () => {
    const books = BookModel.findAll();
    expect(books[0].title).toBe("Le Petit Prince");
    expect(books[1].title).toBe("L'Étranger");
  });
});

describe("findById", () => {
  it("should return the book matching the id", () => {
    const book = BookModel.findById(1);
    expect(book).toBeDefined();
    expect(book.id).toBe(1);
    expect(book.title).toBe("Le Petit Prince");
  });

  it("should accept a string id parseInt", () => {
    const book = BookModel.findById("2");
    expect(book).toBeDefined();
    expect(book.id).toBe(2);
  });

  it("should return undefined for a non-existent id", () => {
    expect(BookModel.findById(999)).toBeUndefined();
  });

  it("should return undefined for a negative id", () => {
    expect(BookModel.findById(-1)).toBeUndefined();
  });
});

describe("create", () => {
  const newBookData = {
    title: "Candide",
    author: "Voltaire",
    isbn: "9782070360026",
    year: 1759,
  };

  it("should return the created book with the provided data", () => {
    const book = BookModel.create(newBookData);
    expect(book.title).toBe(newBookData.title);
    expect(book.author).toBe(newBookData.author);
    expect(book.isbn).toBe(newBookData.isbn);
    expect(book.year).toBe(newBookData.year);
  });

  it("should assign a numeric id to the new book", () => {
    expect(typeof BookModel.create(newBookData).id).toBe("number");
  });

  it("should assign an id greater than the current max", () => {
    const maxExisting = Math.max(...SEED_DATA.map((b) => b.id));
    expect(BookModel.create(newBookData).id).toBeGreaterThan(maxExisting);
  });

  it("should increment the id on each creation", () => {
    const first = BookModel.create(newBookData);
    const second = BookModel.create(newBookData);
    expect(second.id).toBe(first.id + 1);
  });

  it("should set available to true by default", () => {
    expect(BookModel.create(newBookData).available).toBe(true);
  });

  it("should set borrower to null by default", () => {
    expect(BookModel.create(newBookData).borrower).toBeNull();
  });

  it("should set borrowedAt to null by default", () => {
    expect(BookModel.create(newBookData).borrowedAt).toBeNull();
  });

  it("should add the book to the list", () => {
    const before = BookModel.findAll().length;
    const book = BookModel.create(newBookData);
    expect(BookModel.findAll()).toHaveLength(before + 1);
    expect(BookModel.findById(book.id)).toBeDefined();
  });

  it("should throw if data is null", () => {
    expect(() => BookModel.create(null)).toThrow(TypeError);
  });
});

describe("update", () => {
  it("should return the updated book", () => {
    const updated = BookModel.update(1, { title: "New Title" });
    expect(updated).toBeDefined();
    expect(updated.title).toBe("New Title");
  });

  it("should only modify the provided fields", () => {
    const original = BookModel.findById(1);
    const updated = BookModel.update(1, { title: "New Title" });
    expect(updated.author).toBe(original.author);
    expect(updated.isbn).toBe(original.isbn);
  });

  it("should preserve the original id even if data contains a different id", () => {
    expect(BookModel.update(1, { id: 999, title: "Modified" }).id).toBe(1);
  });

  it("should persist the change in the list", () => {
    BookModel.update(1, { available: false, borrower: "Alice" });
    const book = BookModel.findById(1);
    expect(book.available).toBe(false);
    expect(book.borrower).toBe("Alice");
  });

  it("should accept a string id", () => {
    const updated = BookModel.update("2", { borrower: "Bob" });
    expect(updated).toBeDefined();
    expect(updated.id).toBe(2);
  });

  it("should return null for a non-existent id", () => {
    expect(BookModel.update(999, { title: "Ghost" })).toBeNull();
  });
});

describe("delete", () => {
  it("should return the deleted book", () => {
    const book = BookModel.delete(1);
    expect(book).toBeDefined();
    expect(book.id).toBe(1);
  });

  it("should return null for a non-existent id", () => {
    expect(BookModel.delete(999)).toBeNull();
  });

  it("should remove the book from the list", () => {
    BookModel.delete(1);
    expect(BookModel.findById(1)).toBeUndefined();
  });

  it("should remove the correct book and leave the others intact", () => {
    const before = BookModel.findAll().length;
    BookModel.delete(2);
    expect(BookModel.findAll()).toHaveLength(before - 1);
    expect(BookModel.findById(1)).toBeDefined();
    expect(BookModel.findById(3)).toBeDefined();
  });
});
