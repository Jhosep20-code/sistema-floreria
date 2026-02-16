"use server";

import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getCustomers() {
    const supabase = createServerClient();

    const { data, error } = await (supabase as any)
        .from("Clientes")
        .select("*")
        .order("name", { ascending: true });

    if (error) {
        console.error("Error fetching customers:", error);
        return [];
    }

    return data;
}

export async function createCustomer(customerData: {
    name: string;
    phone: string;
    email?: string;
    birthday?: string;
}) {
    const supabase = createServerClient();

    const { error } = await (supabase as any)
        .from("Clientes")
        .insert(customerData);

    if (error) {
        console.error("Error creating customer:", error);
        return { success: false, error: "No se pudo crear el cliente" };
    }

    revalidatePath("/customers");

    return { success: true };
}

export async function getUpcomingBirthdays() {
    const supabase = createServerClient();

    const today = new Date();
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(today.getDate() + 7);

    const { data, error } = await (supabase as any)
        .from("Clientes")
        .select("*")
        .not("birthday", "is", null)
        .order("birthday", { ascending: true });

    if (error) {
        console.error("Error fetching upcoming birthdays:", error);
        return [];
    }

    // Filter birthdays within next 7 days (considering the month/day only)
    const upcomingBirthdays = data.filter((customer: any) => {
        if (!customer.birthday) return false;

        const birthday = new Date(customer.birthday);
        const thisYearBirthday = new Date(
            today.getFullYear(),
            birthday.getMonth(),
            birthday.getDate()
        );

        return thisYearBirthday >= today && thisYearBirthday <= sevenDaysLater;
    });

    return upcomingBirthdays;
}
