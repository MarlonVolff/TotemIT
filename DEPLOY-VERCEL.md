# 🚀 Deploy Completo no Vercel (Frontend + Backend)

Deploy tudo em um só lugar usando **Experimental Services** do Vercel.

## ⚠️ Importante

O Vercel Experimental Services ainda está em **beta** e tem limitações:
- ✅ Backend Node.js funciona
- ⚠️ SQLite pode não persistir entre deploys
- 💡 Recomendado para testes, não para produção final

---

## 📋 Pré-requisitos

1. Conta no GitHub
2. Conta no Vercel: https://vercel.com/signup
3. Código já no GitHub

---

## 🚀 Passo a Passo

### 1. Push do Código

```bash
git add .
git commit -m "Configurar para deploy no Vercel (frontend + backend)"
git push origin main
```

### 2. Importar no Vercel

1. Acesse: https://vercel.com/new
2. Clique em **"Import Git Repository"**
3. Selecione seu repositório `totem-equipamentos`
4. Configure:
   - **Project Name:** `totem-equipamentos`
   - **Framework Preset:** `Vite`
   - **Root Directory:** `./` (deixar em branco)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### 3. Configurar Variáveis de Ambiente

Adicione estas variáveis:

```env
VITE_API_URL=/_/backend/api
NODE_ENV=production
```

### 4. Deploy

Clique em **"Deploy"** e aguarde (2-5 minutos)

### 5. Acessar o Sistema

Sua URL será algo como:
```
https://totem-equipamentos-seu-usuario.vercel.app
```

**Páginas:**
- Totem: `/totem`
- Admin: `/login` (ADMN / admin123)

---

## ✅ Testar

1. Abra o site
2. Vá em `/totem`
3. Crie uma solicitação
4. Faça login em `/login` com ADMN / admin123
5. Veja se o chamado aparece

---

## ⚠️ Limitações

### SQLite no Vercel
- **Pode não persistir** entre deploys
- Cada nova versão pode perder o banco
- Para produção, considere usar PostgreSQL (Supabase)

### Solução para Persistência Real
Se os dados estão sendo perdidos, siga o guia [DEPLOY.md](DEPLOY.md) para usar:
- Frontend: Vercel
- Backend + Banco: Render (persiste SQLite)

---

## 🔄 Atualizar

Toda vez que fizer push para o GitHub:
```bash
git push origin main
```

O Vercel faz deploy automático! ✨

---

## 🆘 Problemas Comuns

### Backend não responde
- Verifique se o experimental services está habilitado
- Veja os logs no Vercel Dashboard

### Banco vazio após deploy
- Normal no Vercel serverless
- SQLite não persiste
- Use Render ou PostgreSQL para persistência

### Erro 404 na API
- Verifique se as rotas estão corretas
- URL deve ser `/_/backend/api/...`

---

## 💡 Recomendação Final

Para um sistema enterprise robusto com dados persistentes:

**Use:** [DEPLOY.md](DEPLOY.md)
- Frontend: Vercel
- Backend: Render
- Banco persiste sempre ✅

---

## 🎉 Pronto!

Sistema funcionando em:
```
https://seu-projeto.vercel.app
```

Acesse de qualquer dispositivo! 📱💻
