"use client";
import { getStats } from "@/actions/admin";
import DataCards from "@/components/custom/admin/DataCards";
import { Overview } from "@/components/custom/admin/Overview";
import { RecentSales } from "@/components/custom/admin/RecentSales";
import Loader from "@/components/Loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";
import { Stats } from "@/types/admin";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPageContent() {
  const { auth, isLoggedIn, token } = useAuthStore();
  const [stats, setStats] = useState<Stats>();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setIsLoading(true);
    if (isLoggedIn) {
      if (!auth) {
        router.push("/404");
      }
    }
    (async () => {
      const data = await getStats(token);
      if (!("error" in data)) {
        setStats(data);
      }
      setIsLoading(false);
    })();
  }, []);
  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center">
          <Loader size="lg" />
        </div>
      ) : (
        <div className="space-y-8">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <h3 className="text-2xl  font-semibold">Estadísticas del ultimo mes</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats?.cards.map((card, index) => (
              <DataCards card={card} key={index} />
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Resumen</CardTitle>
              </CardHeader>
              {stats?.datosMensuales && (
                <CardContent className="pl-5">
                  <Overview data={stats?.datosMensuales} />
                </CardContent>
              )}
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Ventas Recientes</CardTitle>
                <CardContent>
                  {stats?.ventasRecientes && (
                    <RecentSales sales={stats?.ventasRecientes} />
                  )}
                </CardContent>
              </CardHeader>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}
