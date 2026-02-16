"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smartphone, Banknote, Check } from "lucide-react";

const paymentMethods = [
    { id: "Yape", label: "Yape", icon: Smartphone, color: "bg-purple-100 border-purple-300 text-purple-700" },
    { id: "Plin", label: "Plin", icon: Smartphone, color: "bg-blue-100 border-blue-300 text-blue-700" },
    { id: "Efectivo", label: "Efectivo", icon: Banknote, color: "bg-green-100 border-green-300 text-green-700" },
];

interface PaymentSelectorProps {
    selectedMethod: string;
    onSelect: (method: string) => void;
    onComplete: () => void;
    disabled: boolean;
    isProcessing: boolean;
}

export default function PaymentSelector({
    selectedMethod,
    onSelect,
    onComplete,
    disabled,
    isProcessing,
}: PaymentSelectorProps) {
    return (
        <Card>
            <CardContent className="p-4 space-y-4">
                <h3 className="font-semibold text-slate-800">Método de Pago</h3>

                <div className="grid grid-cols-3 gap-2">
                    {paymentMethods.map((method) => {
                        const Icon = method.icon;
                        const isSelected = selectedMethod === method.id;

                        return (
                            <button
                                key={method.id}
                                onClick={() => onSelect(method.id)}
                                disabled={disabled}
                                className={`
                  relative p-3 rounded-lg border-2 transition-all
                  ${isSelected
                                        ? method.color + " ring-2 ring-offset-2 ring-petal-pink"
                                        : "bg-white border-slate-200 hover:border-petal-pink"
                                    }
                  ${disabled ? "opacity-50 cursor-not-allowed" : "active:scale-95"}
                `}
                            >
                                {isSelected && (
                                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-petal-pink rounded-full flex items-center justify-center">
                                        <Check className="w-4 h-4 text-white" />
                                    </div>
                                )}
                                <Icon className="w-6 h-6 mx-auto mb-1" />
                                <p className="text-xs font-medium">{method.label}</p>
                            </button>
                        );
                    })}
                </div>

                <Button
                    onClick={onComplete}
                    disabled={!selectedMethod || disabled || isProcessing}
                    className="w-full h-14 text-base font-semibold"
                    size="lg"
                >
                    {isProcessing ? "Procesando..." : "Completar Venta"}
                </Button>
            </CardContent>
        </Card>
    );
}
