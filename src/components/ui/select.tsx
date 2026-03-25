import type React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  options: Array<{ value: string; label: string }>;
}

export function Select({ label, error, fullWidth = false, options, className = '', ...props }: SelectProps) {
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
          {label}
          {props.required && (
            <span className="text-red-500 ml-1" title="Required">
              *
            </span>
          )}
        </label>
      )}
      <select
        className={`
          w-full px-3 py-2 border border-neutral-300 rounded
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          disabled:bg-neutral-100 disabled:text-neutral-500 disabled:cursor-not-allowed
          text-neutral-900
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
        {...props}
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
