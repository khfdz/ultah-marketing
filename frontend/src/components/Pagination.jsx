import React from "react";

const Pagination = ({ page, totalPages, onPageChange }) => {
  const pagesToShow = [];

  for (let i = page - 1; i <= page + 1; i++) {
    if (i >= 1 && i <= totalPages) {
      pagesToShow.push(i);
    }
  }

  const baseButton =
    "px-3 py-1 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400";

  const renderPage = (p) => (
    <button
      key={p}
      onClick={() => onPageChange(p)}
      className={`${baseButton} ${
        p === page
          ? "bg-blue-500 text-white shadow"
          : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
      }`}
    >
      {p}
    </button>
  );

  return (
    <div className="mt-4 flex flex-wrap gap-2 items-center justify-center">
      <button
        disabled={page === 1}
        onClick={() => onPageChange(1)}
        className={`${baseButton} bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-600 disabled:opacity-50`}
      >
        First
      </button>

      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className={`${baseButton} bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-600 disabled:opacity-50`}
      >
        Prev
      </button>

      {pagesToShow.map(renderPage)}

      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className={`${baseButton} bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-600 disabled:opacity-50`}
      >
        Next
      </button>

      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(totalPages)}
        className={`${baseButton} bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-600 disabled:opacity-50`}
      >
        Last
      </button>
    </div>
  );
};

export default Pagination;
