import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = forwardRef(({
  label,
  type = 'text',
  name,
  error,
  placeholder,
  className = '',
  required = false,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`flex flex-col space-y-1.5 w-full ${className}`}>
      {label && (
        <label className="font-geist text-xs font-semibold text-brand-muted uppercase tracking-wider select-none">
          {label} {required && <span className="text-brand-error">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type={inputType}
          name={name}
          ref={ref}
          placeholder={placeholder}
          className={`
            w-full h-10 px-3 border rounded text-sm placeholder-gray-400 outline-none
            focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all
            ${error ? 'border-brand-error focus:ring-brand-error' : 'border-brand-border focus:ring-brand-primary'}
            ${isPassword ? 'pr-10' : ''}
          `}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-brand-muted hover:text-brand-text focus:outline-none"
            tabIndex="-1"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
      {error && (
        <span className="text-xs text-brand-error font-medium transition-all animate-fadeIn">
          {error.message || 'This field is required'}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
