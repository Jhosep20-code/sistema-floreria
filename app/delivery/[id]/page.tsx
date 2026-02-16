import { notFound } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StatusUpdater from "@/components/delivery/status-updater";
import GoogleMapsButton from "@/components/delivery/google-maps-button";
import { getOrderDetails } from "@/app/actions/orders";
import { Phone, Calendar, CreditCard, Heart, Package, MapPin } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function DeliveryDetailPage({ params }: PageProps) {
    const { id } = await params;
    const order = await getOrderDetails(id);

    if (!order) {
        notFound();
    }

    const getStatusBadge = (status: string) => {
        if (status === "Pendiente") return "pending";
        if (status === "En Ruta") return "inRoute";
        return "delivered";
    };

    const saleItems = order.sales?.items ? JSON.parse(JSON.stringify(order.sales.items)) : [];

    return (
        <main className="p-4 space-y-4 max-w-2xl mx-auto pb-24">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Detalle de Entrega</h1>
                    <Badge variant={getStatusBadge(order.status)} className="mt-2">
                        {order.status}
                    </Badge>
                </div>
            </div>

            {/* Customer Info */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Phone className="w-5 h-5 text-petal-pink" />
                        Cliente
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <p className="font-semibold text-lg">{order.customers?.name || "Cliente"}</p>
                    <p className="text-slate-600">{order.customers?.phone}</p>
                    {order.customers?.email && (
                        <p className="text-slate-600 text-sm">{order.customers.email}</p>
                    )}
                </CardContent>
            </Card>

            {/* Delivery Info */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-petal-pink" />
                        Información de Entrega
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div>
                        <p className="text-sm text-slate-600 mb-1">Dirección</p>
                        <p className="font-medium">{order.delivery_address}</p>
                        <GoogleMapsButton address={order.delivery_address} />
                    </div>

                    <div>
                        <p className="text-sm text-slate-600 mb-1">Fecha de Entrega</p>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-500" />
                            <p className="font-medium">
                                {format(new Date(order.delivery_date), "PPP", { locale: es })}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Dedication Card */}
            {order.dedication_text && (
                <Card className="bg-gradient-to-br from-petal-pink/20 to-petal-purple/20 border-petal-pink">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Heart className="w-5 h-5 text-petal-pink" />
                            Mensaje de Dedicatoria
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-slate-800 italic leading-relaxed">"{order.dedication_text}"</p>
                    </CardContent>
                </Card>
            )}

            {/* Order Items */}
            {saleItems.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="w-5 h-5 text-petal-pink" />
                            Productos
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {saleItems.map((item: any, index: number) => (
                                <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                                    <div>
                                        <p className="font-medium text-slate-800">Producto #{index + 1}</p>
                                        <p className="text-sm text-slate-600">Cantidad: {item.quantity}</p>
                                    </div>
                                    <p className="font-semibold">S/ {(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Payment Info */}
            {order.sales && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-petal-pink" />
                            Información de Pago
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-600">Método de Pago:</span>
                            <span className="font-semibold">{order.sales.payment_method}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t">
                            <span className="text-lg font-medium">Total:</span>
                            <span className="text-2xl font-bold text-petal-pink">
                                S/ {Number(order.sales.total_amount).toFixed(2)}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Status Update Buttons */}
            <Card className="sticky bottom-20 border-2 border-petal-pink">
                <CardContent className="p-4">
                    <StatusUpdater orderId={order.id} currentStatus={order.status} />
                </CardContent>
            </Card>
        </main>
    );
}
