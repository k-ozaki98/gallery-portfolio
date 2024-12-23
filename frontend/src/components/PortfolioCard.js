import { Heart, MessageCircle } from "lucide-react";
import { useState } from "react";
import CommentModal from "./CommentModal";

export default function PortfolioCard({ portfolio, onLike, onComment, currentUserId }) {
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

  const handleLike = async () => {
    try {
      await onLike(portfolio.id);
    } catch (error) {
      console.error('お気に入りエラー', error);
    }
  };

  const getCommentsCount = () => {
    try {
      if (Array.isArray(portfolio.comments)) {
        return portfolio.comments.length;
      }
      return 0;
    } catch (error) {
      return 0;
    }
  };


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

  const isLikedByMe = Array.isArray(portfolio.likes) && portfolio.likes.some(like => like.user_id === currentUserId);

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };


  return (
    <div className="bg-white shadow-lg overflow-hidden">
      {/* 見出し */}
      <h3 className="text-base font-bold p-2 bg-gray-100">{portfolio.title}</h3>
      {/* プレビュー画像エリア */}
      <a
        href={portfolio.url}
        target="_blank"
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

      <div className="px-4 py-3 border-t flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLike}
            className="flex items-center space-x-1 text-gray-600 hover:text-red-500 transition-colors"
          >
            <Heart
              className={`w-5 h-5 ${
                isLikedByMe ? "fill-red-500 text-red-500" : ""  
              }`}
            />
            <span className="text-sm font-medium">{likesCount}</span>
          </button>
          <button
            onClick={() => setIsCommentModalOpen(true)} 
            className="flex items-center space-x-1 text-gray-600 hover:text-blue-500 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{getCommentsCount()}</span>
          </button>
        </div>
      </div>

      {/* コンテンツエリア */}
      <div className="">


        <p className="text-gray-600 p-4 text-ms bg-gray-50 h-32 overflow-hidden">
          {truncateText(portfolio.description || ogpData?.description || "説明なし", 100)}
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
      </div>

      

      {isCommentModalOpen && (
        <CommentModal
          portfolio={portfolio}
          onComment={onComment}
          onClose={() => setIsCommentModalOpen(false)}
        />
      )}
    </div>
  );
}