import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Users, Cake } from "lucide-react";
import { getCustomers, getUpcomingBirthdays } from "@/app/actions/customers";
import { format, differenceInDays } from "date-fns";
import { es } from "date-fns/locale";

export default async function CustomersPage() {
    const [customers, upcomingBirthdays] = await Promise.all([
        getCustomers(),
        getUpcomingBirthdays(),
    ]);

    return (
        <main className="p-4 space-y-4 max-w-2xl mx-auto pb-24">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-1">Clientes</h1>
                    <p className="text-slate-600">Gestión de contactos</p>
                </div>
                <Link href="/customers/new">
                    <Button size="lg" className="rounded-full h-14 w-14 p-0">
                        <Plus className="w-6 h-6" />
                    </Button>
                </Link>
            </div>

            {/* Upcoming Birthdays */}
            {upcomingBirthdays.length > 0 && (
                <Card className="bg-gradient-to-br from-petal-purple/20 to-petal-pink/20 border-petal-purple">
                    <CardContent className="p-4">
                        <h2 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                            <Cake className="w-5 h-5 text-petal-pink" />
                            Próximos Cumpleaños
                        </h2>
                        <div className="space-y-2">
                            {upcomingBirthdays.map((customer: { id: string; name: string; phone: string; birthday: string | null }) => {
                                const birthday = new Date(customer.birthday!);
                                const thisYearBirthday = new Date(
                                    new Date().getFullYear(),
                                    birthday.getMonth(),
                                    birthday.getDate()
                                );
                                const daysUntil = differenceInDays(thisYearBirthday, new Date());

                                return (
                                    <div key={customer.id} className="flex items-center justify-between bg-white rounded-lg p-3">
                                        <div>
                                            <p className="font-medium text-slate-800">{customer.name}</p>
                                            <p className="text-sm text-slate-600">{customer.phone}</p>
                                        </div>
                                        <Badge variant="default">
                                            {daysUntil === 0 ? "¡Hoy!" : `En ${daysUntil} días`}
                                        </Badge>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Customers List */}
            {customers.length === 0 ? (
                <Card>
                    <CardContent className="p-8 text-center">
                        <Users className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                        <p className="text-slate-600 mb-4">No hay clientes registrados</p>
                        <Link href="/customers/new">
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Agregar Cliente
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    <h2 className="text-lg font-semibold text-slate-800 px-1">
                        Todos los Clientes ({customers.length})
                    </h2>
                    {customers.map((customer: { id: string; name: string; phone: string; email?: string; birthday?: string }) => (
                        <Card key={customer.id} className="hover:border-petal-pink transition-colors">
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg text-slate-800 mb-1">
                                            {customer.name}
                                        </h3>
                                        <p className="text-sm text-slate-600 mb-1">{customer.phone}</p>
                                        {customer.email && (
                                            <p className="text-sm text-slate-500">{customer.email}</p>
                                        )}
                                        {customer.birthday && (
                                            <div className="flex items-center gap-1 mt-2">
                                                <Cake className="w-4 h-4 text-petal-pink" />
                                                <span className="text-sm text-slate-600">
                                                    {format(new Date(customer.birthday), "d 'de' MMMM", { locale: es })}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </main>
    );
}
