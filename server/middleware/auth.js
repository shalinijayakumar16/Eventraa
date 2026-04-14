const jwt = require("jsonwebtoken");

const getTokenFromRequest = (req) => {
  const authHeader = req.headers.authorization || "";
  if (authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7).trim();
  }

  return req.headers["x-auth-token"] || null;
};

const requireAuth = (req, res, next) => {
  const token = getTokenFromRequest(req);

  if (!token) {
    return res.status(401).json({ message: "Authentication token required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "eventra-dev-secret");
    req.user = {
      id: decoded.id,
      role: decoded.role || "student",
      department: decoded.department || null,
    };

    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

const requireDepartmentAuth = (req, res, next) => {
  if (!req.user || req.user.role !== "department") {
    return res.status(403).json({ message: "Department access required" });
  }

  return next();
};

module.exports = { requireAuth, requireDepartmentAuth, getTokenFromRequest };
