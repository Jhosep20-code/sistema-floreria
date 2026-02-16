import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Package, AlertTriangle } from "lucide-react";
import { getProducts } from "@/app/actions/products";
import { differenceInDays, format } from "date-fns";
import { es } from "date-fns/locale";

export default async function ProductsPage() {
    const products = await getProducts();

    const getExpiryStatus = (expiryDate: string) => {
        const days = differenceInDays(new Date(expiryDate), new Date());

        if (days <= 1) return { variant: "destructive" as const, label: "¡Expira hoy!" };
        if (days <= 2) return { variant: "warning" as const, label: `Expira en ${days} días` };
        if (days <= 3) return { variant: "warning" as const, label: `Expira en ${days} días` };
        return { variant: "default" as const, label: format(new Date(expiryDate), "PPP", { locale: es }) };
    };

    const getStockStatus = (stock: number) => {
        if (stock === 0) return { variant: "destructive" as const, label: "Sin stock" };
        if (stock < 5) return { variant: "warning" as const, label: `${stock} unidades` };
        if (stock < 10) return { variant: "secondary" as const, label: `${stock} unidades` };
        return { variant: "success" as const, label: `${stock} unidades` };
    };

    return (
        <main className="p-4 space-y-4 max-w-2xl mx-auto pb-24">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-1">Productos</h1>
                    <p className="text-slate-600">Inventario de flores</p>
                </div>
                <Link href="/products/new">
                    <Button size="lg" className="rounded-full h-14 w-14 p-0">
                        <Plus className="w-6 h-6" />
                    </Button>
                </Link>
            </div>

            {products.length === 0 ? (
                <Card>
                    <CardContent className="p-8 text-center">
                        <Package className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                        <p className="text-slate-600 mb-4">No hay productos registrados</p>
                        <Link href="/products/new">
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Agregar Producto
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {products.map((product: { id: string; name: string; category: string; price: number; stock_quantity: number; expiry_date: string }) => {
                        const expiryStatus = getExpiryStatus(product.expiry_date);
                        const stockStatus = getStockStatus(product.stock_quantity);
                        const isUrgent = expiryStatus.variant === "destructive" || expiryStatus.variant === "warning";

                        return (
                            <Card
                                key={product.id}
                                className={`${isUrgent ? "border-2 border-amber-500" : ""} hover:border-petal-pink transition-colors`}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                {isUrgent && <AlertTriangle className="w-5 h-5 text-amber-600" />}
                                                <h3 className="font-semibold text-lg text-slate-800">
                                                    {product.name}
                                                </h3>
                                            </div>

                                            <div className="flex gap-2 flex-wrap">
                                                <Badge variant="outline">{product.category}</Badge>
                                                <Badge variant={stockStatus.variant}>
                                                    {stockStatus.label}
                                                </Badge>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm text-slate-600">Precio:</p>
                                                    <p className="text-xl font-bold text-petal-pink">
                                                        S/ {product.price.toFixed(2)}
                                                    </p>
                                                </div>

                                                <div className="text-right">
                                                    <p className="text-sm text-slate-600">Vencimiento:</p>
                                                    <Badge variant={expiryStatus.variant}>
                                                        {expiryStatus.label}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </main>
    );
}
