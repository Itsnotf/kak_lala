<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderMinuman extends Model
{
    use HasFactory;

    protected $table = 'order_minuman';

    protected $fillable = [
        'order_id',
        'minuman_id',
        'quantity',
        'total_harga',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function minuman()
    {
        return $this->belongsTo(Minuman::class);
    }
}

