"use server";

import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

interface SaleItem {
    product_id: string;
    quantity: number;
    price: number;
}

export async function getAvailableProducts() {
    const supabase = createServerClient();

    const { data, error } = await (supabase as any)
        .from("Productos")
        .select("*")
        .gt("stock_quantity", 0)
        .order("expiry_date", { ascending: true }); // FIFO: oldest first

    if (error) {
        console.error("Error fetching products:", error);
        return [];
    }

    return data;
}

export async function createSale(
    items: SaleItem[],
    paymentMethod: string,
    customerId?: string
) {
    const supabase = createServerClient();

    try {
        // Calculate total
        const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // Create sale record
        const { data: sale, error: saleError } = await (supabase as any)
            .from("Ventas")
            .insert({
                customer_id: customerId || null,
                total_amount: totalAmount,
                payment_method: paymentMethod,
                items: items,
            })
            .select()
            .single();

        if (saleError) {
            console.error("Error creating sale:", saleError);
            return { success: false, error: "No se pudo crear la venta" };
        }

        // Update product stock (decrease quantities)
        for (const item of items) {
            const { error: stockError } = await (supabase as any).rpc("decrement_stock", {
                product_id: item.product_id,
                decrement_by: item.quantity,
            });

            // If RPC doesn't exist, do it manually
            if (stockError) {
                const { data: product } = await (supabase as any)
                    .from("Productos")
                    .select("stock_quantity")
                    .eq("id", item.product_id)
                    .single();

                if (product) {
                    await (supabase as any)
                        .from("Productos")
                        .update({ stock_quantity: product.stock_quantity - item.quantity })
                        .eq("id", item.product_id);
                }
            }
        }

        revalidatePath("/pos");
        revalidatePath("/");

        return { success: true, saleId: sale.id };
    } catch (error) {
        console.error("Error in createSale:", error);
        return { success: false, error: "Error al procesar la venta" };
    }
}
