export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            customers: {
                Row: {
                    id: string
                    name: string
                    phone: string
                    email: string | null
                    birthday: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    phone: string
                    email?: string | null
                    birthday?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    phone?: string
                    email?: string | null
                    birthday?: string | null
                    created_at?: string
                }
            }
            products: {
                Row: {
                    id: string
                    name: string
                    category: string
                    stock_quantity: number
                    price: number
                    expiry_date: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    category: string
                    stock_quantity: number
                    price: number
                    expiry_date: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    category?: string
                    stock_quantity?: number
                    price?: number
                    expiry_date?: string
                    created_at?: string
                }
            }
            sales: {
                Row: {
                    id: string
                    customer_id: string | null
                    total_amount: number
                    payment_method: string
                    sale_date: string
                    items: Json
                }
                Insert: {
                    id?: string
                    customer_id?: string | null
                    total_amount: number
                    payment_method: string
                    sale_date?: string
                    items: Json
                }
                Update: {
                    id?: string
                    customer_id?: string | null
                    total_amount?: number
                    payment_method?: string
                    sale_date?: string
                    items?: Json
                }
            }
            orders: {
                Row: {
                    id: string
                    sale_id: string | null
                    customer_id: string
                    delivery_address: string
                    delivery_date: string
                    dedication_text: string | null
                    status: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    sale_id?: string | null
                    customer_id: string
                    delivery_address: string
                    delivery_date: string
                    dedication_text?: string | null
                    status?: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    sale_id?: string | null
                    customer_id?: string
                    delivery_address?: string
                    delivery_date?: string
                    dedication_text?: string | null
                    status?: string
                    created_at?: string
                }
            }
        }
    }
}
