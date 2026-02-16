"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CreateDeliveryDialog from "@/components/delivery/create-delivery-dialog";
import { getAllDeliveries } from "@/app/actions/orders";
import { MapPin, Calendar, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface DeliveryOrder {
    id: string;
    delivery_address: string;
    delivery_date: string;
    status: string;
    dedication_text: string | null;
    customers: {
        name: string;
        phone: string;
    } | null;
}

export default function DeliveryPage() {
    const [deliveries, setDeliveries] = useState<DeliveryOrder[]>([]);
    const [filterStatus, setFilterStatus] = useState("Todos");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadDeliveries();
    }, [filterStatus]);

    const loadDeliveries = async () => {
        setIsLoading(true);
        const data = await getAllDeliveries(filterStatus);
        setDeliveries(data);
        setIsLoading(false);
    };

    const getStatusBadge = (status: string) => {
        if (status === "Pendiente") return "pending";
        if (status === "En Ruta") return "inRoute";
        return "delivered";
    };

    const statusFilters = ["Todos", "Pendiente", "En Ruta", "Entregado"];

    return (
        <main className="p-4 space-y-4 max-w-2xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-800 mb-1">Entregas</h1>
                <p className="text-slate-600">Gestión de pedidos y delivery</p>
            </div>

            {/* Status Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {statusFilters.map((status) => (
                    <Button
                        key={status}
                        variant={filterStatus === status ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilterStatus(status)}
                        className="flex-shrink-0"
                    >
                        {status}
                    </Button>
                ))}
            </div>

            {/* Deliveries List */}
            <div className="space-y-3">
                {isLoading ? (
                    <Card>
                        <CardContent className="p-6 text-center text-slate-500">
                            Cargando entregas...
                        </CardContent>
                    </Card>
                ) : deliveries.length === 0 ? (
                    <Card>
                        <CardContent className="p-6 text-center text-slate-500">
                            No hay entregas para mostrar
                        </CardContent>
                    </Card>
                ) : (
                    deliveries.map((order) => (
                        <Card key={order.id} className="hover:border-petal-pink transition-colors">
                            <CardContent className="p-4">
                                <Link href={`/delivery/${order.id}`} className="block">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0 space-y-2">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="font-semibold text-slate-800">
                                                    {order.customers?.name || "Cliente"}
                                                </h3>
                                                <Badge variant={getStatusBadge(order.status)}>
                                                    {order.status}
                                                </Badge>
                                            </div>

                                            <div className="flex items-start gap-2 text-sm text-slate-600">
                                                <Calendar className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                                <span>
                                                    {format(new Date(order.delivery_date), "PPP", { locale: es })}
                                                </span>
                                            </div>

                                            <div className="flex items-start gap-2 text-sm text-slate-600">
                                                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                                <span className="line-clamp-2">{order.delivery_address}</span>
                                            </div>
                                        </div>

                                        <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0 mt-1" />
                                    </div>
                                </Link>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Floating Action Button */}
            <CreateDeliveryDialog />
        </main>
    );
}
