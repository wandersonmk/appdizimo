# 🚀 Deployment Guide - App Dízimo

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Conta no Supabase configurada
- Servidor ou plataforma de hosting (Vercel, Netlify, DigitalOcean, etc.)

## 🏗️ Build de Produção

```bash
# Instalar dependências
npm install

# Fazer build
npm run build
```

## 🔧 Configuração de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# App Configuration
NUXT_PUBLIC_SUPABASE_URL=your_supabase_url
NUXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🌐 Opções de Deployment

### 1. Vercel (Recomendado para Nuxt)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### 2. Netlify

```bash
# Instalar Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=.output/public
```

### 3. Node.js Server

```bash
# Executar servidor de produção
node .output/server/index.mjs
```

### 4. Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY .output .output
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
```

## 🔒 Configuração do Supabase

### Tabelas necessárias:

1. `usuarios`
2. `transacoes_financeiras`
3. `categorias_financeiras`

### Políticas RLS:

Certifique-se de que as políticas de Row Level Security estejam configuradas para:
- Permitir leitura/escrita apenas para usuários autenticados
- Filtrar dados por `usuario_id`

## 📊 Monitoramento

- Logs disponíveis via platform de hosting
- Métricas de performance via Vercel Analytics ou similares
- Database monitoring via Supabase Dashboard

## 🚨 Troubleshooting

### Erros comuns:

1. **Supabase connection errors**: Verifique as variáveis de ambiente
2. **Build failures**: Execute `npm install` e tente novamente
3. **RLS policy errors**: Configure as políticas no Supabase Dashboard

## 📝 Versioning

- Versão atual: 1.0.0
- Última atualização: 15/10/2025
- Framework: Nuxt 4.0.3