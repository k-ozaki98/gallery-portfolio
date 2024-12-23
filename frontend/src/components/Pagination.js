
export default function Pagination({ total, itemsPerPage, currentPage, onPageChange }) {
  const totalPages = Math.ceil(total / itemsPerPage);
 
  if (totalPages <= 1) return null;
 
  // ページ番号の配列を生成する関数
  const getPageNumbers = () => {
    // 表示するページ番号の最大数
    const MAX_VISIBLE = 7;
    const pages = [];
 
    if (totalPages <= MAX_VISIBLE) {
      // ページ数が少ない場合は全て表示
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // ページ数が多い場合は省略表示
      if (currentPage <= 3) {
        // 現在のページが前半の場合
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // 現在のページが後半の場合
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        // 現在のページが中間の場合
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };
 
  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-md bg-gray-900 text-gray-300 border border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
      >
        前へ
      </button>
      
      <div className="flex items-center space-x-1">
        {getPageNumbers().map((page, index) => (
          page === '...' ? (
            <span
              key={`ellipsis-${index}`}
              className="w-10 h-10 flex items-center justify-center text-gray-400"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-10 h-10 rounded-md transition-colors ${
                currentPage === page
                  ? "bg-blue-600 text-white border border-blue-500"
                  : "bg-gray-900 text-gray-300 border border-gray-700 hover:bg-gray-800"
              }`}
            >
              {page}
            </button>
          )
        ))}
      </div>
 
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-md bg-gray-900 text-gray-300 border border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
      >
        次へ
      </button>
    </div>
  );
 }