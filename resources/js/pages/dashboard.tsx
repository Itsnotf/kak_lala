import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Coffee, Package, CalendarDays } from 'lucide-react';
// Import komponen Chart yang baru
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('dashboard'),
    },
];

type WeeklyOrder = {
    date: string;
    total: number;
};

// Update tipe props utama
type DashboardProps = {
    ordersToday: number;
    totalOrders: number;
    totalMinuman: number;
    weeklyOrders: WeeklyOrder[]; // Tambahkan prop baru
};

// Konfigurasi untuk chart
const chartConfig = {
  orders: {
    label: "Pesanan",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;


export default function Dashboard({
    ordersToday,
    totalOrders,
    totalMinuman,
    weeklyOrders, // Terima prop baru
}: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pesanan Hari Ini</CardTitle>
                            <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{ordersToday}</div>
                            <p className="text-xs text-muted-foreground">Jumlah pesanan yang masuk hari ini</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Pesanan</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalOrders}</div>
                            <p className="text-xs text-muted-foreground">Jumlah seluruh pesanan sejak awal</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Menu Minuman</CardTitle>
                            <Coffee className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalMinuman}</div>
                            <p className="text-xs text-muted-foreground">Jumlah jenis minuman yang tersedia</p>
                        </CardContent>
                    </Card>
                </div>

                <Card className='h-full'>
                    <CardHeader>
                        <CardTitle>Pesanan Seminggu Terakhir</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-[350px] w-full">
                            <ResponsiveContainer>
                                <BarChart data={weeklyOrders} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
                                    <XAxis
                                        dataKey="date"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        fontSize={12}
                                    />
                                     <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                    <Bar dataKey="total" fill="var(--color-orders)" radius={4} />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
