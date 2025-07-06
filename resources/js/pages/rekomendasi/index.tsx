import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Minuman } from '@/types';
import { Head } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Minuman', href: '/minuman' }];

type Props = {
    minuman: Minuman[];
};

export default function MinumanPage({ minuman }: Props) {
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
    const [predictedEmotion, setPredictedEmotion] = useState<string | null>(null);
    const [filteredMinuman, setFilteredMinuman] = useState<Minuman[]>([]);
    const audioRef = useRef<HTMLAudioElement>(null);

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
                    const emotion = data.emotion.toLowerCase();
                    setPredictedEmotion(emotion);

                    const filtered = minuman.filter((m) => m.emotional.toLowerCase() === emotion);
                    setFilteredMinuman(filtered);

                    toast.success(`Emosi terdeteksi: ${emotion}`);
                } else {
                    toast.error('Gagal mendapatkan emosi.');
                }
            } catch (error) {
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Minuman" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="mt-6">
                    <div className="flex items-center justify-between gap-4">
                        <h2 className="mb-2 text-xl font-semibold">Rekomendasi Minuman</h2>
                        <Button onClick={isRecording ? stopRecording : startRecording}>{isRecording ? 'Stop Rekaman' : 'Mulai Rekam'}</Button>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Nama Minuman</TableHead>
                                <TableHead>Harga</TableHead>
                                <TableHead>Emosi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {predictedEmotion ? (
                                filteredMinuman.length > 0 ? (
                                    filteredMinuman.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>{item.id}</TableCell>
                                            <TableCell>{item.minuman_name}</TableCell>
                                            <TableCell>
                                                {new Intl.NumberFormat('id-ID', {
                                                    style: 'currency',
                                                    currency: 'IDR',
                                                }).format(item.price)}
                                            </TableCell>
                                            <TableCell>{item.emotional}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center text-gray-500">
                                            Tidak ada minuman untuk emosi ini.
                                        </TableCell>
                                    </TableRow>
                                )
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-gray-400 italic">
                                        Silakan rekam suara untuk mendapatkan rekomendasi minuman.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
