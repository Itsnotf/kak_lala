<?php

namespace App\Http\Controllers;

use App\Models\Barcode;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BarcodeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
{
    $barcode = Barcode::firstOrNew();
    return Inertia::render('barcode/index', [
        'barcode' => $barcode,
        'image_url' => $barcode->image ? Storage::url($barcode->image) : null,
    ]);
}

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'image' => 'required|image|mimes:png,jpg,jpeg|max:2048',
        ]);

        $barcode = Barcode::updateOrCreate(
            ['id' => 1],
            [
                'nama' => $request->nama,
                'image' => $request->file('image')->store('barcodes', 'public'),
            ]
        );

        return back()->with('success', 'Barcode updated successfully');
    }
    /**
     * Display the specified resource.
     */
    public function show(Barcode $barcode)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Barcode $barcode)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Barcode $barcode)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Barcode $barcode)
    {
        //
    }
}
