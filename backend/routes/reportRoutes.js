const express = require("express");
const router = express.Router();
const { auth, adminOnly } = require("../middlewares/authmiddleware");
const {
  exportTasksReport,
  exportUsersReport
} = require("../controllers/reportController");

// Export all tasks as Excel/PDF (admin only)
router.get("/export/tasks", auth, adminOnly, exportTasksReport);

// Export user-task report (admin only)
router.get("/export/users", auth, adminOnly, exportUsersReport);

module.exports = router;