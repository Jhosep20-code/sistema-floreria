"use server";

import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getProducts() {
    const supabase = createServerClient();

    const { data, error } = await supabase
        .from("Productos")
        .select("*")
        .order("expiry_date", { ascending: true });

    if (error) {
        console.error("Error fetching products:", error);
        return [];
    }

    return data;
}

export async function createProduct(productData: {
    name: string;
    category: string;
    stock_quantity: number;
    price: number;
    expiry_date: string;
}) {
    const supabase = createServerClient();

    const { error } = await (supabase as any)
        .from("Productos")
        .insert(productData);

    if (error) {
        console.error("Error creating product:", error);
        return { success: false, error: "No se pudo crear el producto" };
    }

    revalidatePath("/products");
    revalidatePath("/pos");
    revalidatePath("/");

    return { success: true };
}

export async function updateProduct(
    id: string,
    productData: {
        name?: string;
        category?: string;
        stock_quantity?: number;
        price?: number;
        expiry_date?: string;
    }
) {
    const supabase = createServerClient();

    const { error } = await (supabase as any)
        .from("Productos")
        .update(productData)
        .eq("id", id);

    if (error) {
        console.error("Error updating product:", error);
        return { success: false, error: "No se pudo actualizar el producto" };
    }

    revalidatePath("/products");
    revalidatePath("/pos");
    revalidatePath("/");

    return { success: true };
}
