import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppBar, Toolbar, Typography, Button, Container, Box } from "@mui/material";
import Link from "next/link";
import "./globals.css";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sistema de Vendas",
  description: "Gerenciamento de produtos, categorias e pedidos",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppBar position="static">
          <Toolbar>
            <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
              <Image src="/assets/logo.png" alt="Logo" width={40} height={40} style={{ marginRight: 8 }} />
              <Typography variant="h6" component="div">
                Sistema de Vendas
              </Typography>
            </Box>
            <Button color="inherit" component={Link} href="/dashboard">
              Home
            </Button>
            <Button color="inherit" component={Link} href="/products">
              Produtos
            </Button>
            <Button color="inherit" component={Link} href="/categories">
              Categorias
            </Button>
            <Button color="inherit" component={Link} href="/orders">
              Pedidos
            </Button>
          </Toolbar>
        </AppBar>
        <Container>{children}</Container>
      </body>
    </html>
  );
}