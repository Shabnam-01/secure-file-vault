const express = require("express");
const router = express.Router();
const multer = require("multer");
const auth = require("../middleware/authMiddleware");
const fileController = require("../controllers/fileController");
const settingsController = require("../controllers/settings"); // Import the entire module

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
router.get("/stats", auth, fileController.getStats);


router.post("/upload", auth, upload.single("file"), fileController.uploadFile);
router.get("/settings", auth, settingsController.getSettings);
router.get("/", auth, fileController.getFiles);
router.get("/:id", auth, fileController.downloadFile);
router.delete("/:id", auth, fileController.deleteFile);

// Fixed settings route


module.exports = router;