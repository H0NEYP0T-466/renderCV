import { type ChangeEvent } from 'react';
import './Field.css';

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  textarea?: boolean;
  rows?: number;
}

export function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  textarea = false,
  rows = 3,
}: FieldProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="field">
      <label className="field__label">{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          rows={rows}
          className="field__input field__input--textarea"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="field__input"
        />
      )}
    </div>
  );
}
