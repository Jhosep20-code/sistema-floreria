"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2 } from "lucide-react";
import { createDeliveryOrder } from "@/app/actions/orders";
import { getCustomers } from "@/app/actions/customers";

interface Customer {
    id: string;
    name: string;
    phone: string;
}

export default function CreateDeliveryDialog() {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [customers, setCustomers] = useState<Customer[]>([]);

    const [formData, setFormData] = useState({
        customerId: "",
        deliveryAddress: "",
        deliveryDate: "",
        dedicationText: "",
    });

    useEffect(() => {
        if (open) {
            loadCustomers();
        }
    }, [open]);

    const loadCustomers = async () => {
        const data = await getCustomers();
        setCustomers(data);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.customerId || !formData.deliveryAddress || !formData.deliveryDate) {
            alert("Por favor completa todos los campos obligatorios");
            return;
        }

        setIsLoading(true);

        const result = await createDeliveryOrder({
            customerId: formData.customerId,
            deliveryAddress: formData.deliveryAddress,
            deliveryDate: formData.deliveryDate,
            dedicationText: formData.dedicationText || undefined,
        });

        if (result.success) {
            setOpen(false);
            setFormData({
                customerId: "",
                deliveryAddress: "",
                deliveryDate: "",
                dedicationText: "",
            });
        } else {
            alert(result.error || "Error al crear la orden");
        }

        setIsLoading(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    size="lg"
                    className="fixed bottom-20 right-4 h-16 w-16 rounded-full shadow-2xl hover:shadow-3xl transition-all hover:scale-110 z-[100] bg-petal-pink hover:bg-petal-pink/90"
                    aria-label="Crear nueva entrega"
                >
                    <Plus className="w-7 h-7" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Crear Nueva Entrega</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    {/* Customer Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="customer">Cliente *</Label>
                        <select
                            id="customer"
                            required
                            value={formData.customerId}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, customerId: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-petal-pink"
                        >
                            <option value="">Seleccionar cliente...</option>
                            {customers.map((customer) => (
                                <option key={customer.id} value={customer.id}>
                                    {customer.name} - {customer.phone}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Delivery Address */}
                    <div className="space-y-2">
                        <Label htmlFor="address">Dirección de Entrega *</Label>
                        <Textarea
                            id="address"
                            required
                            placeholder="Ingresa la dirección completa..."
                            value={formData.deliveryAddress}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                            rows={3}
                        />
                    </div>

                    {/* Delivery Date */}
                    <div className="space-y-2">
                        <Label htmlFor="date">Fecha de Entrega *</Label>
                        <Input
                            id="date"
                            type="date"
                            required
                            value={formData.deliveryDate}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, deliveryDate: e.target.value })}
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </div>

                    {/* Dedication Text */}
                    <div className="space-y-2">
                        <Label htmlFor="dedication">Mensaje de Dedicatoria (Opcional)</Label>
                        <Textarea
                            id="dedication"
                            placeholder="Escribe un mensaje especial..."
                            value={formData.dedicationText}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, dedicationText: e.target.value })}
                            rows={3}
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={() => setOpen(false)}
                            disabled={isLoading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Creando...
                                </>
                            ) : (
                                "Crear Entrega"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
