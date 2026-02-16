"use server";

import { createServerClient } from "@/lib/supabase/server";
import { addDays, startOfDay } from "date-fns";

export async function getExpiringProducts() {
    const supabase = createServerClient();

    const today = startOfDay(new Date());
    const threeDaysFromNow = addDays(today, 3);

    const { data, error } = await (supabase as any)
        .from("Productos")
        .select("*")
        .lte("expiry_date", threeDaysFromNow.toISOString().split("T")[0])
        .gt("stock_quantity", 0)
        .order("expiry_date", { ascending: true });

    if (error) {
        console.error("Error fetching expiring products:", error);
        return [];
    }

    return data;
}

export async function getPendingDeliveries() {
    const supabase = createServerClient();

    const today = new Date().toISOString().split("T")[0];

    const { data, error } = await (supabase as any)
        .from("Orden")
        .select(`
      *,
      Clientes (
        name,
        phone
      )
    `)
        .eq("delivery_date", today)
        .in("status", ["Pendiente", "En Ruta"])
        .order("created_at", { ascending: true });

    if (error) {
        console.error("Error fetching pending deliveries:", error);
        return [];
    }

    return data;
}

export async function getTodayStats() {
    const supabase = createServerClient();

    const today = new Date().toISOString().split("T")[0];
    const startOfToday = new Date(today).toISOString();

    // Get today's sales
    const { data: sales, error: salesError } = await (supabase as any)
        .from("Ventas")
        .select("total_amount")
        .gte("sale_date", startOfToday);

    if (salesError) {
        console.error("Error fetching today's sales:", salesError);
    }

    const totalSales = sales?.length || 0;
    const totalRevenue = sales?.reduce((sum: number, sale: any) => sum + Number(sale.total_amount), 0) || 0;

    // Get pending deliveries count
    const { data: orders, error: ordersError } = await (supabase as any)
        .from("Orden")
        .select("id", { count: "exact" })
        .eq("delivery_date", today)
        .in("status", ["Pendiente", "En Ruta"]);

    if (ordersError) {
        console.error("Error fetching pending orders:", ordersError);
    }

    const pendingDeliveries = orders?.length || 0;

    // Get low stock products (less than 10 items)
    const { data: lowStock, error: lowStockError } = await (supabase as any)
        .from("Productos")
        .select("id", { count: "exact" })
        .lt("stock_quantity", 10)
        .gt("stock_quantity", 0);

    if (lowStockError) {
        console.error("Error fetching low stock products:", lowStockError);
    }

    const lowStockCount = lowStock?.length || 0;

    return {
        totalSales,
        totalRevenue,
        pendingDeliveries,
        lowStockCount,
    };
}
