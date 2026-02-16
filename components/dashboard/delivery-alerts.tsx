import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, ChevronRight } from "lucide-react";

interface DeliveryOrder {
    id: string;
    delivery_address: string;
    status: string;
    customers: {
        name: string;
        phone: string;
    } | null;
}

interface DeliveryAlertsProps {
    orders: DeliveryOrder[];
}

export default function DeliveryAlerts({ orders }: DeliveryAlertsProps) {
    if (orders.length === 0) {
        return (
            <div>
                <h2 className="text-lg font-semibold text-slate-800 mb-3 px-1">
                    🚚 Entregas de hoy
                </h2>
                <Card>
                    <CardContent className="p-6 text-center text-slate-500">
                        ✅ No hay entregas pendientes para hoy
                    </CardContent>
                </Card>
            </div>
        );
    }

    const getStatusBadge = (status: string) => {
        if (status === "Pendiente") return "pending";
        if (status === "En Ruta") return "inRoute";
        return "delivered";
    };

    return (
        <div>
            <h2 className="text-lg font-semibold text-slate-800 mb-3 px-1">
                🚚 Entregas de hoy ({orders.length})
            </h2>

            <div className="space-y-3">
                {orders.map((order) => (
                    <Card key={order.id} className="hover:border-petal-pink transition-colors">
                        <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="font-semibold text-slate-800 truncate">
                                            {order.customers?.name || "Cliente"}
                                        </h3>
                                        <Badge variant={getStatusBadge(order.status)}>
                                            {order.status}
                                        </Badge>
                                    </div>

                                    <div className="flex items-start gap-2 text-sm text-slate-600">
                                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                        <span className="line-clamp-2">{order.delivery_address}</span>
                                    </div>
                                </div>

                                <Link href={`/delivery/${order.id}`}>
                                    <Button variant="ghost" size="icon" className="flex-shrink-0">
                                        <ChevronRight className="w-5 h-5" />
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
