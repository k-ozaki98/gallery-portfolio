import { useState } from "react";

export default function CommentModal({ portfolio, onComment, onClose }) {
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onComment(portfolio.id, comment);
      setComment('');
    } catch (error) {
      console.error('コメントエラー:', error);
    }
  };

  const getComments = () => {
    try {
      if (Array.isArray(portfolio.comments)) {
        return portfolio.comments;
      }
      return JSON.parse(portfolio.comments || '[]');
    } catch (error) {
      console.error('コメント取得エラー', error);
      return [];
    }
  };

  const comments = getComments();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg mx-4 max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">コメント</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[calc(80vh-200px)]">
          {/* コメント一覧 */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-gray-500 text-center">コメントはまだありません</p>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-gray-50 p-4 rounded-lg"
                >
                  <p className="text-sm mb-2">{comment.content}</p>
                  <div className="text-xs text-gray-500">
                    {new Date(comment.created_at).toLocaleString("ja-JP", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* コメント投稿フォーム */}
        <div className="p-4 border-t bg-gray-50">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="コメントを入力..."
              className="flex-1 p-2 border rounded"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              送信
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}