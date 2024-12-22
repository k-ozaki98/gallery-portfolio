<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('portfolios', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->string('url');
            $table->string('industry');
            $table->string('experience');
            $table->string('color');
            $table->text('description')->nullable();
            $table->json('ogp_data')->nullable();
            $table->timestamps();
        });
    }
};
