"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createCustomer } from "@/app/actions/customers";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewCustomerPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        birthday: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const result = await createCustomer({
            name: formData.name,
            phone: formData.phone,
            email: formData.email || undefined,
            birthday: formData.birthday || undefined,
        });

        if (result.success) {
            router.push("/customers");
        } else {
            alert(result.error || "Error al crear el cliente");
            setIsSubmitting(false);
        }
    };

    return (
        <main className="p-4 space-y-4 max-w-2xl mx-auto pb-24">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/customers">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Nuevo Cliente</h1>
                    <p className="text-slate-600">Registrar nuevo contacto</p>
                </div>
            </div>

            <Card>
                <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Nombre Completo *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-petal-pink focus:border-transparent outline-none"
                                placeholder="Ej: María González"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Teléfono *
                            </label>
                            <input
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-petal-pink focus:border-transparent outline-none"
                                placeholder="987654321"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Email (opcional)
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-petal-pink focus:border-transparent outline-none"
                                placeholder="cliente@email.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Fecha de Cumpleaños (opcional)
                            </label>
                            <input
                                type="date"
                                value={formData.birthday}
                                onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-petal-pink focus:border-transparent outline-none"
                            />
                            <p className="text-xs text-slate-500 mt-1">
                                📅 Útil para enviar recordatorios de campañas especiales
                            </p>
                        </div>

                        <div className="pt-4 space-y-3">
                            <Button
                                type="submit"
                                size="lg"
                                className="w-full h-14 text-base font-semibold"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Guardando..." : "Guardar Cliente"}
                            </Button>

                            <Link href="/customers" className="block">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="lg"
                                    className="w-full h-12"
                                    disabled={isSubmitting}
                                >
                                    Cancelar
                                </Button>
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </main>
    );
}
