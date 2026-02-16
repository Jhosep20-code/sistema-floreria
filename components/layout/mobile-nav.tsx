"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingCart, Truck, Package, Users } from "lucide-react";

const navItems = [
    { href: "/", icon: Home, label: "Inicio" },
    { href: "/pos", icon: ShoppingCart, label: "POS" },
    { href: "/delivery", icon: Truck, label: "Delivery" },
    { href: "/products", icon: Package, label: "Productos" },
    { href: "/customers", icon: Users, label: "Clientes" },
];

export default function MobileNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-rose-200 safe-area-pb z-50">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${isActive
                                    ? "text-petal-pink"
                                    : "text-slate-500 hover:text-petal-pink"
                                }`}
                        >
                            <Icon className="w-6 h-6 mb-1" />
                            <span className="text-xs font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
