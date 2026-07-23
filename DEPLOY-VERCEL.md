# 🚀 Deploy no Vercel

## ⚠️ IMPORTANTE - Limitações do SQLite no Vercel

O **SQLite não funciona em produção no Vercel** porque:
- Vercel usa **serverless functions** (sem sistema de arquivos persistente)
- Cada request cria uma nova instância
- O banco de dados SQLite seria perdido entre requests

## 🔄 Alternativas para Produção:

### Opção 1: PostgreSQL (Recomendado) ✅
Use um banco de dados cloud como:
- **Vercel Postgres** (integrado)
- **Supabase** (grátis)
- **Neon** (grátis)
- **Railway**

### Opção 2: MongoDB
- **MongoDB Atlas** (grátis)

### Opção 3: MySQL
- **PlanetScale** (grátis)

## 📝 Passos para Deploy:

### 1. Escolher e configurar banco de dados

#### Exemplo com Vercel Postgres:

```bash
# Instalar
npm install @vercel/postgres

# Criar tabelas no Vercel Postgres
# Adaptar backend/src/database.js para usar Postgres
```

### 2. Fazer commit e push

```bash
git add .
git commit -m "Preparado para deploy Vercel"
git push origin master
```

### 3. Deploy no Vercel

1. Acesse https://vercel.com
2. Importe o repositório do GitHub
3. Configure as variáveis de ambiente (DATABASE_URL, etc)
4. Deploy!

## 🛠️ Arquivos de Configuração Criados:

- ✅ `vercel.json` - Configuração do Vercel
- ✅ `api/index.js` - Serverless function
- ✅ `.vercelignore` - Arquivos ignorados no deploy

## ⚡ Para desenvolvimento local:

O SQLite funciona perfeitamente local! Continue usando:

```bash
# Backend
cd backend
npm run dev

# Frontend
npm run dev
```

## 📚 Próximos Passos:

1. Escolher banco de dados cloud
2. Migrar código do SQLite para o novo banco
3. Configurar variáveis de ambiente no Vercel
4. Deploy!
