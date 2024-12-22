<?php

use App\Http\Controllers\CommentController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\Admin\PortfolioController as AdminPortfolioController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/


use App\Http\Controllers\Auth\AuthController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('portfolios', PortfolioController::class);
    Route::post('portfolios/{portfolio}/like', [LikeController::class, 'toggle']);
    Route::post('portfolios/{portfolio}/comments', [CommentController::class, 'store']);

    Route::middleware('admin')->prefix('admin')->group(function () {
        Route::get('/portfolios/pending', [AdminPortfolioController::class, 'getPending']);
        Route::post('/portfolios/{id}/approve', [AdminPortfolioController::class, 'approve']);
        Route::post('/portfolios/{id}/reject', [AdminPortfolioController::class, 'reject']);
    });
});
