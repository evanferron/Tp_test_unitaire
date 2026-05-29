/**
 * Validates an ISBN number.
 * Supports ISBN-13 format.
 */
const validateISBN = (isbn) => {
  if (!isbn || typeof isbn !== "string") return false
  const cleaned = isbn.replace(/[-\s]/g, "")
  return cleaned.length === 13 && /^\d+$/.test(cleaned)
}

module.exports = { validateISBN }
