"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createProduct } from "@/app/actions/products";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const categories = ["Rosas", "Girasoles", "Tulipanes", "Orquídeas", "Lirios", "Otros"];

export default function NewProductPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        category: "Rosas",
        stock_quantity: "",
        price: "",
        expiry_date: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const result = await createProduct({
            name: formData.name,
            category: formData.category,
            stock_quantity: parseInt(formData.stock_quantity),
            price: parseFloat(formData.price),
            expiry_date: formData.expiry_date,
        });

        if (result.success) {
            router.push("/products");
        } else {
            alert(result.error || "Error al crear el producto");
            setIsSubmitting(false);
        }
    };

    return (
        <main className="p-4 space-y-4 max-w-2xl mx-auto pb-24">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/products">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Nuevo Producto</h1>
                    <p className="text-slate-600">Agregar flores al inventario</p>
                </div>
            </div>

            <Card>
                <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Nombre del Producto *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-petal-pink focus:border-transparent outline-none"
                                placeholder="Ej: Rosas Rojas"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Categoría *
                            </label>
                            <select
                                required
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-petal-pink focus:border-transparent outline-none"
                            >
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Cantidad *
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    value={formData.stock_quantity}
                                    onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-petal-pink focus:border-transparent outline-none"
                                    placeholder="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Precio (S/) *
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-petal-pink focus:border-transparent outline-none"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Fecha de Vencimiento *
                            </label>
                            <input
                                type="date"
                                required
                                min={new Date().toISOString().split("T")[0]}
                                value={formData.expiry_date}
                                onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-petal-pink focus:border-transparent outline-none"
                            />
                        </div>

                        <div className="pt-4 space-y-3">
                            <Button
                                type="submit"
                                size="lg"
                                className="w-full h-14 text-base font-semibold"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Guardando..." : "Guardar Producto"}
                            </Button>

                            <Link href="/products" className="block">
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
