import React from "react";

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600">Overview & management panel</p>
      </header>
      <main>
        <section className="bg-white rounded shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-100 p-4 rounded">
              <p className="text-lg font-bold">0</p>
              <span className="text-gray-700">Users</span>
            </div>
            <div className="bg-green-100 p-4 rounded">
              <p className="text-lg font-bold">0</p>
              <span className="text-gray-700">Tasks</span>
            </div>
            <div className="bg-yellow-100 p-4 rounded">
              <p className="text-lg font-bold">0</p>
              <span className="text-gray-700">Projects</span>
            </div>
          </div>
        </section>
        <section className="bg-white rounded shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <p className="text-gray-500">No recent activity.</p>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;