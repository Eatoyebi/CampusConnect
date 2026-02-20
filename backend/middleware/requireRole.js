// backend/middleware/requireRole.js
export default function requireRole(allowed) {
  // allowed can be: "ra" OR ["ra","admin"]
  const allowedRoles = Array.isArray(allowed) ? allowed : [allowed];

  return (req, res, next) => {
    const role = req.user?.role;

    if (!role) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
} 