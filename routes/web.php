<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\BarcodeController;
use App\Http\Controllers\MinumanController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\RekomendasiController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
})->name('home');

Route::get('/table/{id}', [RekomendasiController::class,'customer']);
Route::post('/pesan', [OrderController::class, 'pesan']);

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('minuman', MinumanController::class);
    Route::resource('order', OrderController::class);
    Route::resource('barcode', BarcodeController::class);
    Route::get('rekomendasi', [RekomendasiController::class,'index']);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
