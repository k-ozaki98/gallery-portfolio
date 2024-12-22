
import React, { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar.js";
import PortfolioCard from "../components/PortfolioCard.js";
import PortfolioForm from "../components/PortfolioForm.js";
import "../App.css";
import { useAuth } from "../contexts/AuthContext.js";

function App() {
  const [portfolios, setPortfolios] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    keyword: "",
    industry: "",
    experience: "",
    color: "",
  });

  const { user } = useAuth();

  // いいね機能ハンドラー
  const handleLike = async (portfolioId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/portfolios/${portfolioId}/like`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        fetchPortfolios();
      }
    } catch (error) {
      console.error("いいねエラー", error);
    }
  };

  // コメント機能ハンドラー
  const handleComment = async (portfolioId, content) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/portfolios/${portfolioId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ content }),
        }
      );

      if (response.ok) {
        fetchPortfolios();
      }
    } catch (error) {
      console.error("コメントエラー", error);
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/portfolios", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      console.log('サイトデータ', data);
      setPortfolios(data || []);
    } catch (error) {
      console.error("Error fetching portfolios:", error);
      setPortfolios([]);
    }
  };

  const handleSubmit = async (portfolioData) => {
    try {
      const response = await fetch("http://localhost:8000/api/portfolios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(portfolioData),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        setIsModalOpen(false);
        fetchPortfolios();
      } else {
        const error = await response.json();
        console.error("Server Error:", data.error);
      }
    } catch (error) {
      console.error("Error creating portfolio:", error);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const filteredPortfolios = Array.isArray(portfolios)
    ? portfolios.filter((portfolio) => {
        // キーワード検索
        const matchesKeyword =
          filters.keyword === "" ||
          portfolio.title
            .toLowerCase()
            .includes(filters.keyword.toLowerCase()) ||
          portfolio.description
            .toLowerCase()
            .includes(filters.keyword.toLowerCase());

        // 業界フィルター
        const matchesIndustry =
          filters.industry === "" || portfolio.industry === filters.industry;

        // 経験年数フィルター
        const matchesExperience =
          filters.experience === "" ||
          portfolio.experience === filters.experience;

        // カラーフィルター
        const matchesColor =
          filters.color === "" || portfolio.color === filters.color;

        return (
          matchesKeyword && matchesIndustry && matchesExperience && matchesColor
        );
      })
    : [];

  return (
    <div className="min-h-screen bg-gray-200">
      {/* ヘッダー部分 */}
      <div className="bg-gray-100">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">ポートフォリオサイトギャラリー</h1>
          <p className="text-sm">
            ポートフォリオサイトを集めているWebデザインギャラリーです。<br />
            デザイナーやイラストレーターなどのポートフォリオサイトから、魅力的なコンテンツと美しいレイアウトで情報を伝えている、<br />
            Webデザインや構成の参考にしたいポートフォリオサイトをまとめています。
          </p>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="container mx-auto px-4 py-8 flex">
        {/* メインコンテンツエリア */}
        <div className="flex-grow ml-auto max-w-5xl">
          <div className="flex justify-end mb-8">
          <button
            onClick={() => setIsModalOpen(true)}
            className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-500 to-indigo-600 text-white w-14 h-14 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-200 z-50"
            aria-label="新規投稿"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-8 w-8" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 4v16m8-8H4" 
              />
            </svg>
          </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPortfolios.map((portfolio) => (
              <PortfolioCard
                key={portfolio.id}
                portfolio={portfolio}
                onLike={handleLike}
                onComment={handleComment}
              />
            ))}
          </div>
        </div>

        {/* 右側の検索バー（固定） */}
        <div className="w-80 ml-8 sticky top-4 self-start">
          <SearchBar
            value={filters.keyword}
            onChange={(value) => handleFilterChange("keyword", value)}
            onFilterChange={handleFilterChange}
          />
        </div>
      </div>

      {/* モーダル */}
      {isModalOpen && (
        <PortfolioForm
          onSubmit={handleSubmit}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
