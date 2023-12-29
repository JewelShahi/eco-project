const router = require("express").Router();
const Product = require("../models/Product");
const { verifyToken, verifyAndAuth, verifyAndAdmin } = require("./verifyToken");

// create a product
router.post("/", verifyAndAdmin, async (req, res) => {
  const newProduct = new Product(req.body);
  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

// update method
router.put("/:id", verifyAndAdmin, async (req, res) => {
  // making the changes to the db (updating the info when successfull)
  try {
    // making a select request
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    // sending the result
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete method
router.delete("/:id", verifyAndAdmin, async (req, res) => {
  try {
    // making a select request
    await Product.findByIdAndDelete(req.params.id);
    // sending the result
    res.status(200).json("Product is deleted successfully...");
  } catch (err) {
    res.status(500).json(err);
  }
});

// get a product method
router.get("/find/:id", async (req, res) => {
  try {
    // making a select request
    const product = await Product.findById(req.params.id);

    // sending the result when the status is 200
    return res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get all products method
router.get("/", async (req, res) => {
  // getting the query
  const newQuery = req.query.new;
  const brandQuery = req.query.brand;

  try {
    let products;
    if (newQuery) {
      products = await Product.find().sort({ createdAt: -1 }).limit(5);
    } else if (brandQuery) {
      products = await Product.find({
        brand: {
          $in: [brandQuery],
        },
      });
    } else {
      products = await Product.find();
    }

    // sending the info
    return res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
