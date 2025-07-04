const User = require("../models/User");
const Task = require("../models/Task");

// Get all users with task counts (for members)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    // Add task counts to each user
    const usersWithTaskCounts = await Promise.all(
      users.map(async (user) => {
        const pendingTasks = await Task.countDocuments({ assignedTo: user._id, status: "Pending" });
        const inProgressTasks = await Task.countDocuments({ assignedTo: user._id, status: "In Progress" });
        const completedTasks = await Task.countDocuments({ assignedTo: user._id, status: "Completed" });

        return {
          ...user.toObject(),
          pendingTasks,
          inProgressTasks,
          completedTasks
        };
      })
    );

    res.json(usersWithTaskCounts);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get a user by ID (admin or self)
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    // Allow only admin or the user themselves to access
    if (req.user.role !== "admin" && req.user.id !== user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update a user by ID (admin or self)
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    // Allow only admin or the user themselves to update
    if (req.user.role !== "admin" && req.user.id !== user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.profileImageUrl = req.body.profileImageUrl || user.profileImageUrl;
    await user.save();
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImageUrl: user.profileImageUrl
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a user by ID (admin only)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};