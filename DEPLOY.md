# 🚀 Guia de Deploy - Central de Equipamentos TI

Sistema completo hospedado em plataformas gratuitas:
- **Frontend:** Vercel
- **Backend + Banco:** Render.com

---

## 📋 Pré-requisitos

1. Conta no GitHub (para conectar aos serviços)
2. Conta no Vercel: https://vercel.com/signup
3. Conta no Render: https://render.com/register

---

## 🔧 Parte 1: Deploy do Backend (Render.com)

### 1.1. Fazer Push do Código para o GitHub

```bash
git add .
git commit -m "Preparar para deploy em produção"
git push origin main
```

### 1.2. Criar Web Service no Render

1. Acesse: https://dashboard.render.com/
2. Clique em **"New +"** → **"Web Service"**
3. Conecte seu repositório GitHub
4. Configure:
   - **Name:** `totem-equipamentos-api`
   - **Region:** Escolha o mais próximo (ex: Oregon)
   - **Branch:** `main` ou `master`
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free`

5. **Environment Variables** (Variáveis de Ambiente):
   - Clique em **"Advanced"**
   - Adicione:
     ```
     NODE_ENV = production
     ```

6. Clique em **"Create Web Service"**

### 1.3. Aguardar Deploy

- O Render vai instalar as dependências e iniciar o servidor
- Aguarde aparecer **"Live"** (leva 2-5 minutos)
- Anote a URL gerada, exemplo:
  ```
  https://totem-equipamentos-api.onrender.com
  ```

### 1.4. Testar Backend

Acesse no navegador:
```
https://SEU-BACKEND.onrender.com/api/health
```

Deve retornar:
```json
{
  "status": "ok",
  "message": "Backend da Central de Equipamentos TI funcionando",
  "timestamp": "2026-05-19T..."
}
```

✅ **Backend OK!**

---

## 🎨 Parte 2: Deploy do Frontend (Vercel)

### 2.1. Atualizar URL da API

Edite o arquivo `.env.production`:

```env
VITE_API_URL=https://SEU-BACKEND.onrender.com/api
```

⚠️ **IMPORTANTE:** Substitua `SEU-BACKEND` pela URL real do Render!

Exemplo:
```env
VITE_API_URL=https://totem-equipamentos-api.onrender.com/api
```

### 2.2. Commit da Mudança

```bash
git add .env.production
git commit -m "Configurar URL da API para produção"
git push origin main
```

### 2.3. Criar Projeto no Vercel

#### Opção A: Via Dashboard Web

1. Acesse: https://vercel.com/new
2. Clique em **"Import Git Repository"**
3. Selecione seu repositório `totem-equipamentos`
4. Configure:
   - **Project Name:** `totem-equipamentos`
   - **Framework Preset:** `Vite`
   - **Root Directory:** `./` (raiz)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

5. **Environment Variables:**
   - Clique em **"Environment Variables"**
   - Adicione:
     ```
     VITE_API_URL = https://SEU-BACKEND.onrender.com/api
     ```

6. Clique em **"Deploy"**

#### Opção B: Via CLI (Terminal)

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

Responda as perguntas:
- Set up and deploy? → **Y**
- Which scope? → Sua conta
- Link to existing project? → **N**
- Project name? → `totem-equipamentos`
- Directory? → `./` (Enter)
- Want to override settings? → **N**

### 2.4. Aguardar Deploy

- Aguarde o build completar (2-3 minutos)
- A URL será exibida, exemplo:
  ```
  https://totem-equipamentos.vercel.app
  ```

### 2.5. Configurar Variável de Ambiente no Backend (Render)

Volte no Render e adicione a URL do frontend:

1. Acesse seu Web Service no Render
2. Vá em **"Environment"**
3. Adicione:
   ```
   FRONTEND_URL = https://seu-projeto.vercel.app
   ```
4. Clique em **"Save Changes"**
5. O serviço vai reiniciar automaticamente

---

## ✅ Parte 3: Testar o Sistema Completo

### 3.1. Acessar o Sistema

Abra no navegador:
```
https://seu-projeto.vercel.app
```

### 3.2. Testar Fluxos

#### TOTEM Self-Service
1. Acesse: `https://seu-projeto.vercel.app/totem`
2. Selecione um equipamento
3. Preencha o formulário
4. Clique em "Solicitar Equipamento"
5. ✅ Deve aparecer confirmação

#### Painel Administrativo
1. Acesse: `https://seu-projeto.vercel.app/login`
2. Login: **ADMN** / **admin123**
3. Verifique se os chamados aparecem
4. Crie um usuário analista
5. Pegue um chamado
6. ✅ Tudo deve funcionar!

---

## 🔄 Atualizações Futuras

Para atualizar o sistema:

```bash
# Fazer alterações no código
git add .
git commit -m "Descrição das mudanças"
git push origin main
```

- ✅ **Vercel** faz deploy automático
- ✅ **Render** faz deploy automático

---

## 📱 URLs Finais

Anote suas URLs:

- **Frontend (Vercel):** `https://__________.vercel.app`
- **Backend (Render):** `https://__________.onrender.com`
- **API:** `https://__________.onrender.com/api`

---

## ⚠️ Limitações do Plano Gratuito

### Render.com (Backend)
- ⏱️ **Servidor hiberna após 15 minutos sem uso**
- 🐢 **Primeira requisição após hibernar demora 30-60 segundos**
- ✅ Após "acordar", funciona normalmente
- 💾 **Banco SQLite persiste**

### Vercel (Frontend)
- ⚡ **Sem hibernação**
- ✅ Sempre rápido
- 🔄 100GB de banda por mês (suficiente)

---

## 🆘 Solução de Problemas

### Erro CORS
- Verifique se a variável `FRONTEND_URL` está configurada no Render
- Verifique se a URL está correta (sem `/` no final)

### Backend não responde
- Aguarde 60 segundos (pode estar hibernando)
- Verifique logs no Render: Dashboard → Logs

### Frontend não conecta na API
- Verifique `.env.production`
- Verifique se a URL da API está correta
- Verifique se não tem `/api/api` duplicado

### Banco de dados vazio
- O banco é recriado no primeiro deploy
- Usuário padrão: **ADMN** / **admin123**

---

## 🎉 Pronto!

Seu sistema está no ar e pode ser acessado de qualquer dispositivo (celular, tablet, PC) via internet!

**Compartilhe a URL:**
```
https://seu-projeto.vercel.app/totem
```

✨ **Sistema Enterprise Profissional Funcionando!**
