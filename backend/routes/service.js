const router = require("express").Router();
const ServiceTicket = require("../models/Service");
const { verifyAndAuth, verifyAndAdmin } = require("./verifyToken");

// creating the service tickets, and saving it in mongodb
router.post("/", verifyAndAuth, async (req, res) => {
  const newServiceTicket = new ServiceTicket(req.body);
  try {
    const savedServiceTicket = await newServiceTicket.save();
    res.status(200).json(savedServiceTicket);
  } catch (err) {
    res.status(500).json(err);
  }
});

// update method
router.put("/:id", verifyAndAdmin, async (req, res) => {
  // making the changes to the db (updating the info when successfull)
  try {
    // making a select request
    const updatedServiceTicket = await ServiceTicket.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    // sending the result
    res.status(200).json(updatedServiceTicket);
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete method
router.delete("/:id", verifyAndAdmin, async (req, res) => {
  try {
    // making a select request
    await ServiceTicket.findByIdAndDelete(req.params.id);
    // sending the result
    res.status(200).json("Service ticket is deleted successfully...");
  } catch (err) {
    res.status(500).json(err);
  }
});

// get services for a specific user
router.get("/find/:userId", verifyAndAuth, async (req, res) => {
    try {
      // Making a select request
      const userServices = await ServiceTicket.find({ userId: req.params.userId });
  
      // Sending the result when the status is 200
      return res.status(200).json(userServices);
    } catch (err) {
      res.status(500).json(err);
    }
  });

// get a service ticket method
router.get("/find/:id", verifyAndAdmin, async (req, res) => {
  try {
    // making a select request
    const serviceTicket = await ServiceTicket.findById(req.params.id);

    // sending the result when the status is 200
    return res.status(200).json(serviceTicket);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get all service tickets method
router.get("/", verifyAndAdmin, async (req, res) => {
  try {
    const serviceTickets = await ServiceTicket.find();

    // sending the all users info
    return res.status(200).json(serviceTickets);
  } catch (err) {
    res.status(500).json(err);
  }
});

// service tickets stats
router.get("/stats", verifyAndAdmin, async (req, res) => {
  try {
    const totalTicketCount = await ServiceTicket.countDocuments();
    const pendingTickets = await ServiceTicket.countDocuments({
      status: "pending",
    });
    const completedTickets = await ServiceTicket.countDocuments({
      status: "completed",
    });

    const serviceTicketCountStats = {
      totalTicketCount,
      pendingTickets,
      completedTickets,
    };
    // sending the all users info
    return res.status(200).json(serviceTicketCountStats);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
