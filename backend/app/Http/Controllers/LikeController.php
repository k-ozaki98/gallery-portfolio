<?php

namespace App\Http\Controllers;

use App\Models\Portfolio;
use Illuminate\Http\Request;

class LikeController extends Controller
{
    public function toggle(Portfolio $portfolio)
    {
        $user = auth()->user();

        if ($portfolio->likes()->where('user_id', $user->id)->exists()) {
            $portfolio->likes()->where('user_id', $user->id)->delete();
            return response()->json(['liked' => false]);
        }

        $portfolio->likes()->create(['user_id' => $user->id]);
        return response()->json(['liked' => true]);
    }
}