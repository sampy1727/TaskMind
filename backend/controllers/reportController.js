const Task = require("../models/Task");
const User = require("../models/User");
const ExcelJS = require("exceljs");

// Export all tasks as Excel (admin only)
const exportTasksReport = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Tasks");

    worksheet.columns = [
      { header: "Title", key: "title", width: 30 },
      { header: "Description", key: "description", width: 40 },
      { header: "Due Date", key: "dueDate", width: 20 },
      { header: "Priority", key: "priority", width: 10 },
      { header: "Status", key: "status", width: 15 },
      { header: "Assigned To", key: "assignedTo", width: 25 },
      { header: "Created By", key: "createdBy", width: 25 }
    ];

    tasks.forEach(task => {
      worksheet.addRow({
        title: task.title,
        description: task.description,
        dueDate: task.dueDate ? task.dueDate.toISOString().split("T")[0] : "",
        priority: task.priority,
        status: task.status,
        assignedTo: task.assignedTo ? `${task.assignedTo.name} (${task.assignedTo.email})` : "",
        createdBy: task.createdBy ? `${task.createdBy.name} (${task.createdBy.email})` : ""
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=tasks_report.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Export user-task report as Excel (admin only)
const exportUsersReport = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("User Tasks");

    worksheet.columns = [
      { header: "User Name", key: "userName", width: 25 },
      { header: "User Email", key: "userEmail", width: 30 },
      { header: "Role", key: "role", width: 10 },
      { header: "Task Title", key: "taskTitle", width: 30 },
      { header: "Task Status", key: "taskStatus", width: 15 },
      { header: "Task Due Date", key: "taskDueDate", width: 20 }
    ];

    for (const user of users) {
      const tasks = await Task.find({ assignedTo: user._id });
      if (tasks.length === 0) {
        worksheet.addRow({
          userName: user.name,
          userEmail: user.email,
          role: user.role,
          taskTitle: "",
          taskStatus: "",
          taskDueDate: ""
        });
      } else {
        tasks.forEach(task => {
          worksheet.addRow({
            userName: user.name,
            userEmail: user.email,
            role: user.role,
            taskTitle: task.title,
            taskStatus: task.status,
            taskDueDate: task.dueDate ? task.dueDate.toISOString().split("T")[0] : ""
          });
        });
      }
    }

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=users_tasks_report.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  exportTasksReport,
  exportUsersReport
};