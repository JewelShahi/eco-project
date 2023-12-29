const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // getting the token from the header of the request
  const authHeader = req.headers.token;
  // checking the token
  if (authHeader) {
    // getting the token
    const token = authHeader.split(" ")[1];
    // if it has the token - check if its valid
    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
      // checking for erros (invalid tokens)
      if (err) {
        return res.status(403).json("Token is invalid...");
      }
      // assigning the user to the request
      req.user = user;
      // go to the router
      next();
    });
  }
  // if doesn't have any token - the user isn't authenticated => error
  else {
    return res.status(401).json("Not authenticated...");
  }
};

// making the authorization (user and admin auth)
const verifyAndAuth = (req, res, next) => {
  verifyToken(req, res, () => {
    // checking if the ID is same as the ID of the user making the request
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("Not allowed to make changes...");
    }
  });
};

// admin can access things
const verifyAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    // checking if the user is admin
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("Only admin can make changes...");
    }
  });
};

module.exports = { verifyToken, verifyAndAuth, verifyAndAdmin };
