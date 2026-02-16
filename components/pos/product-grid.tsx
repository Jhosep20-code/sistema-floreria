"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    stock_quantity: number;
    expiry_date: string;
}

interface ProductGridProps {
    products: Product[];
    onAddToCart: (product: Product) => void;
}

export default function ProductGrid({ products, onAddToCart }: ProductGridProps) {
    const getStockColor = (stock: number) => {
        if (stock > 10) return "success";
        if (stock >= 5) return "warning";
        return "destructive";
    };

    // Group products by category
    const productsByCategory = products.reduce((acc, product) => {
        if (!acc[product.category]) {
            acc[product.category] = [];
        }
        acc[product.category].push(product);
        return acc;
    }, {} as Record<string, Product[]>);

    return (
        <div className="space-y-4">
            {Object.entries(productsByCategory).map(([category, categoryProducts]) => (
                <div key={category}>
                    <h3 className="text-sm font-semibold text-slate-600 mb-2 px-1">
                        {category}
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        {categoryProducts.map((product) => (
                            <Card
                                key={product.id}
                                className="relative overflow-hidden hover:border-petal-pink transition-colors"
                            >
                                <div className="p-4">
                                    <div className="mb-3">
                                        <h4 className="font-semibold text-slate-800 text-sm mb-1 line-clamp-2">
                                            {product.name}
                                        </h4>
                                        <p className="text-lg font-bold text-petal-pink">
                                            S/ {product.price.toFixed(2)}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between gap-2">
                                        <Badge
                                            variant={getStockColor(product.stock_quantity)}
                                            className="text-xs"
                                        >
                                            {product.stock_quantity} unid.
                                        </Badge>

                                        <Button
                                            size="icon"
                                            onClick={() => onAddToCart(product)}
                                            className="h-10 w-10 rounded-full bg-petal-pink hover:bg-petal-pink/90"
                                        >
                                            <Plus className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
