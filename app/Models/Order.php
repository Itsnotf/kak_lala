<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'no_meja',
        'nama_pelanggan',
        'metode_pembayaran',
        'bukti_pembayaran',
        'status',
    ];

    public function minuman()
    {
        return $this->belongsToMany(Minuman::class, 'order_minuman')
                    ->withPivot('quantity', 'total_harga')
                    ->withTimestamps();
    }

}
