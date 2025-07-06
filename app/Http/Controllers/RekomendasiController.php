<?php

namespace App\Http\Controllers;

use App\Models\Barcode;
use App\Models\Minuman;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RekomendasiController extends Controller
{
    public function index(Request $request)
    {
        $minuman = Minuman::get();

        return Inertia::render('rekomendasi/index', [
            'minuman' => $minuman,
        ]);
    }

    public function customer($id){
        $minuman = Minuman::get();
        $barcode = Barcode::firstOrNew();

        return Inertia::render('welcome', [
            'minuman' => $minuman,
            'no_meja' => $id,
            'barcode' => $barcode,
        ]);
    }
}
