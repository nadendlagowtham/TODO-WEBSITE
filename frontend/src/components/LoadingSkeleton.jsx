import React from 'react';

const LoadingSkeleton = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white border border-brand-border rounded p-6 shadow-soft-sm animate-pulse space-y-4"
        >
          {/* Tag & Date Row */}
          <div className="flex justify-between items-center">
            <div className="w-16 h-5 bg-gray-200 rounded"></div>
            <div className="w-24 h-4 bg-gray-100 rounded"></div>
          </div>

          {/* Title & Description */}
          <div className="space-y-2">
            <div className="w-3/4 h-6 bg-gray-200 rounded"></div>
            <div className="w-full h-4 bg-gray-100 rounded"></div>
            <div className="w-5/6 h-4 bg-gray-100 rounded"></div>
          </div>

          {/* Meta Details (Due Date, Priority) */}
          <div className="pt-2 flex items-center justify-between border-t border-brand-border border-dashed">
            <div className="w-24 h-4 bg-gray-100 rounded"></div>
            <div className="w-16 h-5 bg-gray-200 rounded-full"></div>
          </div>

          {/* Actions Row */}
          <div className="flex items-center justify-end space-x-2 pt-2">
            <div className="w-8 h-8 bg-gray-200 rounded"></div>
            <div className="w-8 h-8 bg-gray-200 rounded"></div>
            <div className="w-8 h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
