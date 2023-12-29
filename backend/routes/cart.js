const router = require("express").Router();
const Cart = require("../models/Cart");
const { verifyToken, verifyAndAuth, verifyAndAdmin } = require("./verifyToken");

// create a cart
router.post("/", verifyToken, async (req, res) => {
  const newCart = new Cart(req.body);
  try {
    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// update method
router.put("/:id", verifyAndAuth, async (req, res) => {
  // making the changes to the db (updating the info when successfull)
  try {
    // making a select request
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    // sending the result
    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete method
router.delete("/:id", verifyAndAuth, async (req, res) => {
  try {
    // making a select request
    await Cart.findByIdAndDelete(req.params.id);
    // sending the result
    res.status(200).json("Cart is deleted successfully...");
  } catch (err) {
    res.status(500).json(err);
  }
});

// get user cart for specific user method
router.get("/find/:userId", verifyAndAuth, async (req, res) => {
  try {
    // making a select request
    const cart = await Cart.findOne({ userId: req.params.userId });

    // sending the result when the status is 200
    return res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get all
router.get("/", verifyAndAdmin, async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
