"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Snackbar,
  Alert,
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category_ids: string[];
  image_url: string;
}

interface Category {
  id: string;
  name: string;
  product_ids: string[];
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({
    name: "",
    description: "",
    price: 0,
    category_ids: [],
    image_url: "",
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      try {
        const productsResponse = await fetch(`${apiUrl}/products/`);
        if (!productsResponse.ok) throw new Error("Erro ao buscar produtos");
        const productsData = await productsResponse.json();
        setProducts(productsData);

        const categoriesResponse = await fetch(`${apiUrl}/categories/`);
        if (!categoriesResponse.ok) throw new Error("Erro ao buscar categorias");
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchProductsAndCategories();
  }, [apiUrl]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleSelectChange = (event: SelectChangeEvent<string[]>) => {
    const value = Array.isArray(event.target.value) ? event.target.value : [event.target.value];
    setNewProduct({ ...newProduct, category_ids: value });
  };

  const handleAddProduct = async () => {
    const priceInNumber = parseFloat(newProduct.price.toString().replace("R$", "").replace(/\./g, "").replace(",", "."));

    if (!newProduct.name || !newProduct.description || priceInNumber <= 0 || newProduct.category_ids.length === 0) {
      setError("Preencha todos os campos corretamente.");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/products/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...newProduct, price: priceInNumber }),
      });

      if (!response.ok) throw new Error("Erro ao adicionar produto");

      const product = await response.json();
      setProducts([...products, product]);
      setNewProduct({ name: "", description: "", price: 0, category_ids: [], image_url: "" });
      setSuccess("Produto adicionado com sucesso!");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccess(null);
  };

  return (
    <Container sx={{ marginTop: 2 }}>
      <Typography variant="h3" gutterBottom fontWeight="bold" textAlign="center">
        Produtos
      </Typography>

      <Box component="form" sx={{ mb: 4 }}>
        <TextField
          label="Nome"
          name="name"
          value={newProduct.name}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Descrição"
          name="description"
          value={newProduct.description}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Preço"
          name="price"
          type="text"
          value={newProduct.price}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="URL da Imagem"
          name="image_url"
          value={newProduct.image_url}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />

        <FormControl fullWidth margin="normal" required>
          <InputLabel>Categorias</InputLabel>
          <Select
            multiple
            value={newProduct.category_ids}
            onChange={handleSelectChange}
            label="Categorias"
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button variant="contained" color="primary" onClick={handleAddProduct}>
          Adicionar Produto
        </Button>
      </Box>

      <Grid container spacing={4}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card sx={{ height: '100%' }}>
              <CardMedia
                component="img"
                alt={product.name}
                height="200"
                image={product.image_url || "https://placehold.co/400"}
                title={product.name}
                sx={{
                  objectFit: 'cover',
                  height: 200,
                }}
              />
              <CardContent sx={{ height: '100%' }}>
                <Typography variant="h6">{product.name}</Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  {product.description}
                </Typography>
                <Typography variant="h6" color="primary">
                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(product.price)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {product.category_ids
                    .map((id) => categories.find((category) => category.id === id)?.name)
                    .join(", ")}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
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

export default ProductsPage;
