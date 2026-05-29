jest.mock("fs");

const request = require("supertest");

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

let app;

beforeEach(() => {
  jest.resetModules();
  const fs = require("fs");
  fs.readFileSync.mockReturnValue(JSON.stringify(SEED_DATA));
  app = require("../app");
});

describe("GET /api/books/search", () => {
  it("should return 200 with a success response", async () => {
    const res = await request(app).get("/api/books/search?q=Prince");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should match books by title (case insensitive)", async () => {
    const res = await request(app).get("/api/books/search?q=petit prince");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].id).toBe(1);
  });

  it("should match books by author (case insensitive)", async () => {
    const res = await request(app).get("/api/books/search?q=camus");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].author).toBe("Albert Camus");
  });

  it("should return all books when q is empty", async () => {
    const res = await request(app).get("/api/books/search?q=");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(SEED_DATA.length);
  });

  it("should return all books when q is absent", async () => {
    const res = await request(app).get("/api/books/search");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(SEED_DATA.length);
  });

  it("should return an empty array when no book matches", async () => {
    const res = await request(app).get("/api/books/search?q=zzznomatch");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(0);
  });

  it("should match partial strings", async () => {
    const res = await request(app).get("/api/books/search?q=ger");
    expect(res.status).toBe(200);
    const titles = res.body.data.map((b) => b.title);
    expect(titles).toContain("Germinal");
    expect(titles).toContain("L'Étranger");
  });
});
