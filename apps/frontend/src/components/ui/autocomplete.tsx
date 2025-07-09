import { useState, useEffect, useRef } from 'react';
import { Input } from './input';
import { cn } from '@/lib/utils';

interface AutocompleteOption {
  id: number;
  label: string;
  value: string;
}

interface AutocompleteProps {
  label: string;
  placeholder: string;
  onChange: (value: string) => void;
  onSelect: (option: AutocompleteOption) => void;
  searchFunction: (query: string) => Promise<AutocompleteOption[]>;
  debounceMs?: number;
  disabled?: boolean;
}

export function Autocomplete({
  label,
  placeholder,
  onChange,
  onSelect,
  searchFunction,
  debounceMs = 2000,
  disabled = false
}: AutocompleteProps) {
  const [options, setOptions] = useState<AutocompleteOption[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSelected, setHasSelected] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  const [inputValue, setInputValue] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle escape key to close dropdown
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Don't search if user has selected a value and is not actively typing
    if (hasSelected) {
      return;
    }

    // Only search if query is at least 2 characters
    if (searchQuery.trim().length < 2) {
      setOptions([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    timeoutRef.current = setTimeout(async () => {
      try {
        const results = await searchFunction(searchQuery);
        setOptions(results);
        // Only open dropdown if we have results
        if (results.length > 0) {
          setIsOpen(true);
        } else {
          setIsOpen(false);
        }
              } catch {
          setOptions([]);
          setIsOpen(false);
      } finally {
        setIsLoading(false);
      }
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchQuery, searchFunction, debounceMs, hasSelected]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // If user has selected a value and starts typing something different, clear the selection
    if (hasSelected && newValue !== selectedValue) {
      setHasSelected(false);
      setSelectedValue('');
      setOptions([]); // Clear previous options
      
      // Clear the input and start fresh with the new value
      setInputValue(newValue);
      setSearchQuery(newValue);
      onChange(newValue);
      
      // Only search if new query is at least 2 characters
      if (newValue.trim().length < 2) {
        setIsOpen(false);
        setOptions([]);
      }
      return;
    }
    
    // If user clears the input completely, reset selection
    if (newValue.trim() === '') {
      setHasSelected(false);
      setSelectedValue('');
      setInputValue('');
      setOptions([]);
      setIsOpen(false);
    }
    
    setInputValue(newValue);
    setSearchQuery(newValue);
    onChange(newValue);
    
    // Only search if query is at least 2 characters
    if (newValue.trim().length < 2) {
      setIsOpen(false);
      setOptions([]);
    }
  };

  const handleOptionClick = (option: AutocompleteOption) => {
    setSearchQuery(option.label);
    setSelectedValue(option.label);
    setInputValue(option.label);
    onChange(option.label);
    onSelect(option);
    setIsOpen(false);
    setOptions([]); // Clear options to prevent dropdown from showing again
    setHasSelected(true); // Mark as selected to prevent dropdown from showing again
  };

  const handleInputFocus = () => {
    // Only show dropdown if we have search results and haven't selected yet
    if (searchQuery.trim().length >= 2 && options.length > 0 && !hasSelected) {
      setIsOpen(true);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <Input
        type="text"
        label={label}
        placeholder={placeholder}
        value={hasSelected ? selectedValue : inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        disabled={disabled}

      />
      
      {isLoading && isOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-10 p-3">
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
            Đang tìm kiếm...
          </div>
        </div>
      )}

      {isOpen && options.length > 0 && !isLoading && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <div
              key={option.id}
              className={cn(
                "px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm transition-colors",
                "focus:bg-gray-100 focus:outline-none"
              )}
              onClick={() => handleOptionClick(option)}
              onMouseDown={(e) => e.preventDefault()} // Prevent input blur
            >
              {option.label}
            </div>
          ))}
        </div>
      )}

      {isOpen && options.length === 0 && searchQuery.trim().length >= 2 && !isLoading && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-10 p-3">
          <div className="text-sm text-gray-500">Không tìm thấy kết quả</div>
        </div>
      )}
    </div>
  );
} 