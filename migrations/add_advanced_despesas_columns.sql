-- Migração para adicionar funcionalidades avançadas de despesas
-- Data: 2024-10-14

-- Adicionar novas colunas para despesas avançadas
ALTER TABLE transacoes_financeiras 
ADD COLUMN IF NOT EXISTS tipo_despesa VARCHAR(20) DEFAULT 'unica',
ADD COLUMN IF NOT EXISTS status_pagamento VARCHAR(20) DEFAULT 'pendente',
ADD COLUMN IF NOT EXISTS total_parcelas INTEGER,
ADD COLUMN IF NOT EXISTS parcela_atual INTEGER,
ADD COLUMN IF NOT EXISTS valor_total DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS despesa_principal_id UUID REFERENCES transacoes_financeiras(id),
ADD COLUMN IF NOT EXISTS frequencia_recorrencia VARCHAR(20),
ADD COLUMN IF NOT EXISTS data_pagamento DATE,
ADD COLUMN IF NOT EXISTS observacoes TEXT;

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_transacoes_tipo_despesa ON transacoes_financeiras(tipo_despesa);
CREATE INDEX IF NOT EXISTS idx_transacoes_status_pagamento ON transacoes_financeiras(status_pagamento);
CREATE INDEX IF NOT EXISTS idx_transacoes_data_vencimento ON transacoes_financeiras(data_vencimento);
CREATE INDEX IF NOT EXISTS idx_transacoes_despesa_principal ON transacoes_financeiras(despesa_principal_id);

-- Atualizar despesas existentes para ter status pendente por padrão
UPDATE transacoes_financeiras 
SET status_pagamento = 'pendente', tipo_despesa = 'unica'
WHERE tipo = 'saida' AND status_pagamento IS NULL;

-- Comentários nas colunas
COMMENT ON COLUMN transacoes_financeiras.tipo_despesa IS 'Tipo da despesa: unica, recorrente, parcelada';
COMMENT ON COLUMN transacoes_financeiras.status_pagamento IS 'Status do pagamento: pendente, pago';
COMMENT ON COLUMN transacoes_financeiras.total_parcelas IS 'Número total de parcelas (para despesas parceladas)';
COMMENT ON COLUMN transacoes_financeiras.parcela_atual IS 'Número da parcela atual (para despesas parceladas)';
COMMENT ON COLUMN transacoes_financeiras.valor_total IS 'Valor total da despesa (para despesas parceladas)';
COMMENT ON COLUMN transacoes_financeiras.despesa_principal_id IS 'ID da despesa principal (para parcelas)';
COMMENT ON COLUMN transacoes_financeiras.frequencia_recorrencia IS 'Frequência da recorrência: mensal, trimestral, semestral, anual';
COMMENT ON COLUMN transacoes_financeiras.data_pagamento IS 'Data efetiva do pagamento';
COMMENT ON COLUMN transacoes_financeiras.observacoes IS 'Observações adicionais sobre a transação';