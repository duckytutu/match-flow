import React from 'react';
import Select from 'react-select';
import { cn } from '@/lib/utils';

interface Option {
  value: string;
  label: string;
  id?: number;
}

interface ReactSelectProps {
  label?: string;
  placeholder?: string;
  value?: Option | null;
  onChange: (option: Option | null) => void;
  options: Option[];
  isLoading?: boolean;
  isDisabled?: boolean;
  isClearable?: boolean;
  isSearchable?: boolean;
  className?: string;
  noOptionsMessage?: (obj: { inputValue: string }) => string;
  loadingMessage?: () => string;
}

export function ReactSelect({
  label,
  placeholder = 'Chọn...',
  value,
  onChange,
  options,
  isLoading = false,
  isDisabled = false,
  isClearable = true,
  isSearchable = true,
  className,
  noOptionsMessage = () => 'Không tìm thấy kết quả',
  loadingMessage = () => 'Đang tìm kiếm...'
}: ReactSelectProps) {
  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <Select
        value={value}
        onChange={onChange}
        options={options}
        placeholder={placeholder}
        isLoading={isLoading}
        isDisabled={isDisabled}
        isClearable={isClearable}
        isSearchable={isSearchable}
        noOptionsMessage={noOptionsMessage}
        loadingMessage={loadingMessage}
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