import React from 'react';
import { Calendar, Eye, Edit2, Trash2, CheckCircle2 } from 'lucide-react';
import { formatDate, getPriorityStyles, getCategoryStyles } from '../utils/helpers';

const TodoCard = ({
  todo,
  onView,
  onEdit,
  onDelete,
  onToggleComplete,
  completeLoading = false
}) => {
  const isCompleted = todo.status === 'Completed';
  const priorityStyle = getPriorityStyles(todo.priority);
  const categoryStyle = getCategoryStyles(todo.category);

  return (
    <div className={`
      relative bg-white border border-brand-border rounded p-6 shadow-soft-sm
      hover:shadow-soft-md hover:border-gray-300 transition-all duration-200
      flex flex-col justify-between group overflow-hidden
      ${isCompleted ? 'opacity-70 bg-gray-50/50' : ''}
    `}>
      {/* Visual strip for high priority tasks */}
      {!isCompleted && todo.priority === 'High' && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-brand-error animate-pulse" />
      )}

      {/* Card Header (Category & Date) */}
      <div className="flex justify-between items-center mb-3">
        <span className={`text-[11px] font-geist font-bold tracking-wider uppercase border px-2 py-0.5 rounded-sm ${categoryStyle}`}>
          {todo.category}
        </span>
        <span className="text-[11px] text-brand-muted font-geist font-medium">
          Added: {formatDate(todo.createdAt)}
        </span>
      </div>

      {/* Task Content */}
      <div className="flex items-start space-x-3 mb-4">
        {/* Instant Toggle Checkbox */}
        <button
          type="button"
          onClick={() => onToggleComplete(todo)}
          disabled={completeLoading}
          className="mt-0.5 shrink-0 focus:outline-none focus:ring-2 focus:ring-brand-primary rounded-full"
        >
          <div className={`
            w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-150
            ${isCompleted 
              ? 'bg-brand-success border-brand-success text-white' 
              : 'border-brand-border bg-white text-transparent hover:border-brand-primary'
            }
          `}>
            <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
        </button>

        {/* Title and Description */}
        <div className="flex-1 min-w-0">
          <h4 className={`
            text-base font-bold font-geist text-brand-text truncate
            ${isCompleted ? 'line-through text-brand-muted font-normal' : ''}
          `}>
            {todo.title}
          </h4>
          <p className={`
            text-sm text-brand-muted mt-1 leading-relaxed line-clamp-2 break-words
            ${isCompleted ? 'line-through opacity-75' : ''}
          `}>
            {todo.description || 'No description provided.'}
          </p>
        </div>
      </div>

      {/* Card Footer (Metadata & Actions) */}
      <div className="pt-4 border-t border-brand-border border-dashed flex items-center justify-between mt-auto">
        {/* Due Date & Priority */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center text-brand-muted font-medium">
            <Calendar className="w-3.5 h-3.5 mr-1 text-gray-400" />
            <span className={todo.dueDate && new Date(todo.dueDate) < new Date() && !isCompleted ? 'text-brand-error font-semibold' : ''}>
              {todo.dueDate ? formatDate(todo.dueDate) : 'No due date'}
            </span>
          </div>

          <span className={`inline-flex items-center text-[10px] font-bold font-geist px-1.5 py-0.5 border rounded-sm ${priorityStyle.bg}`}>
            <span className={`w-1.5 h-1.5 rounded-full mr-1 ${priorityStyle.dot}`} />
            {todo.priority}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
          <button
            type="button"
            onClick={() => onView(todo._id)}
            title="View Details"
            className="p-1.5 text-brand-muted hover:text-brand-primary hover:bg-brand-canvas rounded transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          
          <button
            type="button"
            onClick={() => onEdit(todo)}
            title="Edit Task"
            className="p-1.5 text-brand-muted hover:text-brand-indigo hover:bg-brand-canvas rounded transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => onDelete(todo)}
            title="Delete Task"
            className="p-1.5 text-brand-muted hover:text-brand-error hover:bg-brand-error-bg rounded transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoCard;
