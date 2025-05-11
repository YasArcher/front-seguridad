import type { FC } from 'react';
import type { SearchBarProps } from './types/SearchBarProps';

const SearchBar: FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  placeholder = "Buscar...",
  icon,
}) => {
  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/10 text-white placeholder-gray-400 
        border border-gray-600 shadow-sm transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        {icon ?? (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        )}
      </div>
    </div>
  );
};

export default SearchBar;