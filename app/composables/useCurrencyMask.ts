// Composable para formatação de moeda brasileira
export function useCurrencyMask() {
  // Formatar valor para exibição (R$ 1.500,00)
  const formatCurrency = (value: number | string): string => {
    const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^\d]/g, '')) / 100 : value
    
    if (isNaN(numValue)) return 'R$ 0,00'
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numValue)
  }

  // Aplicar máscara enquanto digita
  const applyCurrencyMask = (value: string): string => {
    // Remove tudo que não é dígito
    const digits = value.replace(/\D/g, '')
    
    if (!digits) return ''
    
    // Converte para número (centavos)
    const numValue = parseInt(digits) / 100
    
    return formatCurrency(numValue)
  }

  // Converter valor mascarado de volta para número
  const parseCurrencyValue = (maskedValue: string): number => {
    const digits = maskedValue.replace(/\D/g, '')
    if (!digits) return 0
    return parseInt(digits) / 100
  }

  // Lidar com input do usuário
  const handleCurrencyInput = (event: Event, callback: (value: number) => void) => {
    const target = event.target as HTMLInputElement
    const cursorPosition = target.selectionStart || 0
    
    // Aplica a máscara
    const maskedValue = applyCurrencyMask(target.value)
    target.value = maskedValue
    
    // Restaura posição do cursor (aproximadamente)
    const newCursorPosition = Math.min(cursorPosition + (maskedValue.length - target.value.length), maskedValue.length)
    setTimeout(() => {
      target.setSelectionRange(newCursorPosition, newCursorPosition)
    }, 0)
    
    // Chama callback com valor numérico
    const numericValue = parseCurrencyValue(maskedValue)
    callback(numericValue)
  }

  return {
    formatCurrency,
    applyCurrencyMask,
    parseCurrencyValue,
    handleCurrencyInput
  }
}