import React from 'react';

export const AuthField = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  autoComplete,
  placeholder,
}) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="block text-[10px] font-mono uppercase tracking-widest text-muted">
      {label}
    </label>
    <input
      id={id}
      name={id}
      type={type}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
      placeholder={placeholder}
      className={`w-full input-field rounded-xl px-4 py-3 text-sm font-sans transition-all ${
        error ? 'border-red-500/50' : ''
      }`}
      aria-invalid={!!error}
      aria-describedby={error ? `${id}-error` : undefined}
    />
    {error && (
      <p id={`${id}-error`} className="text-[11px] text-red-400/90 font-sans" role="alert">
        {error}
      </p>
    )}
  </div>
);
