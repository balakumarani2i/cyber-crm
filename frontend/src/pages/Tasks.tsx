import { useState, useEffect } from 'react';
import { Plus, Calendar, AlertCircle } from 'lucide-react';
import { taskAPI } from '../utils/api';
import { useToast } from '../contexts/ToastContext';
import TaskModal from '../components/TaskModal';

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  status: string;
  customer: string;
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { showSuccess, showError } = useToast();

  const fetchTasks = async () => {
    try {
      const response = await taskAPI.getAll();
      const tasksData = response.data || response;
      setTasks(tasksData.map((task: any) => ({
        ...task,
        customer: task.customer ? `${task.customer.name} - ${task.customer.company || 'N/A'}` : 'No customer'
      })));
    } catch (error: any) {
      showError(error.message || 'Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSave = () => {
    fetchTasks();
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        const taskData = {
          title: task.title,
          description: task.description,
          dueDate: task.dueDate,
          priority: task.priority,
          status: 'COMPLETED',
          customerId: task.customerId
        };
        const response = await taskAPI.update(taskId, taskData);
        showSuccess('Task completed successfully!');
        fetchTasks();
      }
    } catch (error: any) {
      showError(error.message || 'Failed to complete task. Please try again.');
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-gray-100 text-gray-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  if (loading) {
    return <div className="flex justify-center py-8">Loading tasks...</div>;
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-white">Tasks</h1>
          <p className="mt-2 text-sm text-white">
            Manage your follow-ups and reminders.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button 
            onClick={handleAddTask}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </button>
        </div>
      </div>

      <div className="mt-8 space-y-4 h-[65vh] overflow-y-auto">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white shadow rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600">{task.description}</p>
                <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                    {isOverdue(task.dueDate) && (
                      <AlertCircle className="w-4 h-4 ml-1 text-red-500" />
                    )}
                  </div>
                  <div>Customer: {task.customer}</div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleEditTask(task)}
                  className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleCompleteTask(task.id)}
                  className="text-green-600 hover:text-green-900 text-sm font-medium"
                  disabled={task.status === 'COMPLETED'}
                >
                  {task.status === 'COMPLETED' ? 'Completed' : 'Complete'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <TaskModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        task={editingTask}
        onSave={handleSave}
      />
    </div>
  );
}