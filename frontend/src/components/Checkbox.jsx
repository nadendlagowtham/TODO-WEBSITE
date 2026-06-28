import React, { forwardRef } from 'react';
import { Check } from 'lucide-react';

const Checkbox = forwardRef(({
  label,
  id,
  checked,
  onChange,
  className = '',
  ...props
}, ref) => {
  return (
    <label htmlFor={id} className={`flex items-center space-x-3 cursor-pointer select-none ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          id={id}
          ref={ref}
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
          {...props}
        />
        {/* Custom checkbox box */}
        <div className="
          w-[18px] h-[18px] rounded-[4px] border border-brand-border bg-white flex items-center justify-center
          peer-focus:ring-2 peer-focus:ring-brand-primary peer-focus:ring-offset-2
          peer-checked:bg-brand-primary peer-checked:border-brand-primary
          peer-hover:border-gray-400 peer-checked:peer-hover:bg-brand-indigo
          peer-checked:[&_svg]:opacity-100 peer-checked:[&_svg]:scale-100
          transition-all duration-150
        ">
          <Check className="
            w-3.5 h-3.5 text-white stroke-[3.5] opacity-0 scale-50 
            transition-all duration-150
          " />
        </div>
      </div>
      {label && (
        <span className="text-sm font-medium text-brand-muted hover:text-brand-text transition-colors">
          {label}
        </span>
      )}
    </label>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;
