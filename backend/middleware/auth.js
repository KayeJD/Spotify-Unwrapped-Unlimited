export function requireAuth(req, res, next) {
  if (!req.session?.access_token) {
    return res.status(401).json({ error: "Not authenticated. Please log in." });
  }
  next();
}
