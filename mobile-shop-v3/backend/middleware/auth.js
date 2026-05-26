const jwt = require('jsonwebtoken');

// This middleware runs before protected routes
// It checks if the user is logged in by verifying their token
module.exports = (req, res, next) => {
  try {
    // Token comes in the Authorization header as "Bearer <token>"
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token. Please login first.' });
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify the token is valid and not expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to the request so routes can use it
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token. Please login again.' });
  }
};
