import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';
import Modal from '../../components/UI/Modal';
import Input from '../../components/UI/Input';
import Select from '../../components/UI/Select';
import { Edit, Trash2, Eye, Download } from 'lucide-react';
import axiosInstance from '../../utils/axiosinstanse';
import { TASK_ENDPOINTS, REPORT_ENDPOINTS } from '../../utils/apipath';
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from '../../utils/data';
import { formatDate, getPriorityColor, getStatusColor } from '../../utils/helper';
import toast from 'react-hot-toast';

const ManageTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({});

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

  const handleEdit = (task) => {
    setSelectedTask(task);
    setEditFormData({
      title: task.title,
      description: task.description,
      dueDate: new Date(task.dueDate).toISOString().split('T')[0],
      priority: task.priority,
      status: task.status,
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (task) => {
    setSelectedTask(task);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axiosInstance.delete(TASK_ENDPOINTS.DELETE(selectedTask._id));
      toast.success('Task deleted successfully');
      fetchTasks();
      setIsDeleteModalOpen(false);
      setSelectedTask(null);
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(TASK_ENDPOINTS.UPDATE(selectedTask._id), editFormData);
      toast.success('Task updated successfully');
      fetchTasks();
      setIsEditModalOpen(false);
      setSelectedTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  };

  const handleExportTasks = async () => {
    try {
      const response = await axiosInstance.get(REPORT_ENDPOINTS.EXPORT_TASKS, {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'tasks_report.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Tasks exported successfully');
    } catch (error) {
      console.error('Error exporting tasks:', error);
      toast.error('Failed to export tasks');
    }
  };

  if (loading) {
    return (
      <Layout title="Manage Tasks">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Manage Tasks">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Manage Tasks</h2>
            <p className="text-gray-600">View, edit, and manage all tasks</p>
          </div>
          <Button onClick={handleExportTasks} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Tasks
          </Button>
        </div>

        <Card>
          {tasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No tasks found</p>
              <p className="text-gray-400 mt-2">Create your first task to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Task
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned To
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tasks.map((task) => (
                    <tr key={task._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{task.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {task.description}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {task.assignedTo?.name || 'Unassigned'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {task.assignedTo?.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={getStatusColor(task.status)}>
                          {task.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(task.dueDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleView(task)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(task)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(task)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedTask.title}</h3>
                <p className="text-gray-600 mt-2">{selectedTask.description}</p>
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
                  <span className="text-sm font-medium text-gray-500">Assigned To:</span>
                  <span className="ml-2 text-sm text-gray-900">
                    {selectedTask.assignedTo?.name || 'Unassigned'}
                  </span>
                </div>
              </div>

              {selectedTask.todochecklists && selectedTask.todochecklists.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Checklist:</h4>
                  <div className="space-y-2">
                    {selectedTask.todochecklists.map((item, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={item.completed}
                          readOnly
                          className="mr-2"
                        />
                        <span className={item.completed ? 'line-through text-gray-500' : ''}>
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal>

        {/* Edit Task Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Task"
          size="lg"
        >
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <Input
              label="Title"
              value={editFormData.title || ''}
              onChange={(e) => setEditFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={editFormData.description || ''}
                onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Due Date"
                type="date"
                value={editFormData.dueDate || ''}
                onChange={(e) => setEditFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                required
              />
              
              <Select
                label="Priority"
                value={editFormData.priority || ''}
                onChange={(e) => setEditFormData(prev => ({ ...prev, priority: e.target.value }))}
                options={PRIORITY_OPTIONS}
                required
              />
              
              <Select
                label="Status"
                value={editFormData.status || ''}
                onChange={(e) => setEditFormData(prev => ({ ...prev, status: e.target.value }))}
                options={STATUS_OPTIONS}
                required
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                Update Task
              </Button>
            </div>
          </form>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Delete Task"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to delete the task "{selectedTask?.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={confirmDelete}
              >
                Delete Task
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};

export default ManageTasks;