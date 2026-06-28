
/**
 * Format a database date string to a human-readable format.
 * Example: '2026-06-29T00:00:00.000Z' -> 'Jun 29, 2026'
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'No due date';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

/**
 * Format date to local HTML input format YYYY-MM-DD
 */
export const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
};

/**
 * Priority color classes helper
 */
export const getPriorityStyles = (priority) => {
  switch (priority) {
    case 'High':
      return {
        bg: 'bg-brand-error-bg text-brand-error-text border-brand-error/20',
        text: 'text-brand-error',
        dot: 'bg-brand-error'
      };
    case 'Medium':
      return {
        bg: 'bg-brand-warning-bg text-brand-warning-text border-brand-warning/20',
        text: 'text-brand-warning',
        dot: 'bg-brand-warning'
      };
    case 'Low':
    default:
      return {
        bg: 'bg-brand-success-bg text-brand-success-text border-brand-success/20',
        text: 'text-brand-success',
        dot: 'bg-brand-success'
      };
  }
};

/**
 * Status color classes helper
 */
export const getStatusStyles = (status) => {
  if (status === 'Completed') {
    return 'bg-brand-success-bg text-brand-success-text border-brand-success/20';
  }
  return 'bg-brand-canvas text-brand-muted border-brand-border';
};

/**
 * Category color classes helper
 */
export const getCategoryStyles = (category) => {
  const categories = {
    Work: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    Personal: 'bg-purple-50 text-purple-700 border-purple-200',
    Shopping: 'bg-pink-50 text-pink-700 border-pink-200',
    Health: 'bg-teal-50 text-teal-700 border-teal-200',
    Other: 'bg-gray-100 text-gray-700 border-gray-200'
  };
  return categories[category] || categories.Other;
};
