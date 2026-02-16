"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProductGrid from "@/components/pos/product-grid";
import CartSummary from "@/components/pos/cart-summary";
import PaymentSelector from "@/components/pos/payment-selector";
import { getAvailableProducts } from "@/app/actions/sales";
import { createSale } from "@/app/actions/sales";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";

interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    stock_quantity: number;
    expiry_date: string;
}

interface CartItem {
    product_id: string;
    name: string;
    price: number;
    quantity: number;
    max_stock: number;
}

export default function POSPage() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        const data = await getAvailableProducts();
        setProducts(data);
    };

    const handleAddToCart = (product: Product) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.product_id === product.id);

            if (existingItem) {
                // Don't exceed available stock
                if (existingItem.quantity >= existingItem.max_stock) {
                    return prevCart;
                }

                return prevCart.map((item) =>
                    item.product_id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            return [
                ...prevCart,
                {
                    product_id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: 1,
                    max_stock: product.stock_quantity,
                },
            ];
        });
    };

    const handleUpdateQuantity = (productId: string, change: number) => {
        setCart((prevCart) => {
            return prevCart
                .map((item) => {
                    if (item.product_id === productId) {
                        const newQuantity = item.quantity + change;

                        // Remove if quantity becomes 0 or less
                        if (newQuantity <= 0) return null;

                        // Don't exceed max stock
                        if (newQuantity > item.max_stock) return item;

                        return { ...item, quantity: newQuantity };
                    }
                    return item;
                })
                .filter((item): item is CartItem => item !== null);
        });
    };

    const handleRemoveItem = (productId: string) => {
        setCart((prevCart) => prevCart.filter((item) => item.product_id !== productId));
    };

    const handleClearCart = () => {
        setCart([]);
        setPaymentMethod("");
    };

    const handleCompleteSale = async () => {
        if (!paymentMethod || cart.length === 0) return;

        setIsProcessing(true);

        const saleItems = cart.map((item) => ({
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
        }));

        const result = await createSale(saleItems, paymentMethod);

        if (result.success) {
            setShowSuccess(true);
            setCart([]);
            setPaymentMethod("");

            // Reload products to update stock
            await loadProducts();

            // Hide success message after 3 seconds
            setTimeout(() => {
                setShowSuccess(false);
            }, 3000);
        } else {
            alert(result.error || "Error al procesar la venta");
        }

        setIsProcessing(false);
    };

    return (
        <main className="p-4 space-y-4 max-w-2xl mx-auto pb-24">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-800 mb-1">Punto de Venta</h1>
                <p className="text-slate-600">Venta rápida de productos</p>
            </div>

            {showSuccess && (
                <Alert variant="success" className="animate-in fade-in slide-in-from-top">
                    <AlertTitle className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        ¡Venta completada!
                    </AlertTitle>
                    <AlertDescription>
                        La venta se registró correctamente
                    </AlertDescription>
                </Alert>
            )}

            <ProductGrid products={products} onAddToCart={handleAddToCart} />

            <div className="space-y-4">
                <CartSummary
                    items={cart}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemoveItem={handleRemoveItem}
                    onClear={handleClearCart}
                />

                {cart.length > 0 && (
                    <PaymentSelector
                        selectedMethod={paymentMethod}
                        onSelect={setPaymentMethod}
                        onComplete={handleCompleteSale}
                        disabled={cart.length === 0}
                        isProcessing={isProcessing}
                    />
                )}
            </div>
        </main>
    );
}
