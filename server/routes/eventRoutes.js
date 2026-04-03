const express = require("express");
const router = express.Router();
const controller = require("../controllers/eventControllers");
const upload = require("../middleware/upload");


router.post("/", upload.single("poster"), controller.createEvent);
// GET ALL EVENTS
router.get("/", controller.getAllEvents);

// GET BY DEPARTMENT
router.get("/dept/:dept", controller.getEventsByDept);

// UPDATE
router.put("/:id", upload.single("poster"), controller.updateEvent);

// DELETE
router.delete("/:id", controller.deleteEvent);



module.exports = router;