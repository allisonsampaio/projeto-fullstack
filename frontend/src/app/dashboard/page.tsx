"use client";

import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Grid,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";

interface DashboardData {
  total_orders: number;
  average_order_value: number;
  total_revenue: number;
  orders_last_7_days: { _id: string; count: number }[];
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";

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

  const handleCloseSnackbar = () => {
    setError(null);
  };

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (!dashboardData) {
    return (
      <Container>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1">Nenhum dado disponível.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ marginTop: 2 }}>
      <Typography variant="h3" gutterBottom fontWeight="bold" textAlign="center">
        Dashboard
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={4} sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
            <Typography variant="h6" color="textSecondary">
              Total de Pedidos
            </Typography>
            <Typography variant="h3" color="primary" fontWeight="bold">
              {dashboardData.total_orders}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={4} sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
            <Typography variant="h6" color="textSecondary">
              Valor Médio por Pedido
            </Typography>
            <Typography variant="h3" color="primary" fontWeight="bold">
              {formatCurrency(dashboardData.average_order_value)}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={4} sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
            <Typography variant="h6" color="textSecondary">
              Receita Total
            </Typography>
            <Typography variant="h3" color="primary" fontWeight="bold">
              {formatCurrency(dashboardData.total_revenue)}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              Pedidos nos Últimos 7 Dias
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              {dashboardData.orders_last_7_days.map((order) => (
                <Box
                  key={order._id}
                  display="flex"
                  justifyContent="space-between"
                  p={2}
                  bgcolor="#f5f5f5"
                  borderRadius={2}
                >
                  <Typography>{order._id}</Typography>
                  <Typography fontWeight="bold" color="primary">
                    {order.count} pedidos
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default DashboardPage;