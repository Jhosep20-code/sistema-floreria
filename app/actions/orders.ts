"use server";

import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getOrderDetails(orderId: string) {
    const supabase = createServerClient();

    const { data, error } = await (supabase as any)
        .from("Orden")
        .select(`
      *,
      Clientes (
        name,
        phone,
        email
      ),
      Ventas (
        total_amount,
        payment_method,
        items
      )
    `)
        .eq("id", orderId)
        .single();

    if (error) {
        console.error("Error fetching order details:", error);
        return null;
    }

    return data;
}

export async function getTodayDeliveries() {
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
        .order("created_at", { ascending: true });

    if (error) {
        console.error("Error fetching today's deliveries:", error);
        return [];
    }

    return data;
}

export async function getAllDeliveries(status?: string) {
    const supabase = createServerClient();

    let query = (supabase as any)
        .from("Orden")
        .select(`
      *,
      Clientes (
        name,
        phone
      )
    `)
        .order("delivery_date", { ascending: false })
        .order("created_at", { ascending: true });

    if (status && status !== "Todos") {
        query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Error fetching deliveries:", error);
        return [];
    }

    return data;
}

export async function updateOrderStatus(orderId: string, newStatus: string) {
    const supabase = createServerClient();

    const { error } = await (supabase as any)
        .from("Orden")
        .update({ status: newStatus })
        .eq("id", orderId);

    if (error) {
        console.error("Error updating order status:", error);
        return { success: false, error: "No se pudo actualizar el estado" };
    }

    revalidatePath("/delivery");
    revalidatePath(`/delivery/${orderId}`);
    revalidatePath("/");

    return { success: true };
}

export async function createDeliveryOrder({
    customerId,
    deliveryAddress,
    deliveryDate,
    dedicationText,
    saleId,
}: {
    customerId: string;
    deliveryAddress: string;
    deliveryDate: string;
    dedicationText?: string;
    saleId?: string;
}) {
    const supabase = createServerClient();

    const { data, error } = await (supabase as any)
        .from("Orden")
        .insert({
            customer_id: customerId,
            delivery_address: deliveryAddress,
            delivery_date: deliveryDate,
            dedication_text: dedicationText || null,
            sale_id: saleId || null,
            status: "Pendiente",
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating delivery order:", error);
        return { success: false, error: "No se pudo crear la orden de entrega" };
    }

    revalidatePath("/delivery");
    revalidatePath("/");

    return { success: true, orderId: data.id };
}
