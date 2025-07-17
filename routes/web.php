<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\BarcodeController;
use App\Http\Controllers\MinumanController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\RekomendasiController;
use App\Models\Minuman;
use App\Models\Order;
use Carbon\Carbon;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
})->name('home');

Route::get('/table/{id}', [RekomendasiController::class,'customer']);
Route::post('/pesan', [OrderController::class, 'pesan']);

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
    $ordersTodayCount = Order::whereDate('created_at', Carbon::today())->count();
    $totalOrdersCount = Order::count();
    $totalMinumanCount = Minuman::count();
    $weeklyOrdersData = [];
    for ($i = 6; $i >= 0; $i--) {
        $date = Carbon::today()->subDays($i);
        $orderCount = Order::whereDate('created_at', $date)->count();

        $weeklyOrdersData[] = [
            'date' => $date->translatedFormat('d M'), // Format: "17 Jul"
            'total' => $orderCount,
        ];
    }

    return Inertia::render('dashboard', [
        'ordersToday' => $ordersTodayCount,
        'totalOrders' => $totalOrdersCount,
        'totalMinuman' => $totalMinumanCount,

        'weeklyOrders' => $weeklyOrdersData,
    ]);
})->name('dashboard');

    Route::resource('minuman', MinumanController::class);
    Route::resource('order', OrderController::class);
    Route::resource('barcode', BarcodeController::class);
    Route::get('rekomendasi', [RekomendasiController::class,'index']);
    Route::put('/orders/{order}/selesaikan', [OrderController::class, 'selesaikan'])->name('orders.selesaikan');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
