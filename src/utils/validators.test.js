const { validateISBN } = require("./validators");

describe("validators", () => {
  it("should return false when input is invalid", () => {
    expect(validateISBN("")).toBe(false);
    expect(validateISBN(null)).toBe(false);
    expect(validateISBN(undefined)).toBe(false);
    expect(validateISBN(123)).toBe(false);
    expect(validateISBN("12345")).toBe(false);
    expect(validateISBN("123abc6789012")).toBe(false);
    expect(validateISBN("   ")).toBe(false);
    expect(validateISBN("978-3-16-148410-0a")).toBe(false);
    expect(validateISBN("12-34-5678-90-1")).toBe(false);
    expect(validateISBN("978 316 148410 X")).toBe(false);
  });

  it("should return true when input is valid", () => {
    expect(validateISBN("9783161484100")).toBe(true);
    expect(validateISBN("978-3-16-148410-0")).toBe(true);
    expect(validateISBN("978 3 16 148410 0")).toBe(true);
    expect(validateISBN("978-3-16-148-410-0")).toBe(true);
    expect(validateISBN("978 3161 48410 0")).toBe(true);
    expect(validateISBN("9780134685991")).toBe(true);
    expect(validateISBN("978-0-13-468599-1")).toBe(true);
    expect(validateISBN("978 0 13 468599 1")).toBe(true);
    expect(validateISBN("9781491954249")).toBe(true);
    expect(validateISBN("978-1-49-195424-9")).toBe(true);
  });
});
