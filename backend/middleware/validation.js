// backend/middleware/validation.js

export const validateUserInput = (req, res, next) => {
  const { name, email } = req.body || {};

  // Minimal checks (expand later if needed)
  if (!name || !email) {
    return res.status(400).json({ error: "name and email are required" });
  }

  next();
};

export const validateUserUpdate = (req, res, next) => {
  // Allow partial updates; add specific rules later
  next();
};