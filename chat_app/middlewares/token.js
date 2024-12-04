import jwt from 'jsonwebtoken';

const validateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.SECRET_KEY, (err, payload) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: "Invalid token",
        });
      } else {
        req.user = payload;
        next();
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: "Token is not provided",
    });
  }
};

export default validateToken;
