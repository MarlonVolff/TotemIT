# 🚀 Como Usar o Sistema Localmente

Sistema completo com SQLite rodando na sua máquina.

## 📋 Pré-requisitos

- Node.js instalado
- npm instalado

---

## ▶️ Iniciar o Sistema

### Terminal 1 - Backend

```bash
cd backend
npm start
```

Aguarde ver:
```
✅ Banco de dados inicializado
✅ Usuário padrão criado: ADMN / admin123
```

### Terminal 2 - Frontend

```bash
npm run dev
```

Aguarde ver:
```
VITE ready in XXX ms
Local: http://localhost:5173
```

---

## 🌐 Acessar o Sistema

### TOTEM Self-Service
```
http://localhost:5173/totem
```
Interface para colaboradores solicitarem equipamentos.

### Painel Administrativo
```
http://localhost:5173/login
```

**Login padrão:**
- Código: `ADMN`
- Senha: `admin123`

---

## ✅ Funcionalidades

### ✨ Totem
- Selecionar equipamento
- Preencher dados do colaborador
- Receber número do chamado
- Confirmação visual

### 🎛️ Painel Admin
- Ver todos os chamados
- Filtrar por status
- Buscar solicitações
- Criar usuários analistas
- Atribuir chamados ("Pegar")
- Alterar status

### 👥 Gerenciamento de Usuários
- Criar analistas com código de 4 letras
- Cada analista pode pegar chamados
- Sistema de login seguro

---

## 💾 Banco de Dados

Localizado em: `backend/database.sqlite`

**Para resetar:**
1. Pare o backend (Ctrl+C)
2. Delete o arquivo `backend/database.sqlite`
3. Inicie o backend novamente

---

## 🛠️ Estrutura

```
totem-equipamentos/
├── backend/              # Node.js + Express + SQLite
│   ├── src/
│   │   ├── server.js    # Servidor principal
│   │   ├── database.js  # Config SQLite
│   │   └── routes/      # APIs REST
│   └── database.sqlite  # Banco de dados
│
├── src/                  # Frontend React
│   ├── pages/           # Telas
│   ├── store/           # Estado
│   └── lib/             # Utilitários
│
└── .env                 # Configuração
```

---

## 📊 Tecnologias

- **Frontend:** React + TypeScript + Vite + TailwindCSS
- **Backend:** Node.js + Express
- **Banco:** SQLite (arquivo local)
- **Comunicação:** REST API

---

## 🆘 Solução de Problemas

### Backend não inicia
```bash
cd backend
npm install
npm start
```

### Frontend não conecta na API
- Verifique se o backend está rodando
- Verifique se está na porta 3001
- Veja o arquivo `.env`

### Erro no login
- Usuário padrão: ADMN / admin123
- Verifique se o banco foi criado

---

## 🎉 Sistema Funcionando!

Acesse:
```
http://localhost:5173
```

**Credenciais Admin:**
- Código: `ADMN`
- Senha: `admin123`

✨ **Sistema Enterprise Profissional!**
