import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';
import Modal from '../../components/UI/Modal';
import Select from '../../components/UI/Select';
import { Eye, CheckSquare, Clock, AlertCircle } from 'lucide-react';
import axiosInstance from '../../utils/axiosinstanse';
import { TASK_ENDPOINTS } from '../../utils/apipath';
import { STATUS_OPTIONS } from '../../utils/data';
import { formatDate, getPriorityColor, getStatusColor, isOverdue } from '../../utils/helper';
import toast from 'react-hot-toast';

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axiosInstance.get(TASK_ENDPOINTS.GET_ALL);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (task) => {
    setSelectedTask(task);
    setIsViewModalOpen(true);
  };

  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      await axiosInstance.put(TASK_ENDPOINTS.UPDATE_STATUS(taskId), { status: newStatus });
      toast.success('Task status updated successfully');
      fetchTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Failed to update task status');
    }
  };

  const handleChecklistUpdate = async (taskId, updatedChecklist) => {
    try {
      await axiosInstance.put(TASK_ENDPOINTS.UPDATE_CHECKLIST(taskId), { 
        todochecklists: updatedChecklist 
      });
      toast.success('Checklist updated successfully');
      fetchTasks();
    } catch (error) {
      console.error('Error updating checklist:', error);
      toast.error('Failed to update checklist');
    }
  };

  const toggleChecklistItem = (task, itemIndex) => {
    const updatedChecklist = [...task.todochecklists];
    updatedChecklist[itemIndex].completed = !updatedChecklist[itemIndex].completed;
    handleChecklistUpdate(task._id, updatedChecklist);
  };

  const filteredTasks = tasks.filter(task => {
    switch (filter) {
      case 'pending':
        return task.status === 'Pending';
      case 'in-progress':
        return task.status === 'In Progress';
      case 'completed':
        return task.status === 'Completed';
      case 'overdue':
        return isOverdue(task.dueDate, task.status);
      default:
        return true;
    }
  });

  const filterOptions = [
    { value: 'all', label: 'All Tasks' },
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'overdue', label: 'Overdue' },
  ];

  if (loading) {
    return (
      <Layout title="My Tasks">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="My Tasks">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Tasks</h2>
            <p className="text-gray-600">Manage and track your assigned tasks</p>
          </div>
          <div className="w-48">
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              options={filterOptions}
            />
          </div>
        </div>

        {/* Task Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center">
              <CheckSquare className="w-8 h-8 text-blue-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-yellow-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tasks.filter(t => t.status === 'Pending').length}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center">
              <CheckSquare className="w-8 h-8 text-green-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tasks.filter(t => t.status === 'Completed').length}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center">
              <AlertCircle className="w-8 h-8 text-red-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tasks.filter(t => isOverdue(t.dueDate, t.status)).length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <Card>
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <CheckSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {filter === 'all' ? 'No tasks assigned yet' : `No ${filter} tasks found`}
              </p>
              <p className="text-gray-400 mt-2">
                {filter === 'all' 
                  ? 'Tasks assigned to you will appear here' 
                  : 'Try changing the filter to see other tasks'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <div key={task._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                        {isOverdue(task.dueDate, task.status) && (
                          <Badge variant="danger">Overdue</Badge>
                        )}
                      </div>
                      <p className="text-gray-600 mb-3">{task.description}</p>
                      
                      <div className="flex items-center space-x-4 text-sm">
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        <span className="text-gray-500">
                          Due: {formatDate(task.dueDate)}
                        </span>
                        <span className="text-gray-500">
                          Created by: {task.createdBy?.name}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusUpdate(task._id, e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        {STATUS_OPTIONS.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleView(task)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>

                  {/* Checklist Preview */}
                  {task.todochecklists && task.todochecklists.length > 0 && (
                    <div className="border-t pt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Checklist ({task.todochecklists.filter(item => item.completed).length}/{task.todochecklists.length})
                      </h4>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {task.todochecklists.slice(0, 3).map((item, index) => (
                          <div key={index} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={item.completed}
                              onChange={() => toggleChecklistItem(task, index)}
                              className="mr-2 text-primary focus:ring-primary"
                            />
                            <span className={`text-sm ${item.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                              {item.text}
                            </span>
                          </div>
                        ))}
                        {task.todochecklists.length > 3 && (
                          <p className="text-xs text-gray-500">
                            +{task.todochecklists.length - 3} more items
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* View Task Modal */}
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title="Task Details"
          size="lg"
        >
          {selectedTask && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{selectedTask.title}</h3>
                <p className="text-gray-600">{selectedTask.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Priority:</span>
                  <Badge className={`ml-2 ${getPriorityColor(selectedTask.priority)}`}>
                    {selectedTask.priority}
                  </Badge>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Status:</span>
                  <Badge className={`ml-2 ${getStatusColor(selectedTask.status)}`}>
                    {selectedTask.status}
                  </Badge>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Due Date:</span>
                  <span className="ml-2 text-sm text-gray-900">
                    {formatDate(selectedTask.dueDate)}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Created By:</span>
                  <span className="ml-2 text-sm text-gray-900">
                    {selectedTask.createdBy?.name}
                  </span>
                </div>
              </div>

              {selectedTask.todochecklists && selectedTask.todochecklists.length > 0 && (
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">
                    Checklist ({selectedTask.todochecklists.filter(item => item.completed).length}/{selectedTask.todochecklists.length} completed)
                  </h4>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {selectedTask.todochecklists.map((item, index) => (
                      <div key={index} className="flex items-center p-2 bg-gray-50 rounded">
                        <input
                          type="checkbox"
                          checked={item.completed}
                          onChange={() => toggleChecklistItem(selectedTask, index)}
                          className="mr-3 text-primary focus:ring-primary"
                        />
                        <span className={`${item.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <select
                  value={selectedTask.status}
                  onChange={(e) => {
                    handleStatusUpdate(selectedTask._id, e.target.value);
                    setSelectedTask(prev => ({ ...prev, status: e.target.value }));
                  }}
                  className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {STATUS_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <Button onClick={() => setIsViewModalOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </Layout>
  );
};

export default MyTasks;