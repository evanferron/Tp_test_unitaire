const errorHandler = require("./errorHandler");

describe("errorHandler", () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  it("should return 500 with default message when no status or message", () => {
    const err = new Error();
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: "Internal server error",
    });
  });

  it("should use err.status when provided", () => {
    const err = new Error("Not found");
    err.status = 404;
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: "Not found",
    });
  });

  it("should use err.message when provided", () => {
    const err = new Error("Unauthorized");
    err.status = 401;
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: "Unauthorized",
    });
  });

  it("should log err.stack", () => {
    const err = new Error("Something went wrong");
    errorHandler(err, req, res, next);
    expect(console.error).toHaveBeenCalledWith(err.stack);
  });

  it("should fall back to default message when err.message is empty string", () => {
    const err = new Error("");
    err.status = 400;
    errorHandler(err, req, res, next);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: "Internal server error",
    });
  });

  it("should fall back to 500 when err.status is 0", () => {
    const err = new Error("Bad status");
    err.status = 0;
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("should never call next", () => {
    const err = new Error("Some error");
    errorHandler(err, req, res, next);
    expect(next).not.toHaveBeenCalled();
  });
});
