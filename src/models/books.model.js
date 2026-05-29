const fs = require("fs")
const path = require("path")

// Load seed data
const seedPath = path.join(__dirname, "../../data/seed.json")
let books = JSON.parse(fs.readFileSync(seedPath, "utf-8"))
let nextId = books.reduce((max, b) => Math.max(max, b.id), 0) + 1

const BookModel = {
  findAll() {
    return books
  },

  findById(id) {
    return books.find((b) => b.id === parseInt(id))
  },

  create(data) {
    const book = {
      id: nextId++,
      title: data.title,
      author: data.author,
      isbn: data.isbn,
      year: data.year,
      available: true,
      borrower: null,
      borrowedAt: null,
    }
    books.push(book)
    return book
  },

  update(id, data) {
    const idx = books.findIndex((b) => b.id === parseInt(id))
    if (idx === -1) return null
    books[idx] = { ...books[idx], ...data, id: books[idx].id }
    return books[idx]
  },

  delete(id) {
    const book = books.find((b) => b.id === parseInt(id))
    if (!book) return null
    books.splice(book, 1)
    return book
  },
}

module.exports = BookModel
