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

describe("GET /inexistant/routes", () => {
  it("should return 404 for non-existent routes", async () => {
    const res = await request(app).get("/inexistant/routes");
    expect(res.status).toBe(404);
  });
  it("should return 404 for non-existent routes", async () => {
    const res = await request(app).get("/api/v1/books");
    expect(res.status).toBe(404);
  });
  it("should return 404 for non-existent routes", async () => {
    const res = await request(app).get("/ffuiezbiez");
    expect(res.status).toBe(404);
  });
  it("should return 404 for non-existent routes", async () => {
    const res = await request(app).get(
      "/api/books/653463546351354646165416464641",
    );
    expect(res.status).toBe(404);
  });
});
