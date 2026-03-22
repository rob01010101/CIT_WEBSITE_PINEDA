import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Pagination.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    // Always show first page
    pages.push(1);

    // Calculate range around current page
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    // Add ellipsis if needed
    if (start > 2) {
      pages.push('...');
    }

    // Add page range
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Add ellipsis if needed
    if (end < totalPages - 1) {
      pages.push('...');
    }

    // Always show last page if more than 1 page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="pagination">
      <button
        className="pagination-btn prev"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        <ChevronLeft size={18} />
        Previous
      </button>

      <div className="pagination-numbers">
        {getPageNumbers().map((page, index) =>
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="pagination-ellipsis">
              ...
            </span>
          ) : (
            <button
              key={page}
              className={`pagination-number ${page === currentPage ? 'active' : ''}`}
              onClick={() => onPageChange(page as number)}
            >
              {page}
            </button>
          )
        )}
      </div>

      <button
        className="pagination-btn next"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        Next
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default Pagination;
