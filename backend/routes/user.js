const router = require("express").Router();
const User = require("../models/User");
const { verifyToken, verifyAndAuth, verifyAndAdmin } = require("./verifyToken");

// update method
router.put("/:id", verifyAndAuth, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASSWORD_SEC
    ).toString();
  }

  // making the changes to the db (updating the info when successfull)
  try {
    // making a select request
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    // sending the result
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete method
router.delete("/:id", verifyAndAuth, async (req, res) => {
  try {
    // making a select request
    await User.findByIdAndDelete(req.params.id);
    // sending the result
    res.status(200).json("User is deleted successfully...");
  } catch (err) {
    res.status(500).json(err);
  }
});

// get a user method
router.get("/find/:id", verifyAndAdmin, async (req, res) => {
  try {
    // making a select request
    const user = await User.findById(req.params.id);

    // destructuring the object
    const { password, ...others } = user._doc;

    // sending the result when the status is 200 with the JWT Token
    return res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get all users method
router.get("/", verifyAndAdmin, async (req, res) => {
  // getting the query
  const query = req.query.new;
  try {
    // making a select request
    // or if we have a query -> get the first N new users
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find(req.params.id);

    // sending the all users info
    return res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

// user stats
router.get("/stats", verifyAndAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear() - 1);

  try {
    const data = await User.aggregate([
      {
        $match: { createdAt: { $gte: lastYear } },
      },
      {
        $project: {
          month: {
            $month: "$createdAt",
          },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

// user count
router.get("/userCount", verifyAndAdmin, async (req, res) => {
  try {
    // making select requests to get count of each user
    const totalUsers = await User.countDocuments();
    const adminUsers = await User.countDocuments({ isAdmin: true });
    const regularUsers = await User.countDocuments({ isAdmin: false });

    const users = {
      totalUsers,
      adminUsers,
      regularUsers,
    };

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get admin users data
router.get("/admins", verifyAndAdmin, async (req, res)=>{
  try {
    // making a select request to get all admin users
    const adminUsers = await User.find({isAdmin: true});

    res.status(200).json(adminUsers);
  } catch (err) {
    res.status(500).json(err);
  }
})

module.exports = router;
