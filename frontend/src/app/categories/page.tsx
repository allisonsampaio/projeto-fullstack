"use client";

import React, { useState, useCallback } from "react";
import { Container, Typography, Snackbar, Alert } from "@mui/material";
import DataTable from "../../components/DataTable/DataTable";
import Form from "../../components/Form/Form";
import useCategories from "../../hooks/useCategories";

const CategoriesPage = () => {
  const [newCategory, setNewCategory] = useState("");
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";

  const { categories, error, success, setError, setSuccess, addCategory } = useCategories(apiUrl);

  const handleAddCategory = useCallback(() => {
    addCategory(newCategory);
    setNewCategory("");
  }, [addCategory, newCategory]);

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
