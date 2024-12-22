// src/components/AdminDashboard.js
import React, { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [pendingPortfolios, setPendingPortfolios] = useState([]);

  // 承認待ちの投稿を取得
  const fetchPendingPortfolios = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/admin/portfolios/pending', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setPendingPortfolios(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // 承認処理
  const handleApprove = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/admin/portfolios/${id}/approve`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        fetchPendingPortfolios(); // 一覧を更新
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // 却下処理
  const handleReject = async (id) => {
    const reason = prompt('却下理由を入力してください：');
    if (!reason) return;

    try {
      const response = await fetch(`http://localhost:8000/api/admin/portfolios/${id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ reason })
      });
      
      if (response.ok) {
        fetchPendingPortfolios(); // 一覧を更新
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchPendingPortfolios();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">承認待ちポートフォリオ</h1>
      <div className="grid gap-6">
        {pendingPortfolios.map(portfolio => (
          <div key={portfolio.id} className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold">{portfolio.title}</h2>
            <p className="text-gray-600 mt-2">{portfolio.description}</p>
            <div className="mt-2">
              <p>業界: {portfolio.industry}</p>
              <p>経験年数: {portfolio.experience}</p>
              <a 
                href={portfolio.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                サイトを確認
              </a>
            </div>
            <div className="mt-4 flex gap-4">
              <button
                onClick={() => handleApprove(portfolio.id)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                承認
              </button>
              <button
                onClick={() => handleReject(portfolio.id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                却下
              </button>
            </div>
          </div>
        ))}
        {pendingPortfolios.length === 0 && (
          <p className="text-gray-500 text-center">承認待ちのポートフォリオはありません</p>
        )}
      </div>
    </div>
  );
}