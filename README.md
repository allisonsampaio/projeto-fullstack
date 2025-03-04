# Projeto Fullstack: FastAPI + MongoDB + React

Este é um projeto fullstack que utiliza **FastAPI** no backend, **MongoDB** como banco de dados e **React** no frontend. O projeto está configurado para rodar em contêineres Docker, facilitando a execução em qualquer ambiente. Além disso, o frontend utiliza **Material-UI** para a interface e **Storybook** para documentação de componentes.

---

## Pré-requisitos

Antes de executar o projeto, certifique-se de ter instalado:

1. **Docker**: Para rodar os contêineres.
2. **Docker Compose**: Para gerenciar múltiplos contêineres.

### Como Instalar o Docker e Docker Compose

- **Docker**: Siga as instruções oficiais de instalação para o seu sistema operacional: [Instalar Docker](https://docs.docker.com/get-docker/).
- **Docker Compose**: Geralmente já vem com o Docker, mas caso precise instalar separadamente, siga as instruções: [Instalar Docker Compose](https://docs.docker.com/compose/install/).

---

## Estrutura do Projeto

A estrutura do projeto é a seguinte:

```
projeto-fullstack/
├── backend/                 # Backend (FastAPI)
│   ├── app/                 # Código principal
│   │   ├── main.py          # Ponto de entrada FastAPI
│   │   ├── models.py        # Modelos Pydantic e MongoDB
│   │   ├── routes/          # Rotas da API
│   │   │   ├── categories.py # Rotas para categorias
│   │   │   ├── dashboard.py  # Rotas para o dashboard
│   │   │   ├── orders.py     # Rotas para pedidos
│   │   │   └── products.py   # Rotas para produtos
│   │   ├── database.py      # Configuração do MongoDB
│   │   └── utils.py         # Funções utilitárias
│   ├── Dockerfile           # Dockerfile para backend
│   ├── requirements.txt     # Dependências
│   └── scripts/             # Scripts auxiliares
│       ├── init.sh          # Script de inicialização
│       └── seed_db.py       # Script para popular o banco de dados
├── docker-compose.yml       # Configuração do Docker Compose
├── frontend/                # Frontend (React com Next.js)
│   ├── Dockerfile           # Dockerfile para frontend
│   ├── package.json         # Dependências
│   └── src/                 # Código-fonte
│       ├── app/             # Páginas Next.js
│       ├── components/      # Componentes reutilizáveis
│       └── stories/         # Storybook assets
├── lambda/                  # Funções Lambda (Serverless)
│   ├── handler.py           # Função Lambda principal
│   └── serverless.yml       # Configuração do Serverless Framework
└── README.md                # Documentação
```

---

## Como Executar o Projeto

Siga os passos abaixo para rodar a aplicação usando Docker.

### 1. Clone o Repositório

Primeiro, clone o repositório para o seu ambiente local:

```bash
git clone https://github.com/allisonsampaio/projeto-fullstack.git
cd projeto-fullstack
```

### 2. Construa e Inicie os Contêineres

Use o Docker Compose para construir e iniciar os contêineres:

```bash
docker-compose up --build
```

Este comando fará o seguinte:

- Construirá as imagens Docker para o backend e o frontend.
- Iniciará os contêineres para o backend, frontend e MongoDB.
- Populará o banco de dados com dados iniciais usando o script `backend/scripts/seed_db.py`.

### 3. Acesse a Aplicação

Após os contêineres estarem em execução, você pode acessar a aplicação nos seguintes endereços:

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend (Swagger UI)**: [http://localhost:8000/docs](http://localhost:8000/docs)

### 4. Parar os Contêineres

Para parar os contêineres, execute o seguinte comando no diretório do projeto:

```bash
docker-compose down
```

Isso encerrará e removerá os contêineres, na próxima inicialização os dados do MongoDB serão deletados conforme configurado no script.

---

## Storybook

O projeto utiliza **Storybook** para documentar e testar componentes do frontend. Dois componentes principais foram documentados:

1. **DataTable**: Uma tabela reutilizável para listagem de dados.
2. **Form**: Um formulário genérico para criação e edição de entidades.

### Como Rodar o Storybook

Para rodar o Storybook localmente, siga os passos abaixo:

1. Acesse o diretório do frontend:

   ```bash
   cd frontend
   ```

2. Instale as dependências (caso ainda não tenha feito):

   ```bash
   npm install
   ```

3. Inicie o Storybook:

   ```bash
   npm run storybook
   ```

4. Acesse o Storybook no navegador:

   [http://localhost:6006](http://localhost:6006)

---

## Backend

O backend foi desenvolvido usando **FastAPI** e **MongoDB**. Ele oferece os seguintes recursos:

### Endpoints

- **Products**: CRUD para gerenciar produtos.
- **Categories**: CRUD para gerenciar categorias.
- **Orders**: CRUD para gerenciar pedidos.
- **Dashboard**: Endpoints para exibir métricas de vendas, como total de pedidos, valor médio por pedido e receita total.

### Script de População do Banco de Dados

O script `backend/scripts/seed_db.py` é executado automaticamente ao iniciar o contêiner do backend. Ele popula o banco de dados com dados fictícios para produtos, categorias e pedidos.

---

## Frontend

O frontend foi desenvolvido usando **React** e **Material-UI**. Ele consiste nas seguintes páginas:

### 1. Página de Produtos

- **Listagem**: Exibe todos os produtos cadastrados.
- **Criação**: Permite adicionar produtos, incluindo imagens.
  
![image](https://github.com/user-attachments/assets/23630c7b-de59-4d0e-bec5-1d754c6cef77)

### 2. Página de Categorias

- **Listagem**: Exibe todas as categorias cadastradas.
- **Criação**: Permite adicionar novas categorias.

![image](https://github.com/user-attachments/assets/38b256db-6fd8-483e-bfdf-5b2085ede885)

### 3. Página de Pedidos

- **Listagem**: Exibe todos os pedidos cadastrados.
- **Criação**: Permite adicionar pedidos.

![image](https://github.com/user-attachments/assets/9ace3576-cf6f-4b1f-aa89-094bef40e6cb)

### 4. Dashboard (home)

- Exibe métricas de vendas, como:
  - Quantidade total de pedidos.
  - Valor médio por pedido.
  - Receita total.
  - Pedidos por período (últimos 7 dias).

![image](https://github.com/user-attachments/assets/58cb8dbf-147b-400a-8933-bb8e0a46c459)

---

## Tecnologias Utilizadas

- **Backend**: FastAPI, MongoDB, Pydantic.
- **Frontend**: React, Material-UI, Storybook.
- **Infraestrutura**: Docker, Docker Compose.

---

## Próximos Passos

- Implementar integração com AWS (LocalStack para S3).
- Adicionar funcionalidades assíncronas usando Serverless Framework e Lambda.

---
