import { Heart, MessageCircle } from "lucide-react";
import { useState } from "react";

// src/components/PortfolioCard.js
export default function PortfolioCard({ portfolio, onLike, onComment }) {
  const [isCommenting, setIsCommenting] = useState(false);
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(false);

  const handleLike = async () => {
    try {
      await onLike(portfolio.id);
    } catch (error) {
      console.error('お気に入りエラー', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    console.log('コメント', onComment)
    try {
      if (typeof onComment === "function") {
        await onComment(portfolio.id, comment);
        setComment("");
        setIsCommenting(false);
      } else {
        console.error("onComment is not a function!");
      }
    } catch (error) {
      console.log('コメントエラー', error);
    }
  }

  // ogp_dataの安全な解析
  const getOgpData = () => {
    try {
      // すでにオブジェクトの場合はそのまま返す
      if (typeof portfolio.ogp_data === 'object' && portfolio.ogp_data !== null) {
        return portfolio.ogp_data;
      }
      // 文字列の場合はパースする
      return JSON.parse(portfolio.ogp_data || '{}');
    } catch (error) {
      console.error('Error parsing OGP data:', error);
      return {};
    }
  };

  const ogpData = getOgpData();

  // コメントを取得する関数
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

  const getLikesCount = () => {
    if (Array.isArray(portfolio.likes)) {
      console.log(portfolio.likes);
      return portfolio.likes.length;
    }
    return 0;
  };

  const likesCount = getLikesCount();


  return (
    <div className="bg-white shadow-lg overflow-hidden">
      {/* 見出し */}
      <h3 className="text-base font-bold p-2 bg-gray-100">{portfolio.title}</h3>
      {/* プレビュー画像エリア */}
      <a
        href={portfolio.url}
        className="w-full h-48 overflow-hidden block hover:opacity-80 transition-opacity"
      >
        {ogpData?.image ? (
          <img
            src={ogpData.image}
            alt={portfolio.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No preview available</span>
          </div>
        )}
      </a>

      {/* コンテンツエリア */}
      <div className="">


        <p className="text-gray-600 p-4 text-ms bg-gray-50">
          {portfolio.description || ogpData?.description || "説明なし"}
        </p>

        <div className="flex flex-col border-t">
          <div className="bg-gray-100 py-2 px-4 rounded">
            <p className="font-medium text-sm"><span className="text-gray-500">業界:</span>{portfolio.industry}</p>
          </div>
          <div className="bg-gray-100 p-2 px-4 rounded border-t">
            <p className="font-medium text-sm"><span className="text-gray-500">経験年数:</span>{portfolio.experience}</p>
            
          </div>
          <div className="bg-gray-100 p-2 px-4 rounded border-t">
            <p className="font-medium text-sm"><span className="text-xs text-gray-500">メインカラー:</span>{portfolio.color}</p>
            
          </div>
        </div>

        <div className="flex justify-between items-center border-t py-2 px-4">
          <span className="text-sm text-gray-500">
            {new Date(portfolio.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="px-4 py-3 border-t flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLike}
            className="flex items-center space-x-1 text-gray-600 hover:text-red-500 transition-colors"
          >
            <Heart
              className={`w-5 h-5 ${
                likesCount > 0 ? "fill-red-500 text-red-500" : ""
              }`}
            />
            <span className="text-sm font-medium">{likesCount}</span>
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-1 text-gray-600 hover:text-blue-500 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{comments.length}</span>
          </button>
        </div>
      </div>

      {showComments && (
        <div className="px-4 py-3 border-t bg-gray-50">
          {/* コメント投稿フォーム */}
          <form onSubmit={handleCommentSubmit} className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="コメントを入力..."
                className="flex-1 p-2 border rounded bg-white"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                投稿
              </button>
            </div>
          </form>

          {/* コメント一覧 */}
          <div className="space-y-3">
            {comments.length === 0 ? (
              <p className="text-gray-500 text-sm text-center">
                コメントはまだありません
              </p>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-white p-3 rounded shadow-sm"
                >
                  <p className="text-sm mb-1">{comment.content}</p>
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
      )}
    </div>
  );
}