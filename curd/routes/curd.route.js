const express = require("express");

const router = express.Router();

const {
  createCurd,
  getCurds,
  deleteCurd,
  updateCurd,
} = require("../controllers/curd.controller");

router.post("/createCurd", createCurd);
router.get("/getCurds", getCurds);
router.delete("/deleteCurd/:id", deleteCurd);
router.put("/updateCurd/:id", updateCurd);

module.exports = router;
