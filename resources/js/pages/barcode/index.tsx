import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router } from '@inertiajs/react';
import { ImageIcon, UploadIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Barcode', href: '/barcode' }];

const barcodeSchema = z.object({
    nama: z.string().min(1, 'Nama harus diisi'),
    image: z.union([
        z
            .instanceof(File, { message: 'Gambar harus diupload' })
            .refine((file) => file.size <= 2 * 1024 * 1024, 'Ukuran maksimal 2MB')
            .refine((file) => ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type), 'Hanya format .jpeg, .jpg, atau .png yang diperbolehkan'),
        z.string().min(1, 'Gambar harus diupload'),
    ]),
});

type BarcodeFormValues = z.infer<typeof barcodeSchema>;

type BarcodePageProps = {
    barcode: {
        id?: number;
        nama: string;
        image?: string;
    };
    imageUrl?: string;
};

export default function BarcodePage({ barcode, imageUrl }: BarcodePageProps) {
    const [preview, setPreview] = useState<string | null>(imageUrl || null);

    const form = useForm<BarcodeFormValues>({
        resolver: zodResolver(barcodeSchema),
        defaultValues: {
            nama: barcode.nama || '',
            image: barcode.image || undefined,
        },
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            form.setValue('image', file);
            setPreview(URL.createObjectURL(file));
            form.clearErrors('image');
        }
    };

    const onSubmit = async (data: BarcodeFormValues) => {
        const formData = new FormData();
        formData.append('nama', data.nama);

        if (data.image instanceof File) {
            formData.append('image', data.image);
        } else if (typeof data.image === 'string' && data.image) {
            formData.append('image_url', data.image);
        }

        await router.post('/barcode', formData, {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Barcode" />
            <div className="container  p-6">
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Form Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <UploadIcon className="h-5 w-5" />
                                {barcode.id ? 'Update Barcode' : 'Buat Barcode'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="nama"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nama Barcode</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Masukkan nama barcode" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="image"
                                        render={() => (
                                            <FormItem>
                                                <FormLabel>Gambar Barcode</FormLabel>
                                                <FormControl>
                                                    <div className="flex items-center gap-4">
                                                        <Input type="file" accept="image/*" onChange={handleFileChange} className="cursor-pointer" />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                                        {form.formState.isSubmitting ? 'Menyimpan...' : 'Simpan Barcode'}
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>

                    {/* Preview Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ImageIcon className="h-5 w-5" />
                                Preview Barcode
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {preview ? (
                                <div className="flex flex-col items-center space-y-4">
                                    <h3 className="text-lg font-medium">{form.watch('nama') || 'Nama Barcode'}</h3>
                                    <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-lg border">
                                        <img src={preview} alt="Barcode Preview" className="h-full w-full object-contain" />
                                    </div>
                                    {form.watch('image') instanceof File && (
                                        <p className="text-muted-foreground text-sm">
                                            Format: {(form.watch('image') as File).name.split('.').pop()?.toUpperCase()}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="bg-muted/50 flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed">
                                    <ImageIcon className="text-muted-foreground h-12 w-12" />
                                    <p className="text-muted-foreground mt-2 text-sm">Belum ada gambar barcode</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
