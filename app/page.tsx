import { Suspense } from "react";
import ExpiryAlerts from "@/components/dashboard/expiry-alerts";
import DeliveryAlerts from "@/components/dashboard/delivery-alerts";
import StatsCards from "@/components/dashboard/stats-cards";
import { getExpiringProducts, getPendingDeliveries, getTodayStats } from "@/app/actions/dashboard";
import { Card, CardContent } from "@/components/ui/card";

export default async function Home() {
    const [expiringProducts, pendingDeliveries, stats] = await Promise.all([
        getExpiringProducts(),
        getPendingDeliveries(),
        getTodayStats(),
    ]);

    return (
        <main className="p-4 space-y-6 max-w-2xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-800 mb-1">
                    Amor en Pétalos
                </h1>
                <p className="text-slate-600">Panel de Control</p>
            </div>

            {/* Quick Stats */}
            <StatsCards stats={stats} />

            {/* Expiring Products Alert */}
            {expiringProducts.length > 0 && (
                <ExpiryAlerts products={expiringProducts} />
            )}

            {/* Pending Deliveries */}
            <DeliveryAlerts orders={pendingDeliveries} />
        </main>
    );
}
