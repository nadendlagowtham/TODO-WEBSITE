import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  confirmText,
  onConfirm,
  confirmVariant = 'primary',
  confirmLoading = false,
  showActions = true,
  size = 'md'
}) => {
  // ESC key listener to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Disable page scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-[2px] transition-opacity duration-300 animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className={`
        relative bg-white w-full ${sizeClasses[size]} border border-brand-border rounded shadow-soft-xl
        p-6 overflow-hidden transform transition-all duration-300 animate-scaleIn z-10
      `}>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-brand-border">
          <h3 className="text-lg font-bold font-geist text-brand-text">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-brand-muted hover:text-brand-text transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 text-sm text-brand-muted leading-relaxed max-h-[70vh] overflow-y-auto">
          {children}
        </div>

        {/* Footer Actions */}
        {showActions && (
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-brand-border">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            {onConfirm && (
              <Button
                variant={confirmVariant}
                loading={confirmLoading}
                onClick={onConfirm}
              >
                {confirmText || 'Confirm'}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
