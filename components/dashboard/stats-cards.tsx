import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TrendingUp, Package, Truck, AlertTriangle } from "lucide-react";

interface StatsCardsProps {
    stats: {
        totalSales: number;
        totalRevenue: number;
        pendingDeliveries: number;
        lowStockCount: number;
    };
}

export default function StatsCards({ stats }: StatsCardsProps) {
    const cards = [
        {
            title: "Ventas Hoy",
            value: stats.totalSales,
            icon: TrendingUp,
            color: "text-petal-pink",
            bgColor: "bg-pink-50",
        },
        {
            title: "Ingresos",
            value: `S/ ${stats.totalRevenue.toFixed(2)}`,
            icon: Package,
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
        {
            title: "Entregas Pendientes",
            value: stats.pendingDeliveries,
            icon: Truck,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            title: "Stock Bajo",
            value: stats.lowStockCount,
            icon: AlertTriangle,
            color: stats.lowStockCount > 0 ? "text-amber-600" : "text-slate-400",
            bgColor: stats.lowStockCount > 0 ? "bg-amber-50" : "bg-slate-50",
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-3">
            {cards.map((card) => {
                const Icon = card.icon;
                return (
                    <Card key={card.title} className="overflow-hidden">
                        <CardContent className="p-4">
                            <div className={`w-10 h-10 rounded-full ${card.bgColor} flex items-center justify-center mb-3`}>
                                <Icon className={`w-5 h-5 ${card.color}`} />
                            </div>
                            <p className="text-xs text-slate-600 mb-1">{card.title}</p>
                            <p className="text-2xl font-bold text-slate-800">{card.value}</p>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
