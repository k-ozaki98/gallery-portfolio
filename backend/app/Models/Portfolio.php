<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Portfolio extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'url',
        'industry',
        'experience',
        'color',
        'description',
        'ogp_data',
        'status',
        'rejection_reason'
    ];

    protected $casts = [
        'ogp_data' => 'array'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function likes()
    {
        return $this->hasMany(Like::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
}
