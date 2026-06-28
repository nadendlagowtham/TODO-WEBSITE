import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import todoService from '../services/todoService';
import { useToast } from '../context/ToastContext';
import { formatDate, getPriorityStyles, getCategoryStyles, formatDateForInput } from '../utils/helpers';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import { 
  ArrowLeft, Calendar, AlertOctagon, CheckCircle2, Clock, 
  Edit, Trash2, CheckCircle, RefreshCw 
} from 'lucide-react';

const TodoDetailPage = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const navigate = useNavigate();
  const toast = useToast();

  // State
  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  
  // Modals
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // Form setup for Editing
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      category: 'Personal',
      priority: 'Medium',
      dueDate: '',
      status: 'Pending'
    }
  });

  // Fetch single todo details
  const fetchTodoDetails = useCallback(async () => {
    if (!id) {
      toast.error('Task identifier not provided.');
      navigate('/dashboard');
      return;
    }
    
    setLoading(true);
    try {
      const data = await todoService.getTodoById(id);
      setTodo(data);
      
      // Sync form fields
      reset({
        title: data.title,
        description: data.description || '',
        category: data.category || 'Personal',
        priority: data.priority || 'Medium',
        dueDate: data.dueDate ? formatDateForInput(data.dueDate) : '',
        status: data.status || 'Pending'
      });
    } catch (error) {
      console.error(error);
      toast.error('Unable to locate the requested task.');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  }, [id, navigate, reset, toast]);

  useEffect(() => {
    fetchTodoDetails();
  }, [fetchTodoDetails]);

  // Handle toggle status (complete / incomplete)
  const handleToggleStatus = async () => {
    if (!todo) return;
    setToggling(true);
    const nextStatus = todo.status === 'Completed' ? 'Pending' : 'Completed';
    try {
      const updated = await todoService.updateTodo(todo._id, { status: nextStatus });
      setTodo(updated);
      toast.success(
        nextStatus === 'Completed' 
          ? 'Task marked as completed!' 
          : 'Task reopened.'
      );
    } catch (error) {
      console.error(error);
      toast.error('Failed to change task status.');
    } finally {
      setToggling(false);
    }
  };

  // Open edit modal with fresh todo values
  const openEditModal = () => {
    if (!todo) return;
    reset({
      title: todo.title,
      description: todo.description || '',
      category: todo.category || 'Personal',
      priority: todo.priority || 'Medium',
      dueDate: todo.dueDate ? formatDateForInput(todo.dueDate) : '',
      status: todo.status || 'Pending'
    });
    setEditModalOpen(true);
  };

  // Handle Edit form submission
  const onEditSubmit = async (data) => {
    try {
      const updated = await todoService.updateTodo(todo._id, data);
      setTodo(updated);
      toast.success('Task details updated successfully.');
      setEditModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to update task.');
    }
  };

  // Handle Delete Confirmation
  const handleDeleteTask = async () => {
    try {
      await todoService.deleteTodo(todo._id);
      toast.success('Task removed from workspace.');
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete task.');
    } finally {
      setDeleteConfirmOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
        <span className="text-brand-muted font-geist font-medium text-sm">Retrieving task details...</span>
      </div>
    );
  }

  if (!todo) return null;

  const isCompleted = todo.status === 'Completed';
  const priorityStyle = getPriorityStyles(todo.priority);
  const categoryStyle = getCategoryStyles(todo.category);

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      {/* Back button link */}
      <div>
        <Link
          to="/dashboard"
          className="inline-flex items-center text-sm font-semibold text-brand-muted hover:text-brand-text transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-0.5 transition-transform" />
          Back to Workspace
        </Link>
      </div>

      {/* Main Details Card */}
      <div className="bg-white border border-brand-border rounded-lg shadow-soft-sm overflow-hidden relative">
        {/* High priority pulse bar */}
        {!isCompleted && todo.priority === 'High' && (
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-brand-error animate-pulse" />
        )}

        {/* Card Body */}
        <div className="p-8 space-y-6">
          {/* Header metadata row */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className={`text-xs font-geist font-bold tracking-wider uppercase border px-2.5 py-1 rounded-sm ${categoryStyle}`}>
              {todo.category}
            </span>

            {/* Status indicator badge */}
            <span className={`
              inline-flex items-center text-xs font-semibold px-2.5 py-1 border rounded-full
              ${isCompleted 
                ? 'bg-brand-success-bg text-brand-success-text border-brand-success/20' 
                : 'bg-brand-canvas text-brand-muted border-brand-border'
              }
            `}>
              <CheckCircle2 className={`w-3.5 h-3.5 mr-1.5 ${isCompleted ? 'text-brand-success' : 'text-gray-400'}`} />
              {todo.status}
            </span>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className={`
              text-3xl font-bold font-geist text-brand-text leading-tight break-words
              ${isCompleted ? 'line-through text-brand-muted font-normal' : ''}
            `}>
              {todo.title}
            </h1>
          </div>

          {/* Description */}
          <div className="prose max-w-none text-brand-muted text-sm leading-relaxed border-t border-brand-border pt-5">
            <h5 className="font-geist font-bold text-xs uppercase tracking-wider text-brand-text mb-2">
              Objective Details
            </h5>
            <p className="whitespace-pre-line break-words bg-brand-canvas/30 rounded p-4 border border-brand-border/50">
              {todo.description || 'No description provided for this task.'}
            </p>
          </div>

          {/* Key-Value Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-brand-border pt-6 text-sm">
            {/* Left Col */}
            <div className="space-y-4">
              {/* Due Date */}
              <div className="flex items-center text-brand-muted">
                <Calendar className="w-4 h-4 mr-2.5 text-gray-400" />
                <span className="font-geist font-semibold text-xs uppercase tracking-wider w-24 shrink-0">Due Date:</span>
                <span className={`font-medium text-brand-text ${todo.dueDate && new Date(todo.dueDate) < new Date() && !isCompleted ? 'text-brand-error font-semibold' : ''}`}>
                  {todo.dueDate ? formatDate(todo.dueDate) : 'No due date scheduled'}
                </span>
              </div>

              {/* Priority */}
              <div className="flex items-center text-brand-muted">
                <AlertOctagon className="w-4 h-4 mr-2.5 text-gray-400" />
                <span className="font-geist font-semibold text-xs uppercase tracking-wider w-24 shrink-0">Priority:</span>
                <span className={`inline-flex items-center text-[10px] font-bold font-geist px-1.5 py-0.5 border rounded-sm ${priorityStyle.bg}`}>
                  <span className={`w-1.5 h-1.5 rounded-full mr-1 ${priorityStyle.dot}`} />
                  {todo.priority}
                </span>
              </div>
            </div>

            {/* Right Col */}
            <div className="space-y-4">
              {/* Created Date */}
              <div className="flex items-center text-brand-muted">
                <Clock className="w-4 h-4 mr-2.5 text-gray-400" />
                <span className="font-geist font-semibold text-xs uppercase tracking-wider w-24 shrink-0">Created:</span>
                <span className="font-medium text-brand-text">{new Date(todo.createdAt).toLocaleString()}</span>
              </div>

              {/* Updated Date */}
              <div className="flex items-center text-brand-muted">
                <Clock className="w-4 h-4 mr-2.5 text-gray-400" />
                <span className="font-geist font-semibold text-xs uppercase tracking-wider w-24 shrink-0">Updated:</span>
                <span className="font-medium text-brand-text">{new Date(todo.updatedAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Panel Footer */}
        <div className="bg-brand-canvas/50 border-t border-brand-border px-8 py-5 flex flex-wrap items-center justify-between gap-4">
          {/* Toggle status action */}
          <Button
            variant={isCompleted ? 'secondary' : 'primary'}
            loading={toggling}
            onClick={handleToggleStatus}
            icon={isCompleted ? RefreshCw : CheckCircle}
          >
            {isCompleted ? 'Mark Pending' : 'Mark Completed'}
          </Button>

          {/* Edit/Delete Actions */}
          <div className="flex items-center space-x-2">
            <Button
              variant="secondary"
              onClick={openEditModal}
              icon={Edit}
            >
              Edit Details
            </Button>
            
            <Button
              variant="secondary"
              className="text-brand-error hover:bg-brand-error-bg hover:text-brand-error-text hover:border-brand-error/20"
              onClick={() => setDeleteConfirmOpen(true)}
              icon={Trash2}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Task Details"
        showActions={false}
        size="lg"
      >
        <form onSubmit={handleSubmit(onEditSubmit)} className="space-y-4">
          <Input
            label="Task Title"
            type="text"
            placeholder="Review monthly analytics..."
            required
            error={errors.title}
            {...register('title', {
              required: 'Task title is required',
              maxLength: {
                value: 80,
                message: 'Title cannot exceed 80 characters'
              }
            })}
          />

          <div className="flex flex-col space-y-1.5">
            <label className="font-geist text-xs font-semibold text-brand-muted uppercase tracking-wider select-none">
              Full Description
            </label>
            <textarea
              placeholder="Detail specific objectives or bullet points for this task..."
              rows={4}
              className="
                w-full px-3 py-2 border border-brand-border rounded text-sm placeholder-gray-400 outline-none
                focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all
              "
              {...register('description')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col space-y-1.5">
              <label className="font-geist text-xs font-semibold text-brand-muted uppercase tracking-wider select-none">
                Category
              </label>
              <select
                className="h-10 px-3 border border-brand-border bg-white rounded text-sm focus:ring-2 focus:ring-brand-primary outline-none"
                {...register('category')}
              >
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Shopping">Shopping</option>
                <option value="Health">Health</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="font-geist text-xs font-semibold text-brand-muted uppercase tracking-wider select-none">
                Priority
              </label>
              <select
                className="h-10 px-3 border border-brand-border bg-white rounded text-sm focus:ring-2 focus:ring-brand-primary outline-none"
                {...register('priority')}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="font-geist text-xs font-semibold text-brand-muted uppercase tracking-wider select-none">
                Due Date
              </label>
              <input
                type="date"
                className="h-10 px-3 border border-brand-border bg-white rounded text-sm focus:ring-2 focus:ring-brand-primary outline-none"
                {...register('dueDate')}
              />
            </div>
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="font-geist text-xs font-semibold text-brand-muted uppercase tracking-wider select-none">
              Current Status
            </label>
            <select
              className="h-10 px-3 border border-brand-border bg-white rounded text-sm focus:ring-2 focus:ring-brand-primary outline-none"
              {...register('status')}
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-brand-border">
            <Button variant="secondary" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="Confirm Task Deletion"
        confirmText="Delete Task"
        confirmVariant="primary"
        confirmLoading={false}
        onConfirm={handleDeleteTask}
        size="md"
      >
        <div className="space-y-2">
          <p className="text-sm text-brand-text">
            Are you sure you want to delete <span className="font-semibold font-geist">"{todo.title}"</span>?
          </p>
          <p className="text-xs text-brand-muted">
            This action is irreversible and will permanently remove this item from your workspace data.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default TodoDetailPage;
