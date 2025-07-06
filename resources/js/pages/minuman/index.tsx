import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Minuman } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Minuman',
        href: '/minuman',
    },
];

type Props = {
    minuman: Minuman[];
};

export default function Minuman({ minuman }: Props) {
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Minuman" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <h1 className="mb-4 text-2xl font-semibold">Daftar Minuman</h1>
                        <Button onClick={() => router.visit('/minuman/create')}>Create Minuman</Button>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Gambar</TableHead>
                                <TableHead>Nama Minuman</TableHead>
                                <TableHead>Harga</TableHead>
                                <TableHead>Emosi</TableHead>
                                <TableHead className="text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {minuman.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.id}</TableCell>
                                    <TableCell>
                                        <img src={`/storage/${item.gambar}`} alt="" className="h-16 w-16 object-cover" />
                                    </TableCell>
                                    <TableCell>{item.minuman_name}</TableCell>
                                    <TableCell>
                                        {new Intl.NumberFormat('id-ID', {
                                            style: 'currency',
                                            currency: 'IDR',
                                        }).format(item.price)}
                                    </TableCell>
                                    <TableCell>{item.emotional}</TableCell>
                                    <TableCell className="flex justify-center gap-2">
                                        <Button variant="outline" onClick={() => router.visit(`/minuman/${item.id}/edit`)}>
                                            Edit
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive" onClick={() => setSelectedId(item.id)}>
                                                    Delete
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Yakin ingin menghapus minuman ini?</AlertDialogTitle>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => {
                                                            if (selectedId !== null) {
                                                                router.delete(`/minuman/${selectedId}`);
                                                                setSelectedId(null);
                                                            }
                                                        }}
                                                    >
                                                        Hapus
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
