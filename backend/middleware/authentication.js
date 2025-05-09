const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      message: 'Authentication required' 
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          message: 'Token expired' 
        });
      }
      return res.status(403).json({ 
        message: 'Invalid token' 
      });
    }
    req.user = user;
    next();
  });
};

exports.verifyRefreshToken = (req, res, next) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token required' });
  }

  jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }
    req.user = user;
    next();
  });
};
