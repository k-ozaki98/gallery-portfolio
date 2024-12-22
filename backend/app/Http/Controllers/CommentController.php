<?php

namespace App\Http\Controllers;

use App\Models\Portfolio;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function store(Request $request, Portfolio $portfolio)
    {
        $validated = $request->validate([
            'content' => 'required|string'
        ]);

        $comment = $portfolio->comments()->create([
            'user_id' => auth()->id(),
            'content' => $validated['content']
        ]);

        return response()->json($comment->load('user'), 201);
    }
}