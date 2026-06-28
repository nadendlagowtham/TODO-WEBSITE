import React from 'react';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  className = '',
  disabled = false,
  loading = false,
  onClick,
  icon: Icon,
  fullWidth = false,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-geist font-medium rounded text-sm px-4 py-2 select-none outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 transition-all duration-200 active:scale-[0.98]';
  
  const variants = {
    primary: 'bg-brand-primary text-white hover:bg-brand-indigo disabled:bg-opacity-50 disabled:pointer-events-none border border-transparent shadow-soft-sm',
    secondary: 'bg-white text-brand-text border border-brand-border hover:bg-brand-canvas hover:border-gray-300 disabled:opacity-50 disabled:pointer-events-none shadow-soft-sm',
    ghost: 'text-brand-muted hover:bg-brand-canvas hover:text-brand-text disabled:opacity-50 disabled:pointer-events-none'
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${widthStyle} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : Icon ? (
        <Icon className="w-4 h-4 mr-2" />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
