
import React, { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar.js";
import PortfolioCard from "../components/PortfolioCard.js";
import PortfolioForm from "../components/PortfolioForm.js";
import "../App.css";
import { useAuth } from "../contexts/AuthContext.js";
import Pagination from "../components/Pagination.js";

const ITEMS_PER_PAGE = 10;

function App() {
  const [portfolios, setPortfolios] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
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
    setCurrentPage(1);
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

    const paginatedPortfolios = filteredPortfolios.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (page) => {
      setCurrentPage(page);
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };

  return (
    <div className="min-h-screen bg-gray-200">
      {/* ヘッダー部分 */}
      <div className="bg-gray-100 mb-8">
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
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8 max-w-[1400px] mx-auto"> 
          {/* メインコンテンツエリア */}
          <div className="lg:w-[70%] mb-16">
            {/* ポートフォリオカード */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-8">
              {paginatedPortfolios.map((portfolio) => (
                <PortfolioCard
                  key={portfolio.id}
                  portfolio={portfolio}
                  onLike={handleLike}
                  onComment={handleComment}
                  currentUserId={user.id}
                />
              ))}
            </div>

            {/* ページネーション */}
            <Pagination
              total={filteredPortfolios.length}
              itemsPerPage={ITEMS_PER_PAGE}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>

          {/* 検索バー */}
          <div className="lg:w-[30%]">
            <div className="relative">
              <SearchBar
                value={filters.keyword}
                onChange={(value) => handleFilterChange("keyword", value)}
                onFilterChange={handleFilterChange}
                filters={filters}
              />
            </div>
          </div>
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
