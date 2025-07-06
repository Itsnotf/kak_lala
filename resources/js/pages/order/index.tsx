import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

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
};

type Props = {
    orders: Order[];
};

export default function OrderIndex({ orders }: Props) {
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order) => {
                                const totalOrderHarga = order.order_minuman.reduce(
                                    (total, item) => total + item.total_harga,
                                    0
                                );

                                return (
                                    <TableRow
                                        key={order.id}
                                        className="cursor-pointer hover:bg-muted"
                                        onClick={() => setSelectedOrder(order)}
                                    >
                                        <TableCell>{order.id}</TableCell>
                                        <TableCell>{order.no_meja}</TableCell>
                                        <TableCell>{order.nama_pelanggan}</TableCell>
                                        <TableCell>Rp {totalOrderHarga.toLocaleString()}</TableCell>
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
                        <DialogTitle>Detail Order</DialogTitle>
                        <DialogDescription>
                            Informasi lengkap dari pesanan pelanggan.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedOrder && (
                        <div className="space-y-3">
                            <p><strong>No Meja:</strong> {selectedOrder.no_meja}</p>
                            <p><strong>Nama Pelanggan:</strong> {selectedOrder.nama_pelanggan}</p>

                            <div>
                                <strong>Pesanan:</strong>
                                <ul className="ml-4 list-disc">
                                    {selectedOrder.order_minuman.map((item) => (
                                        <li key={item.id}>
                                            {item.minuman_name} x {item.quantity} — Rp {item.total_harga.toLocaleString()}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <p className="pt-2 border-t">
                                <strong>Total Harga:</strong>{' '}
                                Rp{' '}
                                {selectedOrder.order_minuman
                                    .reduce((total, item) => total + item.total_harga, 0)
                                    .toLocaleString()}
                            </p>
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setSelectedOrder(null)}>
                            Tutup
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
