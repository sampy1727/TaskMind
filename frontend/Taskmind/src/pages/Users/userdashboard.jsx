import React from "react";

function UserDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">User Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here are your tasks and updates.</p>
      </header>
      <main>
        <section className="bg-white rounded shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">My Tasks</h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>No tasks assigned yet.</li>
          </ul>
        </section>
        <section className="bg-white rounded shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Notifications</h2>
          <p className="text-gray-500">No new notifications.</p>
        </section>
      </main>
    </div>
  );
}

export default UserDashboard;