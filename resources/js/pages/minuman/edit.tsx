import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Minuman',
        href: '/minuman',
    },
    {
        title: 'Edit',
        href: '#',
    },
];

const emotionOptions = ['neutral', 'happy', 'sad', 'angry', 'fear', 'surprise'];

export default function Edit({ minuman }: { minuman: any }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        minuman_name: minuman.minuman_name,
        price: minuman.price,
        emotional: minuman.emotional,
        image: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/minuman/${minuman.id}`, { forceFormData: true });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file); 
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Minuman" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="p-6">
                    <h1 className="mb-4 text-2xl font-semibold">Edit Minuman</h1>
                    <form onSubmit={handleSubmit} className="max-w-full space-y-4">
                        <div>
                            <Label htmlFor="minuman_name">Nama Minuman</Label>
                            <Input id="minuman_name" value={data.minuman_name} onChange={(e) => setData('minuman_name', e.target.value)} />
                            {errors.minuman_name && <p className="mt-1 text-sm text-red-500">{errors.minuman_name}</p>}
                        </div>

                        <div>
                            <Label htmlFor="price">Harga</Label>
                            <Input id="price" type="number" value={data.price} onChange={(e) => setData('price', e.target.value)} />
                            {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
                        </div>

                        <div>
                            <Label htmlFor="emotional">Emosi</Label>
                            <Select value={data.emotional} onValueChange={(value) => setData('emotional', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Emosi" />
                                </SelectTrigger>
                                <SelectContent>
                                    {emotionOptions.map((emotion) => (
                                        <SelectItem key={emotion} value={emotion}>
                                            {emotion}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.emotional && <p className="mt-1 text-sm text-red-500">{errors.emotional}</p>}
                        </div>

                        <div>
                            <Label htmlFor="image">Gambar Minuman</Label>
                            <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
                            {errors.image && <p className="mt-1 text-sm text-red-500">{errors.image}</p>}
                            {minuman.image && !data.image && (
                                <img
                                    src={`/storage/${minuman.image}`}
                                    alt="Gambar sebelumnya"
                                    className="mt-2 max-w-xs rounded shadow"
                                />
                            )}
                            {data.image && (
                                <img
                                    src={URL.createObjectURL(data.image)}
                                    alt="Preview"
                                    className="mt-2 max-w-xs rounded shadow"
                                />
                            )}
                        </div>

                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
