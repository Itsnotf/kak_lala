<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Minuman extends Model
{
    protected $fillable = [
        'minuman_name',
        'price',
        'emotional',
        'gambar',
    ];

    public function orders()
    {
        return $this->belongsToMany(Order::class, 'order_minuman')
                    ->withPivot('quantity', 'total_harga')
                    ->withTimestamps();
    }

}
