import React, { useState, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import './SearchBar.css';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Search...',
  debounceMs = 300,
}) => {
  const [query, setQuery] = useState('');
  const [debounceTimer, setDebounceTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = useCallback(
    (value: string) => {
      setQuery(value);

      // Clear existing timer
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      // Set new timer
      const timer = setTimeout(() => {
        onSearch(value);
      }, debounceMs);

      setDebounceTimer(timer);
    },
    [debounceTimer, debounceMs, onSearch]
  );

  const handleClear = () => {
    setQuery('');
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    onSearch('');
  };

  return (
    <div className="search-bar">
      <div className="search-input-wrapper">
        <Search className="search-icon" size={20} />
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          className="search-input"
        />
        {query && (
          <button
            className="search-clear-btn"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
