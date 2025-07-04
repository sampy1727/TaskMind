const express = require("express");
const router = express.Router();
const { getAllUsers, getUserById, updateUser, deleteUser } = require("../controllers/userController");
const { auth, adminOnly } = require("../middlewares/authmiddleware");

// Get all users (admin only)
router.get("/", auth, adminOnly, getAllUsers);

// Get a user by ID (admin or self)
router.get("/:id", auth, getUserById);

// Update a user by ID (admin or self)
router.put("/:id", auth, updateUser);

// Delete a user by ID (admin only)
router.delete("/:id", auth, adminOnly, deleteUser);

module.exports = router;