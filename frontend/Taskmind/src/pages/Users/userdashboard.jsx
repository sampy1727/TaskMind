import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import Card from '../../components/UI/Card';
import { CheckSquare, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import axiosInstance from '../../utils/axiosinstanse';
import { TASK_ENDPOINTS } from '../../utils/apipath';
import toast from 'react-hot-toast';

const UserDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    statistic: {
      totalTasks: 0,
      pendingTasks: 0,
      inProgressTasks: 0,
      completedTasks: 0
    },
    charts: {
      overdueTasks: 0,
      taskDistribution: {}
    },
    recenttasks: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axiosInstance.get(TASK_ENDPOINTS.USER_DASHBOARD_DATA);
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout title="My Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  const stats = [
    {
      title: 'Total Tasks',
      value: dashboardData.statistic.totalTasks,
      icon: CheckSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Pending',
      value: dashboardData.statistic.pendingTasks,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'In Progress',
      value: dashboardData.statistic.inProgressTasks,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Completed',
      value: dashboardData.statistic.completedTasks,
      icon: CheckSquare,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ];

  return (
    <Layout title="My Dashboard">
      <div className="space-y-6">
        {/* Welcome Message */}
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <h2 className="text-2xl font-bold mb-2">Welcome back!</h2>
          <p className="text-blue-100">Here's an overview of your tasks and progress.</p>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-6">
                <div className="flex items-center">
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Charts and Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Overdue Tasks Alert */}
          <Card>
            <div className="flex items-center mb-4">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Overdue Tasks</h3>
            </div>
            <div className="text-center py-8">
              <div className="text-3xl font-bold text-red-600 mb-2">
                {dashboardData.charts.overdueTasks}
              </div>
              <p className="text-gray-600">Tasks past due date</p>
              {dashboardData.charts.overdueTasks > 0 && (
                <p className="text-sm text-red-500 mt-2">Please review your overdue tasks</p>
              )}
            </div>
          </Card>

          {/* Task Progress */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Progress</h3>
            <div className="space-y-3">
              {Object.entries(dashboardData.charts.taskDistribution).map(([status, count]) => (
                <div key={status} className="flex justify-between items-center">
                  <span className="text-gray-600">{status}</span>
                  <div className="flex items-center">
                    <span className="font-semibold mr-2">{count}</span>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          status === 'Completed' ? 'bg-green-500' :
                          status === 'In Progress' ? 'bg-blue-500' :
                          'bg-yellow-500'
                        }`}
                        style={{ 
                          width: `${dashboardData.statistic.totalTasks > 0 ? (count / dashboardData.statistic.totalTasks) * 100 : 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent Tasks */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">My Recent Tasks</h3>
          {dashboardData.recenttasks.length === 0 ? (
            <div className="text-center py-8">
              <CheckSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No tasks assigned yet</p>
              <p className="text-sm text-gray-400 mt-1">Tasks assigned to you will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {dashboardData.recenttasks.map((task) => (
                <div key={task._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">{task.title}</h4>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      task.priority === 'High' ? 'bg-red-100 text-red-800' :
                      task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {task.priority}
                    </span>
                    <span className="text-gray-500">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default UserDashboard;