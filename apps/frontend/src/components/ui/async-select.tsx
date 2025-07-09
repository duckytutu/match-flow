import React, { useState, useCallback } from 'react';
import AsyncSelect from 'react-select/async';
import { cn } from '@/lib/utils';

interface Option {
  value: string;
  label: string;
  id: number;
}

interface AsyncSelectProps {
  label?: string;
  placeholder?: string;
  value?: Option | null;
  onChange: (option: Option | null) => void;
  loadOptions: (inputValue: string) => Promise<Option[]>;
  isDisabled?: boolean;
  isClearable?: boolean;
  isSearchable?: boolean;
  className?: string;
  noOptionsMessage?: (obj: { inputValue: string }) => string;
  loadingMessage?: () => string;
  cacheOptions?: boolean;
  defaultOptions?: boolean;

}

export function AsyncSelectComponent({
  label,
  placeholder = 'Chọn...',
  value,
  onChange,
  loadOptions,
  isDisabled = false,
  isClearable = true,
  isSearchable = true,
  className,
  noOptionsMessage = () => 'Không tìm thấy kết quả',
  loadingMessage = () => 'Đang tìm kiếm...',
  cacheOptions = true,
  defaultOptions = false,

}: AsyncSelectProps) {
  const [isLoading, setIsLoading] = useState(false);

  const loadOptionsCallback = useCallback(
    async (inputValue: string) => {
      if (inputValue.length < 2) {
        return [];
      }

      setIsLoading(true);
      try {
        const options = await loadOptions(inputValue);
        return options;
              } catch {
          return [];
      } finally {
        setIsLoading(false);
      }
    },
    [loadOptions]
  );

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <AsyncSelect
        value={value}
        onChange={onChange}
        loadOptions={loadOptionsCallback}
        placeholder={placeholder}
        isLoading={isLoading}
        isDisabled={isDisabled}
        isClearable={isClearable}
        isSearchable={isSearchable}
        noOptionsMessage={noOptionsMessage}
        loadingMessage={loadingMessage}
        cacheOptions={cacheOptions}
        defaultOptions={defaultOptions}
        className="react-select-container"
        classNamePrefix="react-select"
        styles={{
          control: (provided, state) => ({
            ...provided,
            minHeight: '40px',
            borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
            boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
            '&:hover': {
              borderColor: '#3b82f6'
            }
          }),
          option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected 
              ? '#3b82f6' 
              : state.isFocused 
                ? '#f3f4f6' 
                : 'white',
            color: state.isSelected ? 'white' : '#374151',
            '&:hover': {
              backgroundColor: state.isSelected ? '#3b82f6' : '#f3f4f6'
            }
          }),
          menu: (provided) => ({
            ...provided,
            zIndex: 9999
          })
        }}
      />
    </div>
  );
} 