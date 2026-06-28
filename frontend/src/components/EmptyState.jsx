import React from 'react';
import { ClipboardList, SearchCode } from 'lucide-react';
import Button from './Button';

const EmptyState = ({
  type = 'no-tasks', // 'no-tasks' or 'no-results'
  onActionClick,
  actionText = 'Create a Task'
}) => {
  const configs = {
    'no-tasks': {
      icon: ClipboardList,
      title: 'No tasks scheduled yet',
      description: 'Your workspace is clear. Embrace the cognitive calm, or click below to schedule your first objective.'
    },
    'no-results': {
      icon: SearchCode,
      title: 'No matches found',
      description: "We couldn't find any tasks matching your current search query or active filter settings. Try refining your keywords."
    }
  };

  const current = configs[type] || configs['no-tasks'];
  const Icon = current.icon;

  return (
    <div className="bg-white border border-brand-border rounded-lg p-10 shadow-soft-sm flex flex-col items-center justify-center text-center max-w-lg mx-auto my-12 animate-fadeIn">
      {/* Icon Container */}
      <div className="w-16 h-16 rounded-full bg-brand-bg flex items-center justify-center text-brand-primary mb-6">
        <Icon className="w-8 h-8 stroke-[1.5]" />
      </div>

      {/* Texts */}
      <h3 className="text-xl font-bold font-geist text-brand-text mb-2">
        {current.title}
      </h3>
      <p className="text-sm text-brand-muted max-w-sm mb-8 leading-relaxed">
        {current.description}
      </p>

      {/* Action Button */}
      {onActionClick && (
        <Button variant="primary" onClick={onActionClick}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
