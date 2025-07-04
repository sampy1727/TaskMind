const Task = require("../models/Task");

// Create a new task (admin only)
const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, assignedTo, attachments, todochecklists } = req.body;
    const task = new Task({
      title,
      description,
      dueDate,
      priority,
      assignedTo,
      createdBy: req.user._id,
      attachments,
      todochecklists
    });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all tasks (admin: all, user: assigned)
const getAllTasks = async (req, res) => {
  try {
    let tasks;
    if (req.user.role === "admin") {
      tasks = await Task.find().populate("assignedTo", "name email").populate("createdBy", "name email");
    } else {
      tasks = await Task.find({ assignedTo: req.user._id }).populate("assignedTo", "name email").populate("createdBy", "name email");
    }
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single task by ID
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("assignedTo", "name email").populate("createdBy", "name email");
    if (!task) return res.status(404).json({ message: "Task not found" });
    // Only admin or assigned user can view
    if (req.user.role !== "admin" && task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update a task by ID
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    // Only admin or assigned user can update
    if (req.user.role !== "admin" && task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }
    Object.assign(task, req.body);
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a task by ID (admin only)
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update task status
const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    // Only admin or assigned user can update status
    if (req.user.role !== "admin" && task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }
    task.status = status;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update task checklist
const updateTaskChecklist = async (req, res) => {
  try {
    const { todochecklists } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    // Only admin or assigned user can update checklist
    if (req.user.role !== "admin" && task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }
    task.todochecklists = todochecklists;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Dashboard data for all users (admin only)
// Dashboard data for all users (admin only)
const getDashboardData = async (req, res) => {
  try {
    // Basic stats
    const totalTasks = await Task.countDocuments();
    const pendingTasks = await Task.countDocuments({ status: "Pending" });
    const inProgressTasks = await Task.countDocuments({ status: "In Progress" });
    const completedTasks = await Task.countDocuments({ status: "Completed" });
    const overdueTasks = await Task.countDocuments({
      status: { $ne: "Completed" },
      dueDate: { $lt: new Date() }
    });

    // Task distribution by status
    const taskDistributionRaw = await Task.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    const taskDistribution = {};
    taskDistributionRaw.forEach(item => {
      taskDistribution[item._id] = item.count;
    });

    // Recent 10 tasks (for admin: all tasks)
    const recenttasks = await Task.find()
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      statistic: {
        totalTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks
      },
      charts: {
        overdueTasks,
        taskDistribution
      },
      recenttasks
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// Dashboard data for the logged-in user
const getUserDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;

    // Basic stats
    const totalTasks = await Task.countDocuments({ assignedTo: userId });
    const pendingTasks = await Task.countDocuments({ assignedTo: userId, status: "Pending" });
    const inProgressTasks = await Task.countDocuments({ assignedTo: userId, status: "In Progress" });
    const completedTasks = await Task.countDocuments({ assignedTo: userId, status: "Completed" });
    const overdueTasks = await Task.countDocuments({
      assignedTo: userId,
      status: { $ne: "Completed" },
      dueDate: { $lt: new Date() }
    });

    // Task distribution by status
    const taskDistributionRaw = await Task.aggregate([
      { $match: { assignedTo: userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    const taskDistribution = {};
    taskDistributionRaw.forEach(item => {
      taskDistribution[item._id] = item.count;
    });
    const recenttasks = await Task.find({ assignedTo: userId })
      .sort({ createdAt: -1 })
      .limit(10);
   
    res.json({
    statistic:{  totalTasks,
      pendingTasks,
      inProgressTasks,
      completedTasks},
    charts:{  overdueTasks,
      taskDistribution},
      recenttasks
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskChecklist,
  getDashboardData,
  getUserDashboardData
};