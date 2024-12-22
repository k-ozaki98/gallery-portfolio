<?php

namespace App\Http\Controllers;

use App\Models\Portfolio;
use Illuminate\Http\Request;
use GuzzleHttp\Client;

class PortfolioController extends Controller
{
    public function index()
    {
        try {
            // リクエストのデバッグ情報を出力
            \Log::info('Request headers:', [
                'Authorization' => request()->header('Authorization')
            ]);

            // ユーザー認証の確認
            $user = auth()->user();
            \Log::info('Authenticated user:', [
                'user' => $user ? $user->toArray() : 'Not authenticated'
            ]);

            $portfolios = Portfolio::with(['user', 'likes', 'comments'])
                ->where('status', 'approved')
                ->latest()
                ->get();
            return response()->json($portfolios);
        } catch (\Exception $e) {
            \Log::error('Error in portfolio index:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    private function isDomainDuplicate($url)
    {
        $parsedUrl = parse_url($url);
        $host = $parsedUrl['host'];
        
        // メインドメイン抽出
        $parts = explode('.', $host);
        $mainDomain = implode('.', array_slice($parts, -2));

        return Portfolio::where('status', '!=', 'rejected')
            ->where(function($query) use ($mainDomain) {
                $query->whereRaw('LOWER(url) LIKE ?', ['%' . strtolower($mainDomain) . '%']);
            })
            ->exists();
    }

    public function store(Request $request)
    {
        try {

            // バリデーション
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'url' => 'required|url',
                'industry' => 'required|string',
                'experience' => 'required|string',
                'color' => 'required|string',
                'description' => 'nullable|string'
            ]);

            // ユーザーの確認
            $user = $request->user();
            $ogpData = $this->fetchOgpData($validated['url']);
            $validated['ogp_data'] = $ogpData ? json_encode($ogpData) : null;
            $validated['status'] = 'pending';

            // ポートフォリオの作成
            $portfolio = $user->portfolios()->create($validated);

            return response()->json([
                'portfolio' => $portfolio,
                'message' => '投稿が完了しました。管理者の承認をお待ちください。'
            ], 201);
        } catch (\Exception $e) {
            \Log::error('Error creating portfolio:', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            return response()->json([
                'message' => 'Portfolio creation failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private function fetchOgpData($url)
    {
        try {
            $client = new Client();
            $response = $client->get($url);
            $html = (string) $response->getBody();

            libxml_use_internal_errors(true);
            $doc = new \DOMDocument();
            @$doc->loadHTML(mb_convert_encoding($html, 'HTML-ENTITIES', 'UTF-8'));

            $xpath = new \DOMXPath($doc);

            $ogpData = [
                'title' => $this->getMetaContent($xpath, 'og:title'),
                'description' => $this->getMetaContent($xpath, 'og:description'),
                'image' => $this->getMetaContent($xpath, 'og:image'),
                'site_name' => $this->getMetaContent($xpath, 'og:site_name'),
            ];

            // OGタグがない場合のフォールバック
            if (!$ogpData['title']) {
                $title = $xpath->query('//title')->item(0);
                $ogpData['title'] = $title ? trim($title->nodeValue) : null;
            }

            if (!$ogpData['description']) {
                $meta = $xpath->query("//meta[@name='description']")->item(0);
                $ogpData['description'] = $meta ? $meta->getAttribute('content') : null;
            }

            \Log::info('Fetched OGP data:', $ogpData);
            return $ogpData;

        } catch (\Exception $e) {
            \Log::error('Error fetching OGP:', [
                'url' => $url,
                'error' => $e->getMessage()
            ]);
            return null;
        }
    }

    private function getMetaContent($xpath, $property)
    {
        $meta = $xpath->query("//meta[@property='$property']")->item(0);
        return $meta ? $meta->getAttribute('content') : null;
    }

    public function show(Portfolio $portfolio)
    {
        return response()->json($portfolio->load(['user', 'likes', 'comments']));
    }
}