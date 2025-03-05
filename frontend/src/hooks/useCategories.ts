import { useState, useEffect } from "react";

interface Category {
  id: number;
  name: string;
}

const useCategories = (apiUrl: string) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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

  const addCategory = async (name: string) => {
    if (!name) {
      setError("Preencha o nome da categoria.");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/categories/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) throw new Error("Erro ao adicionar categoria");

      const category = await response.json();
      setCategories((prevCategories) => [...prevCategories, category]);
      setSuccess("Categoria adicionada com sucesso!");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return { categories, error, success, setError, setSuccess, addCategory };
};

export default useCategories;
