const express = require("express");
const router = express.Router();
const {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskChecklist,
  getDashboardData,
  getUserDashboardData
} = require("../controllers/taskController");
const { auth, adminOnly } = require("../middlewares/authmiddleware");

// Dashboard data for all users (admin only)
router.get("/dashboard-data", auth, adminOnly, getDashboardData);

// Dashboard data for the logged-in user
router.get("/user-dashboard-data", auth, getUserDashboardData);

// Get all tasks (admin: all, user: assigned)
router.get("/", auth, getAllTasks);

// Get task by ID
router.get("/:id", auth, getTaskById);

// Create a task (admin only)
router.post("/", auth, adminOnly, createTask);

// Update task details
router.put("/:id", auth, updateTask);

// Delete a task (admin only)
router.delete("/:id", auth, adminOnly, deleteTask);

// Update task status
router.put("/:id/status", auth, updateTaskStatus);

// Update task checklist
router.put("/:id/todo", auth, updateTaskChecklist);

module.exports = router;