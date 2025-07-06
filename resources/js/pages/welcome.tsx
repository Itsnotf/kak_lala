'use client';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import type { Barcode } from '@/types';
import { type Minuman } from '@/types';
import { Inertia } from '@inertiajs/inertia';
import { useForm } from '@inertiajs/react';
import { ShoppingCart } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

type Props = {
    minuman: Minuman[];
    no_meja: any;
    barcode: Barcode;
};

export default function TablePage({ minuman, no_meja, barcode }: Props) {
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [predictedEmotion, setPredictedEmotion] = useState<string | null>(null);
    const [filteredMinuman, setFilteredMinuman] = useState<Minuman[]>([]);
    const [cart, setCart] = useState<{ item: Minuman; quantity: number }[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [showQRISDialog, setShowQRISDialog] = useState(false);
    const nomorMeja = no_meja;

    const { data, setData, post, processing, reset, errors } = useForm({
        nama_pelanggan: '',
        metode_pembayaran: 'cash',
        bukti_pembayaran: null as File | null,
        no_meja: nomorMeja,
        order_minuman: [] as { minuman_id: number; quantity: number }[],
    });

    useEffect(() => {
        const initialOrderMinuman = cart.map(({ item, quantity }) => ({
            minuman_id: item.id,
            quantity,
        }));

        setData('order_minuman', initialOrderMinuman);
    }, [cart, setData]);

    const handleFileChange = (e: any) => {
        setData('bukti_pembayaran', e.target.files[0]);
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('nama_pelanggan', data.nama_pelanggan);
        formData.append('metode_pembayaran', data.metode_pembayaran);
        formData.append('no_meja', data.no_meja);

        if (data.bukti_pembayaran) {
            formData.append('bukti_pembayaran', data.bukti_pembayaran);
        }

        data.order_minuman.forEach((item: { minuman_id: number; quantity: number }, index: number) => {
            formData.append(`order_minuman[${index}][minuman_id]`, item.minuman_id.toString());
            formData.append(`order_minuman[${index}][quantity]`, item.quantity.toString());
        });

        Inertia.post('/pesan', formData, {
            onFinish: () => {
                reset();
            },
            onError: (errors: any) => {
                console.error('Error submitting the form:', errors);
            },
        });
    };


    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        const chunks: Blob[] = [];

        recorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunks.push(e.data);
        };

        recorder.onstop = async () => {
            const audioBlob = new Blob(chunks, { type: 'audio/webm' });
            setAudioChunks(chunks);

            const audioUrl = URL.createObjectURL(audioBlob);
            if (audioRef.current) audioRef.current.src = audioUrl;

            const formData = new FormData();
            formData.append('audio', audioBlob, 'recording.webm');

            try {
                const response = await fetch('http://127.0.0.1:5000/predict', {
                    method: 'POST',
                    body: formData,
                });

                const data = await response.json();
                if (data?.emotion) {
                    const emotion = data.emotion.trim().toLowerCase();
                    setPredictedEmotion(emotion);

                    const filtered = minuman.filter((m) => m.emotional?.trim().toLowerCase() === emotion);
                    setFilteredMinuman(filtered);
                    toast.success(`Emosi terdeteksi: ${emotion}`);
                } else {
                    toast.error('Gagal mendapatkan emosi.');
                }
            } catch {
                toast.error('Gagal menghubungi server emosi.');
            }
        };

        setAudioChunks([]);
        setMediaRecorder(recorder);
        recorder.start();
        setIsRecording(true);
        toast.info('Mulai merekam...');
    };

    const stopRecording = () => {
        mediaRecorder?.stop();
        setIsRecording(false);
        toast.info('Rekaman dihentikan');
    };

    const addToCart = (minuman: Minuman) => {
        setCart((prev) => {
            const existing = prev.find((i) => i.item.id === minuman.id);
            if (existing) {
                return prev.map((i) => (i.item.id === minuman.id ? { ...i, quantity: i.quantity + 1 } : i));
            }
            return [...prev, { item: minuman, quantity: 1 }];
        });
        toast.success('Minuman ditambahkan ke keranjang!');
    };

    const increaseQty = (id: number) => {
        setCart((prev) => prev.map((i) => (i.item.id === id ? { ...i, quantity: i.quantity + 1 } : i)));
    };

    const decreaseQty = (id: number) => {
        setCart((prev) => prev.map((i) => (i.item.id === id ? { ...i, quantity: i.quantity - 1 } : i)).filter((i) => i.quantity > 0));
    };

    if (!minuman || minuman.length === 0) {
        return <div>Data minuman tidak ditemukan.</div>;
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-8">
            <Drawer>
                <div className="flex items-center justify-between p-4">
                    <h2 className="text-xl font-semibold">Rekomendasi Minuman</h2>
                    <div className="flex items-center gap-3">
                        <Button onClick={isRecording ? stopRecording : startRecording}>{isRecording ? 'Stop Rekaman' : 'Mulai Rekam'}</Button>
                        <DrawerTrigger asChild>
                            <Button variant="outline" size="icon" className="relative">
                                <ShoppingCart className="h-5 w-5" />
                                {cart.length > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                                        {cart.reduce((sum, item) => sum + item.quantity, 0)}
                                    </span>
                                )}
                            </Button>
                        </DrawerTrigger>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-6 px-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {(predictedEmotion ? filteredMinuman : []).map((item) => (
                        <div key={item.id} className="rounded-xl border p-4 shadow transition hover:shadow-md">
                            <img src={`/storage/${item.gambar}`} alt={item.minuman_name} className="mb-4 h-40 w-full rounded-md object-cover" />
                            <h3 className="text-lg font-semibold">{item.minuman_name}</h3>
                            <p className="text-sm text-gray-600">
                                {new Intl.NumberFormat('id-ID', {
                                    style: 'currency',
                                    currency: 'IDR',
                                }).format(item.price)}
                            </p>
                            <Button className="mt-3 w-full" onClick={() => addToCart(item)}>
                                Add to Cart
                            </Button>
                        </div>
                    ))}
                    {predictedEmotion && filteredMinuman.length === 0 && (
                        <p className="col-span-full text-center text-gray-500">Tidak ada minuman untuk emosi ini.</p>
                    )}
                    {!predictedEmotion && (
                        <p className="col-span-full text-center text-gray-400 italic">Silakan rekam suara untuk mendapatkan rekomendasi minuman.</p>
                    )}
                </div>

                <div className="mt-10 px-4">
                    <h2 className="mb-4 text-xl font-semibold">Semua Minuman</h2>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {(minuman && minuman.length > 0 ? minuman : []).map((item) => (
                            <div key={item.id} className="rounded-xl border p-4 shadow transition hover:shadow-md">
                                <img src={`/storage/${item.gambar}`} alt={item.minuman_name} className="mb-4 h-40 w-full rounded-md object-cover" />
                                <h3 className="text-lg font-semibold">{item.minuman_name}</h3>
                                <p className="text-sm text-gray-600">
                                    {new Intl.NumberFormat('id-ID', {
                                        style: 'currency',
                                        currency: 'IDR',
                                    }).format(item.price)}
                                </p>
                                <Button className="mt-3 w-full" onClick={() => addToCart(item)}>
                                    Add to Cart
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                <DrawerContent className="p-4 ">
                    {!showForm ? (
                        <>
                            <h3 className="mb-4 text-lg font-semibold">Keranjang</h3>
                            {cart.length === 0 ? (
                                <p className="text-center text-gray-500">Keranjang kosong.</p>
                            ) : (
                                <div className="space-y-4">
                                    {cart.map(({ item, quantity }) => (
                                        <div key={item.id} className="flex items-center justify-between gap-4 border-b pb-2">
                                            <div>
                                                <p className="font-medium">{item.minuman_name}</p>
                                                <p className="text-sm text-gray-500">
                                                    {new Intl.NumberFormat('id-ID', {
                                                        style: 'currency',
                                                        currency: 'IDR',
                                                    }).format(item.price)}{' '}
                                                    × {quantity}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button variant="outline" size="icon" onClick={() => decreaseQty(item.id)}>
                                                    -
                                                </Button>
                                                <span>{quantity}</span>
                                                <Button variant="outline" size="icon" onClick={() => increaseQty(item.id)}>
                                                    +
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                    <Button className="mt-4 w-full" onClick={() => setShowForm(true)}>
                                        Lanjut ke Pembayaran
                                    </Button>
                                </div>
                            )}
                        </>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <h3 className="text-lg font-semibold">Form Pemesanan</h3>
                            <div>
                                <label className="block text-sm font-medium">Nama Pelanggan</label>
                                <input
                                    type="text"
                                    value={data.nama_pelanggan}
                                    onChange={(e) => setData('nama_pelanggan', e.target.value)}
                                    className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                                    required
                                />
                                {errors.nama_pelanggan && <p className="text-sm text-red-500">{errors.nama_pelanggan}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Metode Pembayaran</label>
                                <select
                                    value={data.metode_pembayaran}
                                    onChange={(e) => setData('metode_pembayaran', e.target.value)}
                                    className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                                >
                                    <option value="cash">Cash</option>
                                    <option value="qris">Qris</option>
                                </select>
                            </div>

                            {data.metode_pembayaran === 'qris' && (
                                <div className="space-y-2">
                                    <Dialog open={showQRISDialog} onOpenChange={setShowQRISDialog}>
                                        <DialogTrigger asChild>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="w-full"
                                                onClick={() => setShowQRISDialog(true)}
                                            >
                                                Tampilkan QRIS Code
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <h3 className="text-lg font-semibold">Scan QRIS untuk Pembayaran</h3>
                                            </DialogHeader>
                                            <div className="flex flex-col items-center justify-center p-4">
                                                <img
                                                    src={`/storage/${barcode.image}`}
                                                    alt="Barcode Pembayaran"
                                                    className="w-full max-w-xs rounded border"
                                                />
                                                <p className="mt-2 text-sm text-gray-600">
                                                    Silakan scan QR code di atas untuk melakukan pembayaran
                                                </p>
                                            </div>
                                        </DialogContent>
                                    </Dialog>

                                    <div>
                                        <label className="block text-sm font-medium">Upload Bukti Pembayaran</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="mt-1 w-full text-sm"
                                            required={data.metode_pembayaran === 'qris'}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-between gap-4">
                                <Button type="button" variant="outline" className="w-1/2" onClick={() => setShowForm(false)}>
                                    Kembali
                                </Button>
                                <Button type="submit" className="w-1/2" disabled={processing}>
                                    {processing ? 'Mengirim...' : 'Kirim Pesanan'}
                                </Button>
                            </div>
                        </form>
                    )}
                </DrawerContent>
            </Drawer>
        </div>
    );
}
