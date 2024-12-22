<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Portfolio;
use Illuminate\Http\Request;

class AdminPortfolioController extends Controller
{
    public function getPending()
    {
        return Portfolio::with('user')
            ->where('status', 'pending')
            ->latest()
            ->get();
    }

    public function approve($id)
    {
        $portfolio = Portfolio::findOrFail($id);
        $portfolio->update(['status' => 'approved']);

        return response()->json([
            'message' => 'ポートフォリオを承認しました。'
        ]);
    }

    public function reject(Request $request, $id)
    {
        $request->validate([
            'reason' => 'required|string'
        ]);

        $portfolio = Portfolio::findOrFail($id);
        $portfolio->update([
            'status' => 'rejected',
            'rejection_reason' => $request->reason
        ]);

        return response()->json([
            'message' => 'ポートフォリオを却下しました'
        ]);

    }
}