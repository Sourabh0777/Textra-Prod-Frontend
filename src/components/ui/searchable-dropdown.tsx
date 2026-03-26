import React, { useEffect, useRef, useState } from 'react';

interface Option {
  [key: string]: any;
}

interface SearchableDropdownProps {
  options: Option[];
  label: string;
  id: string;
  selectedVal: string | null;
  handleChange: (val: string | null) => void;
  fieldLabel?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  error?: string;
  fullWidth?: boolean;
  searchKey?: string;
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  options,
  label,
  id,
  selectedVal,
  handleChange,
  fieldLabel,
  placeholder = 'Select an option',
  searchPlaceholder = 'Search...',
  error,
  fullWidth = false,
  searchKey,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectOption = (option: Option) => {
    handleChange(option[id]);
    setQuery('');
    setIsOpen(false);
  };

  const getDisplayValue = () => {
    if (isOpen) return query;
    const selectedOption = options.find((opt) => opt[id] === selectedVal);
    return selectedOption ? selectedOption[label] : '';
  };

  const filteredOptions = options.filter((option) => {
    const searchValue = searchKey ? option[searchKey] || '' : option[label] || '';
    return searchValue.toString().toLowerCase().includes(query.toLowerCase());
  });

  return (
    <div ref={containerRef} className={`relative ${fullWidth ? 'w-full' : 'w-64'}`}>
      {fieldLabel && <label className="block text-sm font-semibold text-neutral-700 mb-1.5">{fieldLabel}</label>}

      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={getDisplayValue()}
          placeholder={selectedVal ? undefined : placeholder}
          className={`
            w-full px-3 py-2 border border-neutral-300 rounded
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            text-neutral-900 placeholder-neutral-400
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
            ${isOpen ? 'ring-2 ring-blue-500 border-transparent' : ''}
          `}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
        />

        <div
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-neutral-200 rounded shadow-lg max-h-60 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => {
              const isSelected = option[id] === selectedVal;
              return (
                <div
                  key={`${id}-${index}`}
                  onClick={() => selectOption(option)}
                  className={`
                    px-3 py-2 cursor-pointer text-sm
                    ${isSelected ? 'bg-blue-50 text-blue-700 font-medium' : 'text-neutral-700 hover:bg-neutral-50'}
                  `}
                >
                  {option[label]}
                </div>
              );
            })
          ) : (
            <div className="px-3 py-2 text-sm text-neutral-500 italic">No results found</div>
          )}
        </div>
      )}

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default SearchableDropdown;
