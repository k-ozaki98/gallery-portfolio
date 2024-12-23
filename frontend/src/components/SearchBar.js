export default function SearchBar({ value, onChange, onFilterChange, filters }) {  // filters を追加
  const industries = [
    "デザイナー",
    "フロントエンドエンジニア",
    "バックエンドエンジニア",
    "動画編集者 / モーションデザイナー",
    "フォトグラファー",
    "イラストレーター",
    "その他",
  ];

  const experienceOptions = ["1年未満", "1-3年", "3-5年", "5-10年", "10年以上"];

  const colors = [
    "白", "黒", "グレー", "赤", "オレンジ", "茶", "黄", "緑", "青", "紫", "ピンク", "カラフル",
  ];

  return (
    <>
      <div className="bg-white shadow-lg mb-4">
        <h2 className="text-lg font-semibold text-white py-2 px-4 bg-gray-800">検索</h2>
        <div className="space-y-3 py-4">
          <div className="px-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              キーワード検索
            </label>
            <input
              type="text"
              placeholder="タイトルや説明文で検索"
              value={filters.keyword}  // 値を filters から取得
              className="w-full p-2 border rounded bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => onFilterChange("keyword", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bg-white shadow-lg mb-4">
        <h2 className="text-lg font-semibold text-white py-2 px-4 bg-gray-800">色</h2>
        <div className="space-y-3 py-4">
          <div className="px-4">
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => onFilterChange("color", "")}
                className={`px-2 py-1 text-sm rounded-md hover:bg-gray-100 ${
                  filters.color === "" ? "bg-blue-50 text-blue-600" : "text-gray-700"
                }`}
              >
                すべて
              </button>
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => onFilterChange("color", color)}
                  className={`px-2 py-1 text-sm rounded-md hover:bg-gray-100 ${
                    filters.color === color ? "bg-blue-50 text-blue-600" : "text-gray-700"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-lg mb-4">
        <h2 className="text-lg font-semibold text-white py-2 px-4 bg-gray-800">職種</h2>
        <div className="space-y-3 py-4">
          <div className="px-4">
            <div className="space-y-1">
              <button
                onClick={() => onFilterChange("industry", "")}
                className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-100 ${
                  filters.industry === "" ? "bg-blue-50 text-blue-600" : "text-gray-700"
                }`}
              >
                すべて
              </button>
              {industries.map((industry) => (
                <button
                  key={industry}
                  onClick={() => onFilterChange("industry", industry)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-100 ${
                    filters.industry === industry ? "bg-blue-50 text-blue-600" : "text-gray-700"
                  }`}
                >
                  {industry}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-lg mb-4">
        <h2 className="text-lg font-semibold text-white py-2 px-4 bg-gray-800">経験年数</h2>
        <div className="space-y-3 py-4">
          <div className="px-4">
            <div className="space-y-1">
              <button
                onClick={() => onFilterChange("experience", "")}
                className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-100 ${
                  filters.experience === "" ? "bg-blue-50 text-blue-600" : "text-gray-700"
                }`}
              >
                すべて
              </button>
              {experienceOptions.map((exp) => (
                <button
                  key={exp}
                  onClick={() => onFilterChange("experience", exp)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-100 ${
                    filters.experience === exp ? "bg-blue-50 text-blue-600" : "text-gray-700"
                  }`}
                >
                  {exp}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}