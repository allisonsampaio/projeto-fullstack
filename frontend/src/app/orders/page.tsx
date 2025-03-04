"use client";

import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert,
  Pagination,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
} from "@mui/material";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category_ids: string[];
  image_url: string;
}

interface Order {
  id: string;
  date: string;
  total: number;
  product_ids: string[];
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [newOrder, setNewOrder] = useState<Omit<Order, "id">>({
    date: "",
    total: 0,
    product_ids: [],
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [productsPerPage] = useState<number>(6);

  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${apiUrl}/orders/`);
        if (!response.ok) throw new Error("Erro ao buscar pedidos");
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchOrders();
  }, [apiUrl]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${apiUrl}/products/`);
        if (!response.ok) throw new Error("Erro ao buscar produtos");
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [apiUrl]);

  useEffect(() => {
    const total = products
      .filter((product) => newOrder.product_ids.includes(product.id))
      .reduce((acc, product) => acc + product.price, 0);

    setNewOrder((prevOrder) => ({
      ...prevOrder,
      total,
    }));
  }, [newOrder.product_ids, products]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewOrder({ ...newOrder, [name]: value });
  };

  const handleProductChange = (productId: string, checked: boolean) => {
    setNewOrder((prevOrder) => {
      const updatedProductIds = checked
        ? [...prevOrder.product_ids, productId]
        : prevOrder.product_ids.filter((id) => id !== productId);

      return { ...prevOrder, product_ids: updatedProductIds };
    });
  };

  const handleAddOrder = async () => {
    if (!newOrder.date || newOrder.product_ids.length === 0) {
      setError("Preencha todos os campos corretamente.");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/orders/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newOrder),
      });

      if (!response.ok) throw new Error("Erro ao adicionar pedido");

      const order = await response.json();
      setOrders([...orders, order]);
      setNewOrder({ date: "", total: 0, product_ids: [] });
      setSuccess("Pedido adicionado com sucesso!");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccess(null);
  };

  const indexOfLastProduct = page * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <Container sx={{ marginTop: 2 }}>
      <Typography variant="h3" gutterBottom fontWeight="bold" textAlign="center">
        Pedidos
      </Typography>

      <Box component="form" sx={{ mb: 4 }}>
        <TextField
          label="Data"
          name="date"
          type="date"
          value={newOrder.date}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          required
        />

        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Selecione os Produtos
        </Typography>

        <Grid container spacing={3}>
          {loading ? (
            <CircularProgress />
          ) : (
            currentProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={product.image_url || "https://placehold.co/400"}
                    alt={product.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="div">
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatCurrency(product.price)}
                    </Typography>
                  </CardContent>
                  <Box sx={{ p: 2 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={newOrder.product_ids.includes(product.id)}
                          onChange={(e) =>
                            handleProductChange(product.id, e.target.checked)
                          }
                        />
                      }
                      label="Adicionar"
                      sx={{ width: '100%' }}
                    />
                  </Box>
                </Card>
              </Grid>
            ))
          )}
        </Grid>

        <Pagination
          count={Math.ceil(products.length / productsPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
          sx={{ mt: 4, display: "flex", justifyContent: "center" }}
        />

        <TextField
          label="Total"
          name="total"
          type="number"
          value={newOrder.total}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          required
          disabled
          InputProps={{
            readOnly: true,
          }}
        />

        <Button variant="contained" color="primary" onClick={handleAddOrder}>
          Adicionar Pedido
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{formatDate(order.date)}</TableCell>
                <TableCell>{formatCurrency(order.total)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error">
          {error}
        </Alert>
      </Snackbar>

      <Snackbar open={!!success} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success">
          {success}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default OrdersPage;
