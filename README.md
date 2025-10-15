# 💰 App Dízimo - Sistema de Gestão Financeira

Sistema completo de gestão financeira com foco em controle de dízimo, entradas, saídas e despesas avançadas.

![Nuxt.js](https://img.shields.io/badge/Nuxt-4.0.3-00C58E?style=for-the-badge&logo=nuxt.js&logoColor=white)
![Vue.js](https://img.shields.io/badge/Vue.js-3.0-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3CB371?style=for-the-badge&logo=supabase&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 🎯 Funcionalidades Principais

### 💰 Sistema Financeiro Completo
- ✅ **Entradas**: Registro de receitas com cálculo automático de dízimo (10%)
- ✅ **Despesas Únicas**: Pagamentos únicos com controle de vencimento
- ✅ **Despesas Parceladas**: Ex: TV parcelada em 10x com controle individual de cada parcela
- ✅ **Despesas Recorrentes**: Ex: Conta de luz mensal, internet, etc.
- ✅ **Controle de Pagamento**: Marcar como pago/estornar com data de pagamento
- ✅ **Dízimo Automático**: 10% de cada entrada é automaticamente separado

### 🎨 Interface Moderna
- 🌙 **Dark Theme** nativo com design consistente
- 📱 **Responsivo** para desktop, tablet e mobile
- 🎯 **Dashboard** com resumos financeiros em tempo real
- 🔔 **Alertas** de vencimento (vencidas, hoje, futuras)
- 🎭 **Ícones FontAwesome** para melhor experiência visual

### 🔐 Autenticação Segura
- 🔑 Login/Registro com Supabase Auth
- 🛡️ Middleware de proteção de rotas
- 👤 Gestão de sessão automática
- 🚪 Logout seguro com limpeza de dados

### 📊 Gestão Avançada
- 📈 **Cards de resumo**: Total entradas, saídas, dízimo e saldo atual
- 📅 **Calendário financeiro** com datas de vencimento
- 🏷️ **Categorias** customizáveis para organização
- 🔍 **Filtros** por tipo, data e categoria
- 💾 **Histórico completo** de transações

## 🚀 Tecnologias Utilizadas

- **Framework**: Nuxt.js 4.0.3 (Vue.js 3)
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **Styling**: Tailwind CSS com tema dark customizado
- **Language**: TypeScript 100%
- **Icons**: FontAwesome Pro
- **State Management**: Composables Vue 3
- **Database**: PostgreSQL com Row Level Security (RLS)

## 📦 Estrutura do Projeto

```
app-dizimo/
├── app/
│   ├── components/          # Componentes Vue reutilizáveis
│   │   ├── FinancasManager.vue    # Gerenciador financeiro principal
│   │   ├── DashboardOverview.vue  # Dashboard com métricas
│   │   └── ...
│   ├── composables/         # Lógica de negócio reativa
│   │   ├── useFinancas.ts         # Gestão financeira
│   │   ├── useAuth.ts             # Autenticação
│   │   └── ...
│   ├── layouts/             # Layouts de página
│   │   ├── dashboard.vue          # Layout principal do app
│   │   └── auth.vue               # Layout de autenticação
│   ├── pages/               # Páginas baseadas em arquivo
│   │   ├── financeiro.vue         # Página financeira principal
│   │   ├── login.vue              # Página de login
│   │   └── ...
│   ├── middleware/          # Middlewares de rota
│   └── plugins/             # Plugins do Nuxt
├── shared/
│   └── types/               # Tipos TypeScript compartilhados
├── migrations/              # Migrations do banco de dados
└── supabase/                # Configurações Supabase
```

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js 18+
- NPM ou Yarn
- Conta no Supabase

### 1. Clone o repositório
```bash
git clone https://github.com/wandersonmk/appdizimo.git
cd appdizimo
```

### 2. Instale as dependências
```bash
npm install
# ou
yarn install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto:
```env
NUXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NUXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
```

### 4. Execute as migrations do banco
Execute o arquivo `migrations/add_advanced_despesas_columns.sql` no seu banco Supabase.

### 5. Execute o projeto
```bash
npm run dev
# ou
yarn dev
```

O projeto estará disponível em `http://localhost:3000`

## 💾 Estrutura do Banco de Dados

### Tabelas Principais

#### `transacoes_financeiras`
```sql
- id (UUID, Primary Key)
- tipo ('entrada' | 'saida' | 'dizimo')
- categoria_id (UUID, Foreign Key)
- descricao (Text)
- valor (Decimal)
- data (Date)
- data_vencimento (Date) -- Para despesas
- tipo_despesa ('unica' | 'recorrente' | 'parcelada')
- status_pagamento ('pendente' | 'pago')
- total_parcelas (Integer) -- Para parceladas
- parcela_atual (Integer) -- Para parceladas
- valor_total (Decimal) -- Para parceladas
- frequencia_recorrencia ('mensal' | 'trimestral' | 'semestral' | 'anual')
- data_pagamento (Date) -- Data efetiva do pagamento
- observacoes (Text)
- valor_dizimo (Decimal) -- 10% automático das entradas
```

#### `categorias_financeiras`
```sql
- id (UUID, Primary Key)
- nome (Text)
- tipo ('entrada' | 'saida' | 'dizimo')
- cor (Text) -- Cor hexadecimal
- icone (Text) -- Nome do ícone FontAwesome
```

## 🎯 Como Usar

### 1. **Registrar Entrada**
- Acesse "Financeiro" → "Nova Entrada"
- Preencha categoria, descrição, valor e data
- O sistema calcula automaticamente 10% para o dízimo
- Salve e acompanhe no dashboard

### 2. **Registrar Despesa Única**
- Acesse "Financeiro" → "Nova Despesa"
- Selecione "Pagamento Único"
- Preencha os dados e data de vencimento
- Marque como pago quando efetuar o pagamento

### 3. **Registrar Despesa Parcelada**
- Selecione "Parcelada"
- Informe valor total e quantidade de parcelas
- O sistema cria automaticamente todas as parcelas mensais
- Controle o pagamento individual de cada parcela

### 4. **Registrar Despesa Recorrente**
- Selecione "Recorrente"
- Escolha a frequência (mensal, trimestral, etc.)
- O sistema registra a primeira ocorrência
- Ideal para contas fixas mensais

### 5. **Dashboard Financeiro**
- Visualize resumo total: entradas, saídas, dízimo e saldo
- Acompanhe alertas de vencimento
- Filtre transações por período e tipo
- Monitore seu histórico completo

## 🎨 Capturas de Tela

*Em breve: capturas de tela do sistema em funcionamento*

## 🤝 Como Contribuir

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Wanderson MK** - [@wandersonmk](https://github.com/wandersonmk)

## 🙏 Agradecimentos

- [Nuxt.js](https://nuxt.com/) pelo framework incrível
- [Supabase](https://supabase.com/) pela infraestrutura backend
- [Tailwind CSS](https://tailwindcss.com/) pelo sistema de design
- [FontAwesome](https://fontawesome.com/) pelos ícones

---

⭐ Se este projeto te ajudou, deixe uma estrela no repositório!