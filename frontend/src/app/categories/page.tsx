"use client";

import React, { useEffect, useState } from "react";
import { Container, Typography, Snackbar, Alert } from "@mui/material";
import DataTable from "../../components/DataTable/DataTable";
import Form from "../../components/Form/Form";

interface Category {
  id: number;
  name: string;
}

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${apiUrl}/categories/`);
        if (!response.ok) throw new Error("Erro ao buscar categorias");
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchCategories();
  }, [apiUrl]);

  const handleAddCategory = async () => {
    if (!newCategory) {
      setError("Preencha o nome da categoria.");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/categories/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newCategory }),
      });

      if (!response.ok) throw new Error("Erro ao adicionar categoria");

      const category = await response.json();
      setCategories([...categories, category]);
      setNewCategory("");
      setSuccess("Categoria adicionada com sucesso!");
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
        Categorias
      </Typography>

      <Form
        fields={[
          {
            name: "name",
            label: "Nome da Categoria",
            type: "text",
            required: true,
          },
        ]}
        onSubmit={handleAddCategory}
        error={error}
        success={success}
        onCloseSnackbar={handleCloseSnackbar}
        initialValues={{ name: newCategory }}
        onInputChange={(e) => setNewCategory(e.target.value)}
      />

      <DataTable
        headers={["ID", "Nome"]}
        rows={categories.map((category) => ({
          ID: category.id,
          Nome: category.name,
        }))}
      />

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

export default CategoriesPage;