import type React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export function Input({ label, error, fullWidth = false, className = '', ...props }: InputProps) {
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
      <input
        className={`
          w-full px-3 py-2 border border-neutral-300 rounded
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          disabled:bg-neutral-100 disabled:text-neutral-500 disabled:cursor-not-allowed
          text-neutral-900 placeholder-neutral-400
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
