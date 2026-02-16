"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Minus, Plus, X, ShoppingCart } from "lucide-react";

interface CartItem {
    product_id: string;
    name: string;
    price: number;
    quantity: number;
}

interface CartSummaryProps {
    items: CartItem[];
    onUpdateQuantity: (productId: string, change: number) => void;
    onRemoveItem: (productId: string) => void;
    onClear: () => void;
}

export default function CartSummary({
    items,
    onUpdateQuantity,
    onRemoveItem,
    onClear,
}: CartSummaryProps) {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (items.length === 0) {
        return (
            <Card className="sticky bottom-0 border-t-2 border-petal-pink">
                <CardContent className="p-4">
                    <div className="text-center text-slate-500 py-6">
                        <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Carrito vacío</p>
                        <p className="text-xs mt-1">Agrega productos para empezar</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="sticky bottom-0 border-t-2 border-petal-pink max-h-80 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Carrito ({items.length})
                </h3>
                <Button variant="ghost" size="sm" onClick={onClear} className="text-red-500 hover:text-red-600">
                    Limpiar
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-48">
                {items.map((item) => (
                    <div key={item.product_id} className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 last:border-0">
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-slate-800 truncate mb-1">
                                {item.name}
                            </p>
                            <p className="text-sm text-slate-600">
                                S/ {item.price.toFixed(2)} × {item.quantity}
                            </p>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                            <div className="flex items-center gap-1 bg-slate-100 rounded-lg">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onUpdateQuantity(item.product_id, -1)}
                                    className="h-8 w-8"
                                >
                                    <Minus className="w-3 h-3" />
                                </Button>
                                <span className="text-sm font-semibold w-6 text-center">
                                    {item.quantity}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onUpdateQuantity(item.product_id, 1)}
                                    className="h-8 w-8"
                                >
                                    <Plus className="w-3 h-3" />
                                </Button>
                            </div>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onRemoveItem(item.product_id)}
                                className="h-8 w-8 text-red-500 hover:text-red-600"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 bg-rose-50 border-t">
                <div className="flex items-baseline justify-between mb-2">
                    <span className="text-slate-700 font-medium">Total:</span>
                    <span className="text-3xl font-bold text-slate-800">
                        S/ {total.toFixed(2)}
                    </span>
                </div>
            </div>
        </Card>
    );
}
