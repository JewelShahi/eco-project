const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

// Function to validate email using a simple regex
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// sign_up/register route
router.post("/signup", async (req, res) => {
  // Check if required fields are present in the request body
  if (
    !req.body.fullName ||
    !req.body.username ||
    !req.body.email ||
    !req.body.password
  ) {
    return res
      .status(400)
      .json({ error: "One or more required fields are missing..." });
  }

  // Check if the email is valid
  if (!isValidEmail(req.body.email)) {
    return res.status(400).json({ error: "Invalid email format..." });
  }

  // Making user data
  const newUser = new User({
    fullName: req.body.fullName,
    username: req.body.username,
    email: req.body.email,
    // encrypting the password
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASSWORD_SEC
    ).toString(),
  });

  // Trying to save the data in MongoDB
  try {
    // Saving it
    const savedUser = await newUser.save();
    return res.status(201).json(savedUser);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// login endpoint
router.post("/login", async (req, res) => {
  try {
    // making a select request
    const user = await User.findOne({
      email: req.body.email,
    });
    // if it's wrong (doesn't exists) - error
    if (!user) {
      return res.status(401).json("Wrong Email...");
    }

    // decrypting the password
    const hashPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASSWORD_SEC
    );

    // converting the decrypt password into string
    const realPassword = hashPassword.toString(CryptoJS.enc.Utf8);
    // if the password isnt same as signed in password or empty - error
    if (realPassword !== req.body.password) {
      return res.status(401).json("Wrong Password...");
    }
    // when everything is OK, create a JWT Token for saving the login info
    // after expiring date (1d) the user must login again
    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      // generating a JWT Token
      process.env.JWT_SEC,
      // giving it an expiration date
      { expiresIn: "7d" }
    );

    // destructuring the user data
    const { password, ...others } = user._doc;

    // giving the result when the status is 200 with the JWT Token
    return res.status(200).json({ ...others, accessToken });
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;