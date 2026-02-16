import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface ExpiringProduct {
    id: string;
    name: string;
    category: string;
    stock_quantity: number;
    expiry_date: string;
}

interface ExpiryAlertsProps {
    products: ExpiringProduct[];
}

export default function ExpiryAlerts({ products }: ExpiryAlertsProps) {
    if (products.length === 0) {
        return null;
    }

    const getUrgencyLevel = (expiryDate: string) => {
        const daysUntilExpiry = Math.ceil(
            (new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysUntilExpiry <= 1) return "destructive";
        if (daysUntilExpiry <= 2) return "warning";
        return "info";
    };

    return (
        <div className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-800 px-1">
                ⚠️ Productos por vencer
            </h2>

            {products.map((product) => {
                const urgency = getUrgencyLevel(product.expiry_date);
                const timeUntilExpiry = formatDistanceToNow(new Date(product.expiry_date), {
                    locale: es,
                    addSuffix: true,
                });

                return (
                    <Alert key={product.id} variant={urgency}>
                        <AlertTitle className="flex items-center justify-between">
                            <span>{product.name}</span>
                            <Badge variant="outline" className="ml-2">
                                {product.stock_quantity} unidades
                            </Badge>
                        </AlertTitle>
                        <AlertDescription>
                            <span className="font-medium">Vence {timeUntilExpiry}</span>
                            {urgency === "destructive" && (
                                <span className="block mt-1 text-xs">¡Acción urgente requerida!</span>
                            )}
                        </AlertDescription>
                    </Alert>
                );
            })}
        </div>
    );
}
