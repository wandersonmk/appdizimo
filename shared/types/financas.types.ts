// Tipos para sistema de finanças
export interface TransacaoFinanceira {
  id: string
  tipo: 'entrada' | 'saida' | 'dizimo'
  categoria: string
  descricao: string
  valor: number
  data: string
  data_vencimento?: string // Para despesas
  valor_dizimo?: number // Valor do dízimo gerado automaticamente
  transacao_origem_id?: string // ID da transação de entrada que gerou o dízimo
  // Novos campos para despesas avançadas
  tipo_despesa?: 'unica' | 'recorrente' | 'parcelada'
  status_pagamento?: 'pendente' | 'pago'
  total_parcelas?: number
  parcela_atual?: number
  valor_total?: number // Valor total da despesa (para parceladas)
  despesa_principal_id?: string // ID da despesa principal (para parcelas)
  frequencia_recorrencia?: 'mensal' | 'trimestral' | 'semestral' | 'anual' // Para recorrentes
  data_pagamento?: string // Data efetiva do pagamento
  observacoes?: string
  created_at: string
  updated_at: string
}

export interface CategoriaFinanceira {
  id: string
  nome: string
  tipo: 'entrada' | 'saida' | 'dizimo'
  cor: string
  icone: string
}

export interface ResumoFinanceiro {
  totalEntradas: number // Valor bruto das entradas (para exibição)
  totalEntradasLiquidas?: number // Valor líquido das entradas (para cálculos)
  totalSaidas: number
  totalDizimo: number
  saldoAtual: number // Baseado em: entradas líquidas - saídas
  transacoesHoje: number
}

export interface FiltroTransacoes {
  dataInicio?: string
  dataFim?: string
  tipo?: 'entrada' | 'saida' | 'dizimo' | 'todas'
  categoria?: string
}

export interface DespesaForm {
  categoria: string
  descricao: string
  valor: number
  data_vencimento: string
  tipo_despesa: 'unica' | 'recorrente' | 'parcelada'
  total_parcelas?: number
  frequencia_recorrencia?: 'mensal' | 'trimestral' | 'semestral' | 'anual'
  observacoes?: string
}

export interface DespesaParcela {
  id: string
  despesa_principal_id: string
  numero_parcela: number
  valor_parcela: number
  data_vencimento: string
  status: 'pendente' | 'pago'
  data_pagamento?: string
}