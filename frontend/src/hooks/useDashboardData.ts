import { useState, useEffect } from "react";

interface DashboardData {
  total_orders: number;
  average_order_value: number;
  total_revenue: number;
  orders_last_7_days: { _id: string; count: number }[];
}

const useDashboardData = (apiUrl: string) => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`${apiUrl}/dashboard/`);
        if (!response.ok) throw new Error("Erro ao buscar dados do dashboard");
        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [apiUrl]);

  const clearError = () => setError(null);

  return { dashboardData, loading, error, clearError };
};

export default useDashboardData;
