<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $orders = Order::with(['minuman'])->latest()->get();

        // dd($orders);

        $formattedOrders = $orders->map(function ($order) {
            return [
                'id' => $order->id,
                'no_meja' => $order->no_meja,
                'nama_pelanggan' => $order->nama_pelanggan,
                'metode_pembayaran' => $order->metode_pembayaran,
                'bukti_pembayaran' => $order->bukti_pembayaran,
                'status' => $order->status,
                'order_minuman' => $order->minuman->map(function ($minuman) {
                    return [
                        'id' => $minuman->id,
                        'minuman_name' => $minuman->minuman_name,
                        'quantity' => $minuman->pivot->quantity,
                        'total_harga' => $minuman->pivot->total_harga,
                    ];
                }),
            ];
        });

        // dd($formattedOrders);
        return Inertia::render('order/index', [
            'orders' => $formattedOrders,
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
    public function pesan(Request $request)
    {
        $validated = $request->validate([
            'nama_pelanggan' => 'required|string',
            'metode_pembayaran' => 'required|string',
            'no_meja' => 'required|string',
            'bukti_pembayaran' => 'nullable|file|mimes:jpg,jpeg,png,pdf',
            'order_minuman' => 'required|array',
            'order_minuman.*.minuman_id' => 'required|integer',
            'order_minuman.*.quantity' => 'required|integer',
        ]);

        $order = new Order();
        $order->nama_pelanggan = $validated['nama_pelanggan'];
        $order->metode_pembayaran = $validated['metode_pembayaran'];
        $order->no_meja = $validated['no_meja'];
        $order->status = "pending";

        if ($request->hasFile('bukti_pembayaran')) {
            $filePath = $request->file('bukti_pembayaran')->store('bukti_pembayaran', 'public');
            $order->bukti_pembayaran = $filePath;
        }

        $order->save();

        foreach ($validated['order_minuman'] as $minuman) {
            $minumanData = \App\Models\Minuman::find($minuman['minuman_id']);

            if ($minumanData) {
                $totalHarga = $minuman['quantity'] * $minumanData->price;

                $order->minuman()->attach($minuman['minuman_id'], [
                    'quantity' => $minuman['quantity'],
                    'total_harga' => $totalHarga,
                ]);
            }
        }

        return redirect()->back()->with('success', 'Orderan created successfully.');
    }

    public function selesaikan(Order $order)
    {
        if (!$order) {
            return redirect()->back()->with('error', 'Order tidak ditemukan.');
        }

        $order->status = 'selesai';
        $order->save();

        // Redirect kembali ke halaman index dengan pesan sukses
        return redirect()->route('order.index')->with('success', 'Order berhasil diselesaikan.');
    }


    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Order $order)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Order $order)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        //
    }
}
