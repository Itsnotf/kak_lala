import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react'; // 1. Import router
import { CheckCircle } from 'lucide-react';
import { useState } from 'react';

type OrderMinuman = {
    id: number;
    minuman_name: string;
    quantity: number;
    total_harga: number;
};

type Order = {
    id: number;
    no_meja: string;
    nama_pelanggan: string;
    order_minuman: OrderMinuman[];
    status: string;
    metode_pembayaran: string;
    bukti_pembayaran: string;
};

type Props = {
    orders: Order[];
};

export default function OrderIndex({ orders }: Props) {
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    // 2. Buat fungsi untuk menangani penyelesaian order
    const handleSelesaikanOrder = () => {
        if (!selectedOrder) return;

        // Gunakan router.put untuk mengirim request ke backend
        router.put(
            route('orders.selesaikan', selectedOrder.id),
            {},
            {
                onSuccess: () => {
                    // Tutup modal setelah berhasil
                    setSelectedOrder(null);
                },
                // Anda bisa menambahkan onError untuk menangani jika ada error
                onError: (errors) => {
                    console.error('Gagal menyelesaikan order:', errors);
                    alert('Gagal menyelesaikan order. Silakan coba lagi.');
                },
            },
        );
    };

    return (
        <AppLayout>
            <Head title="Order List" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <h1 className="text-2xl font-semibold">Daftar Order</h1>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>No Meja</TableHead>
                                <TableHead>Nama Pelanggan</TableHead>
                                <TableHead>Total Harga</TableHead>
                                <TableHead>Metode Pembayaran</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order) => {
                                const totalOrderHarga = order.order_minuman.reduce((total, item) => total + item.total_harga, 0);
                                return (
                                    <TableRow key={order.id} className="hover:bg-muted cursor-pointer" onClick={() => setSelectedOrder(order)}>
                                        <TableCell>{order.id}</TableCell>
                                        <TableCell>{order.no_meja}</TableCell>
                                        <TableCell>{order.nama_pelanggan}</TableCell>
                                        <TableCell>Rp {totalOrderHarga.toLocaleString()}</TableCell>
                                        <TableCell>{order.metode_pembayaran}</TableCell>
                                        <TableCell>
                                            <span
                                                className={`rounded-full px-2 py-1 text-xs font-semibold ${
                                                    order.status === 'selesai' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}
                                            >
                                                {order.status}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Modal pakai ShadCN */}
            <Dialog open={selectedOrder !== null} onOpenChange={() => setSelectedOrder(null)}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Detail Pesanan</DialogTitle>
                        <DialogDescription>Informasi lengkap dari pesanan pelanggan.</DialogDescription>
                    </DialogHeader>

                    {selectedOrder && (
                        <div className="flex flex-col gap-4 py-4">
                            {/* --- Detail Pelanggan & Meja --- */}
                            <div className="grid grid-cols-3 items-center gap-x-4 gap-y-2 text-sm">
                                {/* UX: Menggunakan grid agar label dan data sejajar rapi */}
                                <span className="text-muted-foreground">No. Meja</span>
                                <span className="col-span-2 font-semibold">{selectedOrder.no_meja}</span>

                                <span className="text-muted-foreground">Pelanggan</span>
                                <span className="col-span-2 font-semibold">{selectedOrder.nama_pelanggan}</span>

                                <span className="text-muted-foreground">Pembayaran</span>
                                <span className="col-span-2 font-semibold">{selectedOrder.metode_pembayaran || 'Belum ditentukan'}</span>
                            </div>

                            <Separator />

                            {/* --- Daftar Item Pesanan --- */}
                            <div>
                                <h4 className="mb-2 font-medium">Rincian Pesanan</h4>
                                <div className="space-y-2 text-sm">
                                    {/* UX: Menggunakan flexbox untuk meratakan harga di sebelah kanan */}
                                    {selectedOrder.order_minuman.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between">
                                            <div className="text-muted-foreground">
                                                <span>{item.minuman_name}</span>
                                                <span className="ml-2">x {item.quantity}</span>
                                            </div>
                                            <span>
                                                {/* UX: Format mata uang yang konsisten */}
                                                {new Intl.NumberFormat('id-ID', {
                                                    style: 'currency',
                                                    currency: 'IDR',
                                                    minimumFractionDigits: 0,
                                                }).format(item.total_harga)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Separator />

                            {/* --- Total Harga --- */}
                            {/* UX: Total harga dibuat lebih menonjol */}
                            <div className="flex items-center justify-between text-base font-bold">
                                <span>Total Harga</span>
                                <span>
                                    {new Intl.NumberFormat('id-ID', {
                                        style: 'currency',
                                        currency: 'IDR',
                                        minimumFractionDigits: 0,
                                    }).format(selectedOrder.order_minuman.reduce((total, item) => total + item.total_harga, 0))}
                                </span>
                            </div>

                            {/* --- Bukti Pembayaran (jika ada) --- */}
                            {selectedOrder?.metode_pembayaran === 'qris' && selectedOrder.bukti_pembayaran && (
                                <>
                                    <Separator />
                                    <div className="space-y-2">
                                        <h4 className="font-medium">Bukti Pembayaran</h4>
                                        <img
                                            src={`/storage/${selectedOrder.bukti_pembayaran}`}
                                            alt={`Bukti pembayaran dari ${selectedOrder.nama_pelanggan}`}
                                            className="w-full rounded-md border"
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    <DialogFooter>
                        {selectedOrder && selectedOrder.status !== 'selesai' && (
                            <Button variant="default" onClick={handleSelesaikanOrder}>
                                <CheckCircle className="mr-2 h-4 w-4" /> {/* UX: Ikon memperjelas aksi */}
                                Selesaikan Order
                            </Button>
                        )}
                        <Button variant="secondary" onClick={() => setSelectedOrder(null)}>
                            Tutup
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
