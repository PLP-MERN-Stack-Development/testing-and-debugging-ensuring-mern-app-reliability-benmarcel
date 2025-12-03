const express = require("express");
const {createBugreport, deleteBugreport, updateBugreportStatus,  getBugReport,  getAllBugreports}= require("../controllers/bugController");
const router = express.Router();

router.get("/", getAllBugreports);
router.post("/", createBugreport);
router.get("/:id", getBugReport);
router.patch("/:id/status", updateBugreportStatus);
router.delete("/:id", deleteBugreport);

module.exports = router;