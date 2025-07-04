import React, { useState } from "react";

function MyTasks() {
  // Example tasks data
  const [tasks, setTasks] = useState([
    { id: 1, title: "Complete Profile", dueDate: "2025-07-05", status: "Pending" },
    { id: 2, title: "Submit Report", dueDate: "2025-07-08", status: "Completed" },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h2 className="text-2xl font-bold mb-6">My Tasks</h2>
      <div className="bg-white rounded shadow p-6">
        {tasks.length === 0 ? (
          <p className="text-gray-500">You have no tasks assigned.</p>
        ) : (
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Due Date</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td className="px-4 py-2">{task.title}</td>
                  <td className="px-4 py-2">{task.dueDate}</td>
                  <td className="px-4 py-2">
                    <span
                      className={
                        task.status === "Completed"
                          ? "text-green-600 font-semibold"
                          : "text-yellow-600 font-semibold"
                      }
                    >
                      {task.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default MyTasks;