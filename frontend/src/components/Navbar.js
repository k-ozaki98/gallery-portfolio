import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // ドロップダウン外のクリックを検知して閉じる
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 py-2">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex justify-between h-14">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-white">
              Portfolio Gallery
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link to="/" className="text-gray-300 hover:text-white text-sm">
                ギャラリー
              </Link>
              <a href="#" className="text-gray-300 hover:text-white text-sm">
                人気のサイト
              </a>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {user.is_admin && (
                  <Link 
                    to="/admin" 
                    className="text-sm text-gray-300 hover:text-white px-3 py-1.5 rounded-md hover:bg-gray-800"
                  >
                    管理画面
                  </Link>
                )}
                {/* 投稿ボタン */}
                <Link 
                  to="/new"
                  className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700"
                >
                  投稿する
                </Link>
                {/* ユーザードロップダウン */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 text-sm text-gray-300 hover:text-white px-3 py-1.5 rounded-md hover:bg-gray-800"
                  >
                    <span>{user.name}</span>
                    <svg 
                      className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* ドロップダウンメニュー */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 py-2 bg-gray-900 rounded-md shadow-xl border border-gray-800">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                      >
                        プロフィール
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                      >
                        設定
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                      >
                        ログアウト
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link 
                  to="/login" 
                  className="text-sm text-gray-300 hover:text-white px-3 py-1.5 rounded-md hover:bg-gray-800"
                >
                  ログイン
                </Link>
                <Link
                  to="/register"
                  className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700"
                >
                  新規登録
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}