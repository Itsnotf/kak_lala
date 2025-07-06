<?php

namespace App\Http\Controllers;

use App\Models\Minuman;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class MinumanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('minuman/index', [
            'minuman' => Minuman::all(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('minuman/create', []);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'minuman_name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'emotional' => 'required|string|max:255',
            'gambar' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $data = $request->only(['minuman_name', 'price', 'emotional']);

        if ($request->hasFile('gambar')) {
            $path = $request->file('gambar')->store('minuman_gambar', 'public');
            $data['gambar'] = $path;
        }

        Minuman::create($data);

        return redirect()->route('minuman.index')->with('success', 'Minuman created successfully.');
    }


    /**
     * Display the specified resource.
     */
    public function show(Minuman $minuman)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Minuman $minuman)
    {
        return Inertia::render('minuman/edit', [
            'minuman' => $minuman,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Minuman $minuman)
    {
        $request->validate([
            'minuman_name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'emotional' => 'required|string|max:255',
            'gambar' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $data = $request->only(['minuman_name', 'price', 'emotional']);

        if ($request->hasFile('gambar')) {
            if ($minuman->gambar) {
                Storage::disk('public')->delete($minuman->gambar);
            }

            $path = $request->file('gambar')->store('minuman_gambars', 'public');
            $data['gambar'] = $path;
        }

        $minuman->update($data);

        return redirect()->route('minuman.index')->with('success', 'Minuman updated successfully.');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Minuman $minuman)
    {
        $minuman->delete();

        return redirect()->route('minuman.index')->with('success', 'Minuman deleted successfully.');
    }

}
