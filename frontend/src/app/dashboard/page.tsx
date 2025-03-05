"use client";

import React from "react";
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
import useDashboardData from "../../hooks/useDashboardData";

const formatCurrency = (value?: number) => {
  if (value === undefined || value === null) return "R$ 0,00";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
};

const DashboardPage = () => {
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";
  const { dashboardData, loading, error, clearError } = useDashboardData(apiUrl);

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
          <CircularProgress size={60} aria-label="Carregando dados do dashboard" />
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
        {[
          { label: "Total de Pedidos", value: dashboardData.total_orders },
          { label: "Valor Médio por Pedido", value: formatCurrency(dashboardData.average_order_value) },
          { label: "Receita Total", value: formatCurrency(dashboardData.total_revenue) },
        ].map(({ label, value }, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper elevation={4} sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
              <Typography variant="h6" color="textSecondary">
                {label}
              </Typography>
              <Typography variant="h3" color="primary" fontWeight="bold">
                {value}
              </Typography>
            </Paper>
          </Grid>
        ))}

        <Grid item xs={12}>
          <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              Pedidos nos Últimos 7 Dias
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              {dashboardData.orders_last_7_days.length > 0 ? (
                dashboardData.orders_last_7_days.map((order) => (
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
                ))
              ) : (
                <Typography variant="body1" textAlign="center" color="textSecondary">
                  Nenhum pedido registrado nos últimos 7 dias.
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar open={!!error} autoHideDuration={6000} onClose={clearError}>
        <Alert onClose={clearError} severity="error" aria-live="polite">
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default DashboardPage;
