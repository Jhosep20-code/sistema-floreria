"use client";

import { Button } from "@/components/ui/button";
import { updateOrderStatus } from "@/app/actions/orders";
import { useState } from "react";
import { Truck, CheckCircle } from "lucide-react";

interface StatusUpdaterProps {
    orderId: string;
    currentStatus: string;
    onUpdate?: () => void;
}

export default function StatusUpdater({ orderId, currentStatus, onUpdate }: StatusUpdaterProps) {
    const [isUpdating, setIsUpdating] = useState(false);

    const handleUpdateStatus = async (newStatus: string) => {
        setIsUpdating(true);

        const result = await updateOrderStatus(orderId, newStatus);

        if (result.success) {
            if (onUpdate) {
                onUpdate();
            }
            // Reload page to show updated status
            window.location.reload();
        } else {
            alert(result.error || "Error al actualizar el estado");
        }

        setIsUpdating(false);
    };

    if (currentStatus === "Entregado") {
        return (
            <div className="text-center py-6 text-green-600">
                <CheckCircle className="w-16 h-16 mx-auto mb-2" />
                <p className="font-semibold text-lg">Pedido entregado</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <h3 className="font-semibold text-slate-800 mb-3">Actualizar Estado</h3>

            <div className="grid gap-3">
                {currentStatus === "Pendiente" && (
                    <Button
                        size="lg"
                        className="h-14 text-base font-semibold bg-blue-500 hover:bg-blue-600 text-white"
                        onClick={() => handleUpdateStatus("En Ruta")}
                        disabled={isUpdating}
                    >
                        <Truck className="w-5 h-5 mr-2" />
                        {isUpdating ? "Actualizando..." : "Marcar En Ruta"}
                    </Button>
                )}

                {currentStatus === "En Ruta" && (
                    <Button
                        size="lg"
                        variant="success"
                        className="h-14 text-base font-semibold"
                        onClick={() => handleUpdateStatus("Entregado")}
                        disabled={isUpdating}
                    >
                        <CheckCircle className="w-5 h-5 mr-2" />
                        {isUpdating ? "Actualizando..." : "Marcar Entregado"}
                    </Button>
                )}

                {currentStatus === "Pendiente" && (
                    <Button
                        size="lg"
                        variant="success"
                        className="h-14 text-base font-semibold"
                        onClick={() => handleUpdateStatus("Entregado")}
                        disabled={isUpdating}
                    >
                        <CheckCircle className="w-5 h-5 mr-2" />
                        {isUpdating ? "Actualizando..." : "Marcar como Entregado"}
                    </Button>
                )}
            </div>
        </div>
    );
}
