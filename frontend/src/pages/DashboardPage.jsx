import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import todoService from '../services/todoService';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import TodoCard from '../components/TodoCard';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import { formatDateForInput } from '../utils/helpers';
import { Plus, Search, Filter, ArrowUpDown, RefreshCw, XCircle } from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  // State Management
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Search & Filters State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');

  // Modal State
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null); // null when adding, todo object when editing
  const [deleteTodoConfirm, setDeleteTodoConfirm] = useState(null); // todo object to delete

  // React Hook Form for Task Form
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

  // Calculate analytics metrics
  const totalTasks = todos.length;
  const completedTasks = todos.filter(t => t.status === 'Completed').length;
  const pendingTasks = totalTasks - completedTasks;
  const highPriorityTasks = todos.filter(t => t.priority === 'High' && t.status !== 'Completed').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Fetch Todos from Backend API
  const fetchTodos = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      // Build API query parameters
      const filters = {};
      if (search.trim()) filters.search = search;
      if (statusFilter !== 'All') filters.status = statusFilter;
      
      // High Priority filter maps to priority='High'
      if (statusFilter === 'High Priority') {
        delete filters.status;
        filters.priority = 'High';
      } else {
        if (priorityFilter !== 'All') filters.priority = priorityFilter;
      }
      
      if (categoryFilter !== 'All') filters.category = categoryFilter;
      filters.sort = sortBy;

      const data = await todoService.getTodos(filters);
      setTodos(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load tasks. Please verify your connection.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [search, statusFilter, categoryFilter, priorityFilter, sortBy, toast]);

  // Debounced API fetch on filter/search updates
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTodos();
    }, 250); // 250ms debounce
    return () => clearTimeout(timer);
  }, [fetchTodos]);

  // Handle Mark Complete toggle
  const handleToggleComplete = async (todo) => {
    const nextStatus = todo.status === 'Completed' ? 'Pending' : 'Completed';
    try {
      // Optimistic update
      if (statusFilter !== 'All' && statusFilter !== 'High Priority') {
        setTodos(prev => prev.filter(t => t._id !== todo._id));
      } else {
        setTodos(prev => prev.map(t => t._id === todo._id ? { ...t, status: nextStatus } : t));
      }
      
      await todoService.updateTodo(todo._id, { status: nextStatus });
      toast.success(
        nextStatus === 'Completed' 
          ? 'Task marked as completed!' 
          : 'Task reopened.'
      );
    } catch (error) {
      console.error(error);
      // Rollback
      fetchTodos();
      toast.error('Failed to update task status.');
    }
  };

  // Open creation modal
  const openCreateModal = () => {
    setEditingTodo(null);
    reset({
      title: '',
      description: '',
      category: 'Personal',
      priority: 'Medium',
      dueDate: '',
      status: 'Pending'
    });
    setTaskModalOpen(true);
  };

  // Open edit modal
  const openEditModal = (todo) => {
    setEditingTodo(todo);
    reset({
      title: todo.title,
      description: todo.description || '',
      category: todo.category || 'Personal',
      priority: todo.priority || 'Medium',
      dueDate: todo.dueDate ? formatDateForInput(todo.dueDate) : '',
      status: todo.status || 'Pending'
    });
    setTaskModalOpen(true);
  };

  // Form Submit Handler (Create/Edit)
  const onTaskSubmit = async (data) => {
    try {
      if (editingTodo) {
        // Edit flow
        const updated = await todoService.updateTodo(editingTodo._id, data);
        setTodos(prev => prev.map(t => t._id === editingTodo._id ? updated : t));
        toast.success('Task details updated successfully.');
      } else {
        // Create flow
        const created = await todoService.createTodo(data);
        setTodos(prev => [created, ...prev]);
        toast.success('New task added successfully.');
      }
      setTaskModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error(editingTodo ? 'Failed to update task.' : 'Failed to create task.');
    }
  };

  // Confirm Delete
  const handleDeleteConfirm = async () => {
    if (!deleteTodoConfirm) return;
    const targetId = deleteTodoConfirm._id;
    try {
      await todoService.deleteTodo(targetId);
      setTodos(prev => prev.filter(t => t._id !== targetId));
      toast.success('Task removed from workspace.');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete task.');
    } finally {
      setDeleteTodoConfirm(null);
    }
  };

  // Navigate to Detail Page
  const handleViewDetails = (id) => {
    navigate(`/todo?id=${id}`);
  };

  // Clear all active query filters
  const clearAllFilters = () => {
    setSearch('');
    setStatusFilter('All');
    setCategoryFilter('All');
    setPriorityFilter('All');
    setSortBy('Newest');
  };

  return (
    <div className="space-y-6">
      {/* Header Info Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold font-geist text-brand-text">
            {user ? `${user.name}'s Workspace` : 'Workspace'}
          </h2>
          <p className="text-sm text-brand-muted mt-1">
            Review objectives, manage categories, and organize priorities.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="secondary"
            onClick={() => fetchTodos(true)}
            disabled={refreshing}
            icon={RefreshCw}
            className={refreshing ? 'animate-spin' : ''}
          >
            Refresh
          </Button>

          <Button
            variant="primary"
            onClick={openCreateModal}
            icon={Plus}
          >
            Add Task
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
        <div className="bg-white border border-brand-border rounded p-4 shadow-soft-sm flex flex-col justify-between hover:shadow-soft-md transition-shadow">
          <span className="text-[11px] font-geist font-bold text-brand-muted uppercase tracking-wider">Total Tasks</span>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-2xl font-bold font-geist text-brand-text">{totalTasks}</span>
            <span className="text-xs text-brand-muted">active</span>
          </div>
        </div>

        <div className="bg-white border border-brand-border rounded p-4 shadow-soft-sm flex flex-col justify-between hover:shadow-soft-md transition-shadow">
          <span className="text-[11px] font-geist font-bold text-brand-muted uppercase tracking-wider">Completion Rate</span>
          <div className="mt-2 space-y-1">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold font-geist text-brand-text">{completionRate}%</span>
              <span className="text-xs text-brand-muted">{completedTasks}/{totalTasks}</span>
            </div>
            <div className="w-full bg-brand-canvas h-1.5 rounded-full overflow-hidden border border-brand-border/50">
              <div 
                className="bg-brand-success h-full transition-all duration-500 ease-out" 
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white border border-brand-border rounded p-4 shadow-soft-sm flex flex-col justify-between hover:shadow-soft-md transition-shadow">
          <span className="text-[11px] font-geist font-bold text-brand-muted uppercase tracking-wider">Pending Objectives</span>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-2xl font-bold font-geist text-brand-text">{pendingTasks}</span>
            <span className="text-xs text-brand-muted">remaining</span>
          </div>
        </div>

        <div className="bg-white border border-brand-border rounded p-4 shadow-soft-sm flex flex-col justify-between hover:shadow-soft-md transition-shadow">
          <span className="text-[11px] font-geist font-bold text-brand-muted uppercase tracking-wider">High Priority Alert</span>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className={`text-2xl font-bold font-geist ${highPriorityTasks > 0 ? 'text-brand-error animate-pulse' : 'text-brand-text'}`}>{highPriorityTasks}</span>
            <span className="text-xs text-brand-muted">urgent</span>
          </div>
        </div>
      </div>

      {/* Search, Filter and Sort bar */}
      <div className="bg-white border border-brand-border rounded p-4 shadow-soft-sm space-y-4">
        {/* Search & Main Status Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-brand-muted" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full h-10 pl-9 pr-4 border border-brand-border rounded text-sm placeholder-gray-400 outline-none
                focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all
              "
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 top-3 text-brand-muted hover:text-brand-text text-sm"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Filters - All, Pending, Completed, High Priority */}
          <div className="flex flex-wrap items-center gap-1.5 border-b lg:border-b-0 border-brand-border pb-2 lg:pb-0">
            {['All', 'Pending', 'Completed', 'High Priority'].map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setStatusFilter(filter)}
                className={`
                  px-3 py-1.5 text-xs font-geist font-semibold rounded border transition-all duration-150
                  ${statusFilter === filter
                    ? 'bg-brand-primary text-white border-brand-primary shadow-soft-sm'
                    : 'bg-white text-brand-muted border-brand-border hover:bg-brand-canvas hover:text-brand-text'
                  }
                `}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Category, Priority, Sorting Options */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-brand-border border-dashed">
          <div className="flex flex-wrap items-center gap-4 text-xs font-geist font-semibold text-brand-muted">
            {/* Category Select */}
            <div className="flex items-center space-x-1.5">
              <Filter className="w-3.5 h-3.5 text-gray-400" />
              <span>Category:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="h-8 border border-brand-border rounded bg-white px-2 focus:ring-1 focus:ring-brand-primary outline-none"
              >
                <option value="All">All Categories</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Shopping">Shopping</option>
                <option value="Health">Health</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Priority Select */}
            {statusFilter !== 'High Priority' && (
              <div className="flex items-center space-x-1.5">
                <Filter className="w-3.5 h-3.5 text-gray-400" />
                <span>Priority:</span>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="h-8 border border-brand-border rounded bg-white px-2 focus:ring-1 focus:ring-brand-primary outline-none"
                >
                  <option value="All">All Priorities</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            )}
          </div>

          {/* Sort & Clear Filters */}
          <div className="flex items-center gap-3">
            <div className="flex items-center space-x-1.5 text-xs font-geist font-semibold text-brand-muted">
              <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
              <span>Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-8 border border-brand-border rounded bg-white px-2 focus:ring-1 focus:ring-brand-primary outline-none"
              >
                <option value="Newest">Newest First</option>
                <option value="Oldest">Oldest First</option>
                <option value="DueDate">Due Date</option>
                <option value="Priority">Priority</option>
              </select>
            </div>

            {/* Clear All Button */}
            {(search || statusFilter !== 'All' || categoryFilter !== 'All' || priorityFilter !== 'All' || sortBy !== 'Newest') && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="inline-flex items-center text-xs font-geist font-bold text-brand-error hover:underline"
              >
                <XCircle className="w-3.5 h-3.5 mr-1" />
                Reset Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Todos Display Area */}
      {loading ? (
        <LoadingSkeleton count={6} />
      ) : todos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
          {todos.map((todo) => (
            <TodoCard
              key={todo._id}
              todo={todo}
              onView={handleViewDetails}
              onEdit={openEditModal}
              onDelete={setDeleteTodoConfirm}
              onToggleComplete={handleToggleComplete}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          type={search.trim() || statusFilter !== 'All' || categoryFilter !== 'All' || priorityFilter !== 'All' ? 'no-results' : 'no-tasks'}
          onActionClick={
            search.trim() || statusFilter !== 'All' || categoryFilter !== 'All' || priorityFilter !== 'All' 
              ? clearAllFilters 
              : openCreateModal
          }
          actionText={
            search.trim() || statusFilter !== 'All' || categoryFilter !== 'All' || priorityFilter !== 'All' 
              ? 'Clear Search & Filters' 
              : 'Add Your First Task'
          }
        />
      )}

      {/* Add / Edit Task Modal Dialog */}
      <Modal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        title={editingTodo ? 'Edit Task Details' : 'Add New Task'}
        showActions={false}
        size="lg"
      >
        <form onSubmit={handleSubmit(onTaskSubmit)} className="space-y-4">
          {/* Title Input */}
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

          {/* Description Input */}
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

          {/* Category, Priority, Due Date Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category Select */}
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

            {/* Priority Select */}
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

            {/* Due Date */}
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

          {/* Status Select (Only visible in Edit Mode) */}
          {editingTodo && (
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
          )}

          {/* Footer Action buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-brand-border">
            <Button variant="secondary" onClick={() => setTaskModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingTodo ? 'Save Changes' : 'Create Task'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal Dialog */}
      <Modal
        isOpen={!!deleteTodoConfirm}
        onClose={() => setDeleteTodoConfirm(null)}
        title="Confirm Task Deletion"
        confirmText="Delete Task"
        confirmVariant="primary"
        confirmLoading={false}
        onConfirm={handleDeleteConfirm}
        size="md"
      >
        <div className="space-y-2">
          <p className="text-sm text-brand-text">
            Are you sure you want to delete <span className="font-semibold font-geist">"{deleteTodoConfirm?.title}"</span>?
          </p>
          <p className="text-xs text-brand-muted">
            This action is irreversible and will permanently remove this item from your workspace data.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default DashboardPage;
