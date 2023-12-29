const router = require("express").Router();
const Order = require("../models/Order");
const { verifyToken, verifyAndAuth, verifyAndAdmin } = require("./verifyToken");

// create an order
router.post("/", verifyToken, async (req, res) => {
  const newOrder = new Order(req.body);
  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

// update method
router.put("/:id", verifyAndAdmin, async (req, res) => {
  // making the changes to the db (updating the info when successfull)
  try {
    // making a select request
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    // sending the result
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete method
router.delete("/:id", verifyAndAdmin, async (req, res) => {
  try {
    // making a select request
    await Order.findByIdAndDelete(req.params.id);
    // sending the result
    res.status(200).json("Order is deleted successfully...");
  } catch (err) {
    res.status(500).json(err);
  }
});

// get user orders method
router.get("/find/:userId", verifyAndAuth, async (req, res) => {
  try {
    // making a select request
    const orders = await Order.find({ userId: req.params.userId });

    // sending the result when the status is 200
    return res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get all
router.get("/", verifyAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get stats -> income for admin
router.get("/income", verifyAndAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const prevMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      {
        $match: { createdAt: { $gte: prevMonth } },
      },
      {
        $project: {
          month: {
            $month: "$createdAt",
          },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
