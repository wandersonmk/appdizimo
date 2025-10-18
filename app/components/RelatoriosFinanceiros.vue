<template>
  <div class="space-y-4 md:space-y-6 px-2 md:px-0">
    <!-- Resumo Financeiro -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <!-- Card Entradas -->
      <div class="relative bg-gradient-to-br from-card via-green-950/10 to-card text-card-foreground rounded-lg border border-green-800/20 shadow-sm hover:shadow-md hover:shadow-green-500/10 transition-all duration-300 p-4 md:p-6 group overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div class="relative z-10 flex items-center justify-between">
          <div>
            <p class="text-xs md:text-sm text-gray-400 mb-1">Entradas</p>
            <p class="text-lg md:text-2xl font-bold text-foreground">{{ formatarMoeda(totais.entradas) }}</p>
            <p class="text-xs text-green-600 mt-1">receitas</p>
          </div>
          <div class="text-green-600 text-xl md:text-2xl">
            <font-awesome-icon icon="arrow-up" />
          </div>
        </div>
      </div>

      <!-- Card Saídas -->
      <div class="relative bg-gradient-to-br from-card via-red-950/10 to-card text-card-foreground rounded-lg border border-red-800/20 shadow-sm hover:shadow-md hover:shadow-red-500/10 transition-all duration-300 p-4 md:p-6 group overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div class="relative z-10 flex items-center justify-between">
          <div>
            <p class="text-xs md:text-sm text-gray-400 mb-1">Saídas</p>
            <p class="text-lg md:text-2xl font-bold text-foreground">{{ formatarMoeda(totais.saidas) }}</p>
            <p class="text-xs text-red-600 mt-1">despesas</p>
          </div>
          <div class="text-red-600 text-xl md:text-2xl">
            <font-awesome-icon icon="arrow-down" />
          </div>
        </div>
      </div>

      <!-- Card Dízimos -->
      <div class="relative bg-gradient-to-br from-card via-purple-950/10 to-card text-card-foreground rounded-lg border border-purple-800/20 shadow-sm hover:shadow-md hover:shadow-purple-500/10 transition-all duration-300 p-4 md:p-6 group overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div class="relative z-10 flex items-center justify-between">
          <div>
            <p class="text-xs md:text-sm text-gray-400 mb-1">Dízimos</p>
            <p class="text-lg md:text-2xl font-bold text-foreground">{{ formatarMoeda(totais.dizimos) }}</p>
            <p class="text-xs text-purple-600 mt-1">contribuições</p>
          </div>
          <div class="text-purple-600 text-xl md:text-2xl">
            <font-awesome-icon icon="heart" />
          </div>
        </div>
      </div>

      <!-- Card Saldo -->
      <div class="relative bg-gradient-to-br from-card via-blue-950/10 to-card text-card-foreground rounded-lg border border-blue-800/20 shadow-sm hover:shadow-md hover:shadow-blue-500/10 transition-all duration-300 p-4 md:p-6 group overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div class="relative z-10 flex items-center justify-between">
          <div>
            <p class="text-xs md:text-sm text-gray-400 mb-1">Saldo</p>
            <p class="text-lg md:text-2xl font-bold" :class="totais.saldo >= 0 ? 'text-green-400' : 'text-red-400'">
              {{ formatarMoeda(totais.saldo) }}
            </p>
            <p class="text-xs text-gray-400 mt-1">{{ relatorios.length }} transações</p>
          </div>
          <div :class="totais.saldo >= 0 ? 'text-green-600' : 'text-red-600'" class="text-xl md:text-2xl">
            <font-awesome-icon :icon="totais.saldo >= 0 ? 'wallet' : 'exclamation-triangle'" />
          </div>
        </div>
      </div>
    </div>

    <!-- Botões de Exportação -->
    <div class="bg-card rounded-lg border border-border p-3 md:p-4">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
        <div class="flex-1 min-w-0">
          <h3 class="text-base md:text-lg font-semibold text-foreground">Exportar Relatório</h3>
          <p class="text-xs md:text-sm text-muted-foreground">Baixe seus dados em diferentes formatos</p>
        </div>
        <div class="flex items-center gap-2 md:gap-3">
          <button
            @click="exportarParaPDF"
            :disabled="isExporting"
            class="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-3 md:px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-colors text-xs md:text-sm font-medium"
          >
            <font-awesome-icon 
              :icon="isExporting ? 'spinner' : 'file-pdf'" 
              :class="{ 'animate-spin': isExporting }"
              class="w-3 h-3 md:w-4 md:h-4" 
            />
            <span>PDF</span>
          </button>
          <button
            @click="exportarParaExcel"
            :disabled="isExporting"
            class="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-3 md:px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg transition-colors text-xs md:text-sm font-medium"
          >
            <font-awesome-icon 
              :icon="isExporting ? 'spinner' : 'file-excel'" 
              :class="{ 'animate-spin': isExporting }"
              class="w-3 h-3 md:w-4 md:h-4" 
            />
            <span>Excel</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Filtros -->
    <div class="bg-card rounded-lg border border-border p-3 md:p-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        <div>
          <label class="block text-xs md:text-sm font-medium text-foreground mb-1 md:mb-2">Data Inicial</label>
          <input
            v-model="filtros.dataInicial"
            type="date"
            class="w-full px-2 md:px-3 py-2 text-sm md:text-base border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label class="block text-xs md:text-sm font-medium text-foreground mb-1 md:mb-2">Data Final</label>
          <input
            v-model="filtros.dataFinal"
            type="date"
            class="w-full px-2 md:px-3 py-2 text-sm md:text-base border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div class="sm:col-span-2 lg:col-span-1">
          <label class="block text-xs md:text-sm font-medium text-foreground mb-1 md:mb-2">Tipo</label>
          <select
            v-model="filtros.tipo"
            class="w-full px-2 md:px-3 py-2 text-sm md:text-base border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Todos os tipos</option>
            <option value="entrada">Entradas</option>
            <option value="saida">Saídas</option>
            <option value="dizimo">Dízimos</option>
          </select>
        </div>
      </div>
      <div class="flex justify-end mt-3 md:mt-4">
        <button
          @click="limparFiltros"
          class="w-full sm:w-auto px-3 md:px-4 py-2 border border-border text-foreground hover:bg-muted rounded-lg transition-colors text-xs md:text-sm font-medium"
        >
          Limpar Filtros
        </button>
      </div>
    </div>

    <!-- Lista de Transações -->
    <div class="bg-card rounded-lg border border-border overflow-hidden transacoes-tabela">
      <div class="p-3 md:p-4 border-b border-border">
        <h3 class="text-base md:text-lg font-semibold text-foreground">Transações Financeiras</h3>
        <p class="text-xs md:text-sm text-muted-foreground mt-1">
          Mostrando {{ Math.min((paginaAtual - 1) * itensPorPagina + 1, relatoriosFiltrados.length) }}-{{ Math.min(paginaAtual * itensPorPagina, relatoriosFiltrados.length) }} de {{ relatoriosFiltrados.length }} transação(ões)
        </p>
      </div>

      <!-- Vista Desktop: Tabela -->
      <div class="hidden md:block overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-border bg-muted/30">
              <th class="text-left py-3 px-4 font-medium text-muted-foreground text-sm">Data</th>
              <th class="text-left py-3 px-4 font-medium text-muted-foreground text-sm">Tipo</th>
              <th class="text-left py-3 px-4 font-medium text-muted-foreground text-sm">Categoria</th>
              <th class="text-left py-3 px-4 font-medium text-muted-foreground text-sm">Descrição</th>
              <th class="text-right py-3 px-4 font-medium text-muted-foreground text-sm">Valor</th>
              <th class="text-center py-3 px-4 font-medium text-muted-foreground text-sm">Status</th>
              <th class="text-center py-3 px-4 font-medium text-muted-foreground text-sm w-12"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="relatoriosFiltrados.length === 0">
              <td colspan="7" class="py-8 text-center text-muted-foreground">
                <div class="flex flex-col items-center">
                  <font-awesome-icon icon="inbox" class="w-8 h-8 mb-2 text-muted-foreground/50" />
                  <p>Nenhuma transação encontrada</p>
                </div>
              </td>
            </tr>
            
            <template v-for="relatorio in relatoriosPaginados" :key="relatorio.id">
              <!-- Grupo de Despesas Parceladas -->
              <tr v-if="relatorio.isGrupo" class="border-b border-border/50 bg-purple-50/30 dark:bg-purple-900/10 hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition-colors">
                <td class="py-3 px-4 text-sm text-foreground">
                  <span v-if="relatorio.proximoVencimento">{{ formatarData(relatorio.proximoVencimento) }}</span>
                  <span v-else class="text-muted-foreground">—</span>
                </td>
                <td class="py-3 px-4">
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                    <font-awesome-icon icon="credit-card" class="w-3 h-3 mr-1" />
                    Parcelada
                  </span>
                </td>
                <td class="py-3 px-4">
                  <div class="flex items-center">
                    <div class="w-3 h-3 rounded-full mr-2" :style="{ backgroundColor: relatorio.categoria_cor }"></div>
                    <span class="text-sm text-foreground">{{ relatorio.categoria_nome }}</span>
                  </div>
                </td>
                <td class="py-3 px-4">
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-medium text-foreground">{{ relatorio.descricao }}</span>
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                      {{ relatorio.parcelasPagas }}/{{ relatorio.totalParcelas }}
                    </span>
                  </div>
                </td>
                <td class="py-3 px-4 text-right text-sm font-bold text-red-600 dark:text-red-400">
                  {{ formatarMoeda(relatorio.valorTotal) }}
                </td>
                <td class="py-3 px-4 text-center">
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                    {{ relatorio.parcelasPagas }}/{{ relatorio.totalParcelas }} pagas
                  </span>
                </td>
                <td class="py-3 px-4 text-center">
                  <button 
                    @click="toggleGrupoExpansao(relatorio.id)"
                    class="p-2 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                    :title="despesasParceladasExpandidas.has(relatorio.id) ? 'Recolher parcelas' : 'Expandir parcelas'"
                  >
                    <font-awesome-icon 
                      :icon="despesasParceladasExpandidas.has(relatorio.id) ? 'chevron-up' : 'chevron-down'" 
                      class="w-4 h-4 text-purple-600 dark:text-purple-400"
                    />
                  </button>
                </td>
              </tr>
              
              <!-- Parcelas Expandidas (Desktop) -->
              <tr v-if="relatorio.isGrupo && despesasParceladasExpandidas.has(relatorio.id)" class="bg-muted/20">
                <td colspan="7" class="p-0">
                  <div class="ml-8 mr-4 my-3 border-l-2 border-purple-300 dark:border-purple-700 pl-4">
                    <div v-for="parcela in relatorio.parcelas" :key="parcela.id" class="py-2 px-3 bg-background border border-border rounded-lg mb-2 last:mb-0">
                      <div class="grid grid-cols-6 gap-4 items-center text-sm">
                        <div class="text-muted-foreground">{{ formatarData(parcela.data_vencimento || parcela.data) }}</div>
                        <div class="col-span-2 text-foreground">{{ parcela.descricao }}</div>
                        <div class="text-right font-medium" :class="getValorClasses(parcela.tipo)">
                          {{ formatarMoeda(parcela.valor) }}
                        </div>
                        <div class="text-center">
                          <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                                :class="getStatusClasses(parcela.status_pagamento)">
                            {{ getStatusNome(parcela.status_pagamento) }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>

              <!-- Transação Individual -->
              <tr v-else-if="!relatorio.isGrupo" class="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td class="py-3 px-4 text-sm text-foreground">
                  {{ formatarData(relatorio.data) }}
                </td>
                <td class="py-3 px-4">
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                        :class="getTipoClasses(relatorio.tipo)">
                    <font-awesome-icon 
                      :icon="getTipoIcon(relatorio.tipo)" 
                      class="w-3 h-3 mr-1" 
                    />
                    {{ getTipoNome(relatorio.tipo) }}
                  </span>
                </td>
                <td class="py-3 px-4">
                  <div class="flex items-center">
                    <div class="w-3 h-3 rounded-full mr-2" :style="{ backgroundColor: relatorio.categoria_cor }"></div>
                    <span class="text-sm text-foreground">{{ relatorio.categoria_nome }}</span>
                  </div>
                </td>
                <td class="py-3 px-4 text-sm text-foreground">
                  {{ relatorio.descricao }}
                </td>
                <td class="py-3 px-4 text-right text-sm font-medium"
                    :class="getValorClasses(relatorio.tipo)">
                  {{ formatarMoeda(relatorio.valor) }}
                </td>
                <td class="py-3 px-4 text-center">
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                        :class="getStatusClasses(relatorio.status_pagamento)">
                    {{ getStatusNome(relatorio.status_pagamento) }}
                  </span>
                </td>
                <td class="py-3 px-4"></td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <!-- Controles de Paginação Desktop -->
      <div v-if="relatoriosFiltrados.length > itensPorPagina" class="hidden md:flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20">
        <div class="flex items-center gap-2">
          <button 
            @click="paginaAnterior" 
            :disabled="paginaAtual === 1"
            class="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            :class="paginaAtual === 1 ? 'text-muted-foreground bg-muted/20' : 'text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary'"
          >
            <font-awesome-icon icon="chevron-left" class="w-4 h-4" />
            <span>Anterior</span>
          </button>
          
          <div class="flex items-center gap-1">
            <template v-for="pagina in Math.min(totalPaginas, 5)" :key="pagina">
              <button
                @click="irParaPagina(pagina)"
                class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                :class="pagina === paginaAtual 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-foreground hover:bg-muted/50'"
              >
                {{ pagina }}
              </button>
            </template>
            <span v-if="totalPaginas > 5" class="px-2 text-muted-foreground">...</span>
            <button
              v-if="totalPaginas > 5 && paginaAtual !== totalPaginas"
              @click="irParaPagina(totalPaginas)"
              class="px-3 py-1.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
            >
              {{ totalPaginas }}
            </button>
          </div>
          
          <button 
            @click="proximaPagina" 
            :disabled="paginaAtual === totalPaginas"
            class="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            :class="paginaAtual === totalPaginas ? 'text-muted-foreground bg-muted/20' : 'text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary'"
          >
            <span>Próxima</span>
            <font-awesome-icon icon="chevron-right" class="w-4 h-4" />
          </button>
        </div>
        
        <div class="text-sm font-medium text-muted-foreground">
          Página {{ paginaAtual }} de {{ totalPaginas }}
        </div>
      </div>

      <!-- Vista Mobile: Cards -->
      <div class="md:hidden divide-y divide-border">
        <div v-if="relatoriosFiltrados.length === 0" class="py-8 text-center text-muted-foreground">
          <div class="flex flex-col items-center px-4">
            <font-awesome-icon icon="inbox" class="w-12 h-12 mb-3 text-muted-foreground/50" />
            <p class="text-sm">Nenhuma transação encontrada</p>
          </div>
        </div>
        
        <div
          v-for="relatorio in relatoriosPaginados"
          :key="relatorio.id"
          class="transition-colors"
        >
          <!-- Card de Grupo Parcelado -->
          <div v-if="relatorio.isGrupo" class="p-4 bg-purple-900/20 rounded-lg border border-purple-700/50">
            <!-- Cabeçalho do Grupo -->
            <div class="flex items-start justify-between mb-3">
              <div class="flex items-center gap-3 flex-1">
                <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                  <font-awesome-icon icon="credit-card" class="text-white text-base" />
                </div>
                <div class="flex-1 min-w-0">
                  <span class="text-sm font-medium text-gray-200 block mb-1">{{ relatorio.categoria_nome }}</span>
                  <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Parcelada
                  </span>
                </div>
              </div>
            </div>

            <!-- Descrição e Badge -->
            <div class="mb-3">
              <p class="text-base font-semibold text-gray-100 mb-2">{{ relatorio.descricao }}</p>
              <div class="flex flex-wrap items-center gap-2">
                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-300 border border-orange-500/30">
                  {{ relatorio.parcelasPagas }}/{{ relatorio.totalParcelas }} pagas
                </span>
                <span v-if="relatorio.proximoVencimento" class="text-xs text-amber-400 font-medium">
                  ⏰ Próximo: {{ formatarData(relatorio.proximoVencimento) }}
                </span>
                <span v-else class="text-xs text-green-400 font-medium">
                  ✅ Todas pagas
                </span>
              </div>
            </div>

            <!-- Valor Total -->
            <div class="flex items-center justify-between py-2.5 px-3 bg-gray-900/50 rounded-lg border border-gray-700/50 mb-3">
              <span class="text-xs font-medium text-gray-300">Total Parcelado:</span>
              <span class="text-lg font-bold text-red-400">
                {{ formatarMoeda(relatorio.valorTotal) }}
              </span>
            </div>

            <!-- Botão Expandir/Recolher -->
            <button 
              @click="toggleGrupoExpansao(relatorio.id)"
              class="w-full py-2.5 px-3 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-semibold shadow-sm"
            >
              <font-awesome-icon 
                :icon="despesasParceladasExpandidas.has(relatorio.id) ? 'chevron-up' : 'chevron-down'" 
              />
              {{ despesasParceladasExpandidas.has(relatorio.id) ? 'Recolher parcelas' : 'Ver parcelas' }}
            </button>

            <!-- Parcelas Expandidas (Mobile) -->
            <div v-if="despesasParceladasExpandidas.has(relatorio.id)" class="mt-3 space-y-2 border-l-3 border-purple-500 pl-3">
              <div v-for="parcela in relatorio.parcelas" :key="parcela.id" class="p-3 bg-gray-800/50 border border-gray-700/50 rounded-lg">
                <div class="flex items-start justify-between mb-2">
                  <p class="text-sm font-semibold text-gray-100 flex-1">{{ parcela.descricao }}</p>
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold flex-shrink-0 ml-2"
                        :class="getStatusClasses(parcela.status_pagamento)">
                    {{ getStatusNome(parcela.status_pagamento) }}
                  </span>
                </div>
                <div class="flex items-center justify-between text-xs text-gray-300 mb-2">
                  <span class="font-medium">📅 {{ formatarData(parcela.data_vencimento || parcela.data) }}</span>
                </div>
                <div class="flex items-center justify-between pt-2 border-t border-gray-700/50">
                  <span class="text-xs font-medium text-gray-300">Valor:</span>
                  <span class="text-base font-bold" :class="getValorClasses(parcela.tipo)">
                    {{ formatarMoeda(parcela.valor) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Card de Transação Individual -->
          <div v-else class="p-4 hover:bg-muted/30">
            <!-- Cabeçalho do Card -->
            <div class="flex items-start justify-between mb-3">
              <div class="flex items-center space-x-2">
                <div class="w-2 h-2 rounded-full" :style="{ backgroundColor: relatorio.categoria_cor }"></div>
                <span class="text-sm font-medium text-foreground">{{ relatorio.categoria_nome }}</span>
              </div>
              <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                    :class="getTipoClasses(relatorio.tipo)">
                <font-awesome-icon 
                  :icon="getTipoIcon(relatorio.tipo)" 
                  class="w-3 h-3 mr-1" 
                />
                {{ getTipoNome(relatorio.tipo) }}
              </span>
            </div>

            <!-- Descrição -->
            <p class="text-sm text-foreground mb-2 font-medium">{{ relatorio.descricao }}</p>

            <!-- Informações -->
            <div class="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span>{{ formatarData(relatorio.data) }}</span>
              <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                    :class="getStatusClasses(relatorio.status_pagamento)">
                {{ getStatusNome(relatorio.status_pagamento) }}
              </span>
            </div>

            <!-- Valor -->
            <div class="flex items-center justify-between pt-2 border-t border-border/50">
              <span class="text-xs text-muted-foreground">Valor:</span>
              <span class="text-base font-bold"
                    :class="getValorClasses(relatorio.tipo)">
                {{ formatarMoeda(relatorio.valor) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Controles de Paginação Mobile -->
      <div v-if="relatoriosFiltrados.length > itensPorPagina" class="md:hidden flex flex-col gap-3 p-4 border-t border-border bg-muted/20">
        <div class="flex items-center justify-between">
          <button 
            @click="paginaAnterior" 
            :disabled="paginaAtual === 1"
            class="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            :class="paginaAtual === 1 ? 'text-muted-foreground' : 'text-foreground active:bg-muted/50'"
          >
            <font-awesome-icon icon="chevron-left" class="w-4 h-4" />
            <span>Anterior</span>
          </button>
          
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium text-foreground">{{ paginaAtual }}</span>
            <span class="text-sm text-muted-foreground">de</span>
            <span class="text-sm font-medium text-foreground">{{ totalPaginas }}</span>
          </div>
          
          <button 
            @click="proximaPagina" 
            :disabled="paginaAtual === totalPaginas"
            class="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            :class="paginaAtual === totalPaginas ? 'text-muted-foreground' : 'text-foreground active:bg-muted/50'"
          >
            <span>Próxima</span>
            <font-awesome-icon icon="chevron-right" class="w-4 h-4" />
          </button>
        </div>
        
        <div class="text-center text-xs text-muted-foreground">
          Mostrando {{ Math.min((paginaAtual - 1) * itensPorPagina + 1, relatoriosFiltrados.length) }}-{{ Math.min(paginaAtual * itensPorPagina, relatoriosFiltrados.length) }} de {{ relatoriosFiltrados.length }} transações
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRelatorios } from '../composables/useRelatorios'

// Props
const props = defineProps<{
  relatorios: Array<any>
}>()

// Composable
const { calcularTotais } = useRelatorios()

// Estados reativos
const filtros = ref({
  dataInicial: '',
  dataFinal: '',
  tipo: ''
})

const isExporting = ref(false)
const despesasParceladasExpandidas = ref<Set<string>>(new Set()) // Para controlar expansão das parcelas

// Paginação
const paginaAtual = ref(1)
const itensPorPagina = 12

// Computeds
const totais = computed(() => {
  // Calcular totais com base nos relatórios filtrados
  const totaisCalculados = {
    entradas: 0,
    saidas: 0,
    dizimos: 0,
    saldo: 0
  }

  relatoriosFiltrados.value.forEach(relatorio => {
    const valor = relatorio.valor || 0
    
    switch (relatorio.tipo) {
      case 'entrada':
        totaisCalculados.entradas += valor
        break
      case 'saida':
        totaisCalculados.saidas += valor
        break
      case 'dizimo':
        totaisCalculados.dizimos += valor
        break
    }
  })

  totaisCalculados.saldo = totaisCalculados.entradas - totaisCalculados.saidas - totaisCalculados.dizimos
  
  return totaisCalculados
})

// Função para agrupar despesas parceladas
const agruparDespesasParceladas = (transacoes: any[]) => {
  const grupos: any = {}
  const transacoesAgrupadas: any[] = []
  
  transacoes.forEach(transacao => {
    // Detecta se é despesa parcelada pelos padrões: "Nome (X/Y)" ou "Nome - Parcela X/Y" ou tipo_despesa = 'parcelada'
    const isParcelada = transacao.tipo === 'saida' && (
      transacao.tipo_despesa === 'parcelada' ||
      /\(\d+\/\d+\)/.test(transacao.descricao) ||
      /\s*-\s*Parcela\s+\d+\/\d+/.test(transacao.descricao)
    )
    
    if (isParcelada) {
      // Extrai a descrição base removendo os padrões de parcela
      let descricaoBase = transacao.descricao
        .replace(/\s*\(\d+\/\d+\).*$/, '') // Remove "(X/Y)" e tudo após
        .replace(/\s*-\s*Parcela\s+\d+\/\d+.*$/, '') // Remove "- Parcela X/Y" e tudo após
        .trim()
      
      if (!grupos[descricaoBase]) {
        grupos[descricaoBase] = {
          id: `grupo_${descricaoBase.replace(/\s/g, '_')}`,
          descricao: descricaoBase,
          tipo: 'saida',
          tipo_despesa: 'parcelada',
          isGrupo: true,
          parcelas: [],
          totalParcelas: 0,
          parcelasPagas: 0,
          valorTotal: 0,
          proximoVencimento: null,
          categoria_nome: transacao.categoria_nome,
          categoria_cor: transacao.categoria_cor
        }
        transacoesAgrupadas.push(grupos[descricaoBase])
      }
      
      grupos[descricaoBase].parcelas.push(transacao)
      grupos[descricaoBase].totalParcelas++
      grupos[descricaoBase].valorTotal += transacao.valor || 0
      
      if (transacao.status_pagamento === 'pago') {
        grupos[descricaoBase].parcelasPagas++
      }
      
      // Define próximo vencimento (primeira parcela não paga)
      if (transacao.status_pagamento !== 'pago') {
        if (!grupos[descricaoBase].proximoVencimento || 
            new Date(transacao.data_vencimento || transacao.data) < new Date(grupos[descricaoBase].proximoVencimento)) {
          grupos[descricaoBase].proximoVencimento = transacao.data_vencimento || transacao.data
        }
      }
    } else {
      // Transações normais (não parceladas)
      transacoesAgrupadas.push(transacao)
    }
  })
  
  return transacoesAgrupadas
}

const relatoriosFiltrados = computed(() => {
  let filtrados = [...props.relatorios]

  // Filtro por tipo
  if (filtros.value.tipo) {
    filtrados = filtrados.filter(r => r.tipo === filtros.value.tipo)
  }

  // Filtro por data
  if (filtros.value.dataInicial) {
    filtrados = filtrados.filter(r => r.data >= filtros.value.dataInicial)
  }

  if (filtros.value.dataFinal) {
    filtrados = filtrados.filter(r => r.data <= filtros.value.dataFinal)
  }

  // Ordenar por data
  const ordenados = filtrados.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
  
  // Agrupar despesas parceladas
  return agruparDespesasParceladas(ordenados)
})

// Computed para transações paginadas
const relatoriosPaginados = computed(() => {
  const inicio = (paginaAtual.value - 1) * itensPorPagina
  const fim = inicio + itensPorPagina
  return relatoriosFiltrados.value.slice(inicio, fim)
})

// Computed para total de páginas
const totalPaginas = computed(() => {
  return Math.ceil(relatoriosFiltrados.value.length / itensPorPagina)
})

// Métodos
const formatarMoeda = (valor: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor || 0)
}

const formatarData = (data: string) => {
  return new Date(data).toLocaleDateString('pt-BR')
}

const getTipoClasses = (tipo: string) => {
  switch (tipo) {
    case 'entrada':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
    case 'saida':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    case 'dizimo':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
  }
}

const getTipoIcon = (tipo: string) => {
  switch (tipo) {
    case 'entrada':
      return 'arrow-up'
    case 'saida':
      return 'arrow-down'
    case 'dizimo':
      return 'heart'
    default:
      return 'circle'
  }
}

const getTipoNome = (tipo: string) => {
  switch (tipo) {
    case 'entrada':
      return 'Entrada'
    case 'saida':
      return 'Saída'
    case 'dizimo':
      return 'Dízimo'
    default:
      return tipo
  }
}

const getValorClasses = (tipo: string) => {
  switch (tipo) {
    case 'entrada':
      return 'text-green-600 dark:text-green-400'
    case 'saida':
      return 'text-red-600 dark:text-red-400'
    case 'dizimo':
      return 'text-purple-600 dark:text-purple-400'
    default:
      return 'text-foreground'
  }
}

const getStatusClasses = (status: string) => {
  switch (status) {
    case 'pago':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
    case 'pendente':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
    case 'vencido':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
  }
}

const getStatusNome = (status: string) => {
  switch (status) {
    case 'pago':
      return 'Pago'
    case 'pendente':
      return 'Pendente'
    case 'vencido':
      return 'Vencido'
    default:
      return status || 'Indefinido'
  }
}

// Funções de Exportação
const exportarParaPDF = async () => {
  if (isExporting.value) return
  
  try {
    isExporting.value = true
    console.log('🔄 Iniciando exportação PDF...')
    
    // Verificar se existem dados para exportar
    if (!relatoriosFiltrados.value || relatoriosFiltrados.value.length === 0) {
      alert('Nenhum dado encontrado para exportação')
      return
    }
    
    console.log('📊 Dados encontrados:', relatoriosFiltrados.value.length, 'transações')
    
    const { default: jsPDF } = await import('jspdf')
    
    // Criar documento
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })
    
    // Função para converter texto para ISO-8859-1 (Latin1) que o jsPDF suporta nativamente
    const converterParaLatin1 = (texto: string): string => {
      if (!texto) return ''
      
      // Mapa completo de caracteres UTF-8 para Latin1
      const mapa: { [key: string]: string } = {
        // Vogais minúsculas acentuadas
        'á': '\xE1', 'à': '\xE0', 'ã': '\xE3', 'â': '\xE2', 'ä': '\xE4',
        'é': '\xE9', 'è': '\xE8', 'ê': '\xEA', 'ë': '\xEB',
        'í': '\xED', 'ì': '\xEC', 'î': '\xEE', 'ï': '\xEF',
        'ó': '\xF3', 'ò': '\xF2', 'õ': '\xF5', 'ô': '\xF4', 'ö': '\xF6',
        'ú': '\xFA', 'ù': '\xF9', 'û': '\xFB', 'ü': '\xFC',
        'ç': '\xE7',
        
        // Vogais maiúsculas acentuadas
        'Á': '\xC1', 'À': '\xC0', 'Ã': '\xC3', 'Â': '\xC2', 'Ä': '\xC4',
        'É': '\xC9', 'È': '\xC8', 'Ê': '\xCA', 'Ë': '\xCB',
        'Í': '\xCD', 'Ì': '\xCC', 'Î': '\xCE', 'Ï': '\xCF',
        'Ó': '\xD3', 'Ò': '\xD2', 'Õ': '\xD5', 'Ô': '\xD4', 'Ö': '\xD6',
        'Ú': '\xDA', 'Ù': '\xD9', 'Û': '\xDB', 'Ü': '\xDC',
        'Ç': '\xC7',
        
        // Outros caracteres
        'ñ': '\xF1', 'Ñ': '\xD1',
        'º': '\xBA', 'ª': '\xAA',
        '°': '\xB0',
        
        // Símbolos de moeda e outros
        'R$': 'R$'
      }
      
      return texto.split('').map(char => mapa[char] || char).join('')
    }
    
    // Cores personalizadas
    const colors = {
      primary: [99, 102, 241] as [number, number, number],
      success: [34, 197, 94] as [number, number, number],
      danger: [239, 68, 68] as [number, number, number],
      warning: [251, 191, 36] as [number, number, number],
      purple: [168, 85, 247] as [number, number, number],
      muted: [107, 114, 128] as [number, number, number],
      background: [249, 250, 251] as [number, number, number],
      dark: [31, 41, 55] as [number, number, number]
    }
    
    let pageNumber = 1
    
    // Função para adicionar cabeçalho em cada página
    const adicionarCabecalho = (numeroPagina: number) => {
      // Linha superior colorida
      doc.setFillColor(...colors.primary)
      doc.rect(0, 0, 210, 15, 'F')
      
      // Título
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text(converterParaLatin1('Relatório Financeiro'), 20, 10)
      
      // Número da página (canto direito)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text(converterParaLatin1(`Página ${numeroPagina}`), 175, 10)
      
      // Reset cor do texto
      doc.setTextColor(...colors.dark)
    }
    
    // Função para adicionar rodapé
    const adicionarRodape = () => {
      doc.setFontSize(8)
      doc.setTextColor(...colors.muted)
      doc.setFont('helvetica', 'italic')
      const dataGeracao = new Date().toLocaleString('pt-BR')
      doc.text(converterParaLatin1(`Gerado em: ${dataGeracao}`), 20, 287)
      doc.text(converterParaLatin1('Sistema de Gestão Financeira'), 145, 287)
    }
    
    // PRIMEIRA PÁGINA - Cabeçalho e Resumo
    adicionarCabecalho(pageNumber)
    
    let yPos = 25
    
    // Informações de filtros aplicados (se houver)
    if (filtros.value.dataInicial || filtros.value.dataFinal || filtros.value.tipo) {
      doc.setFillColor(...colors.background)
      doc.rect(15, yPos - 5, 180, 20, 'F')
      
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...colors.primary)
      doc.text(converterParaLatin1('Filtros Aplicados:'), 20, yPos)
      
      yPos += 8
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(...colors.dark)
      
      if (filtros.value.dataInicial) {
        doc.text(`• Data Inicial: ${formatarData(filtros.value.dataInicial)}`, 25, yPos)
        yPos += 5
      }
      
      if (filtros.value.dataFinal) {
        doc.text(`• Data Final: ${formatarData(filtros.value.dataFinal)}`, 25, yPos)
        yPos += 5
      }
      
      if (filtros.value.tipo) {
        doc.text(converterParaLatin1(`• Tipo: ${getTipoNome(filtros.value.tipo)}`), 25, yPos)
        yPos += 5
      }
      
      yPos += 8
    }
    
    // Seção de Resumo Financeiro
    doc.setFillColor(...colors.primary)
    doc.rect(15, yPos, 180, 10, 'F')
    
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text(converterParaLatin1('Resumo Financeiro'), 20, yPos + 7)
    
    yPos += 18
    
    // Cards do Resumo
    const cardWidth = 42
    const cardHeight = 22
    const cardSpacing = 3
    let xPos = 15
    
    // Card Entradas
    doc.setFillColor(220, 252, 231) // Green 100
    doc.rect(xPos, yPos, cardWidth, cardHeight, 'F')
    doc.setDrawColor(...colors.success)
    doc.setLineWidth(0.5)
    doc.rect(xPos, yPos, cardWidth, cardHeight, 'S')
    
    doc.setFontSize(9)
    doc.setTextColor(...colors.success)
    doc.setFont('helvetica', 'bold')
    doc.text(converterParaLatin1('ENTRADAS'), xPos + 3, yPos + 6)
    
    doc.setFontSize(12)
    doc.setTextColor(...colors.dark)
    doc.text(formatarMoeda(totais.value.entradas), xPos + 3, yPos + 15)
    
    xPos += cardWidth + cardSpacing
    
    // Card Saídas
    doc.setFillColor(254, 226, 226) // Red 100
    doc.rect(xPos, yPos, cardWidth, cardHeight, 'F')
    doc.setDrawColor(...colors.danger)
    doc.rect(xPos, yPos, cardWidth, cardHeight, 'S')
    
    doc.setFontSize(9)
    doc.setTextColor(...colors.danger)
    doc.setFont('helvetica', 'bold')
    doc.text(converterParaLatin1('SAÍDAS'), xPos + 3, yPos + 6)
    
    doc.setFontSize(12)
    doc.setTextColor(...colors.dark)
    doc.text(formatarMoeda(totais.value.saidas), xPos + 3, yPos + 15)
    
    xPos += cardWidth + cardSpacing
    
    // Card Dízimos
    doc.setFillColor(243, 232, 255) // Purple 100
    doc.rect(xPos, yPos, cardWidth, cardHeight, 'F')
    doc.setDrawColor(...colors.purple)
    doc.rect(xPos, yPos, cardWidth, cardHeight, 'S')
    
    doc.setFontSize(9)
    doc.setTextColor(...colors.purple)
    doc.setFont('helvetica', 'bold')
    doc.text(converterParaLatin1('DÍZIMOS'), xPos + 3, yPos + 6)
    
    doc.setFontSize(12)
    doc.setTextColor(...colors.dark)
    doc.text(formatarMoeda(totais.value.dizimos), xPos + 3, yPos + 15)
    
    xPos += cardWidth + cardSpacing
    
    // Card Saldo
    const corSaldo = totais.value.saldo >= 0 ? colors.success : colors.danger
    const bgSaldo = (totais.value.saldo >= 0 ? [220, 252, 231] : [254, 226, 226]) as [number, number, number]
    
    doc.setFillColor(...bgSaldo)
    doc.rect(xPos, yPos, cardWidth, cardHeight, 'F')
    doc.setDrawColor(...corSaldo)
    doc.rect(xPos, yPos, cardWidth, cardHeight, 'S')
    
    doc.setFontSize(9)
    doc.setTextColor(...corSaldo)
    doc.setFont('helvetica', 'bold')
    doc.text(converterParaLatin1('SALDO'), xPos + 3, yPos + 6)
    
    doc.setFontSize(12)
    doc.setTextColor(...colors.dark)
    doc.text(formatarMoeda(totais.value.saldo), xPos + 3, yPos + 15)
    
    yPos += cardHeight + 15
    
    // Seção de Transações
    doc.setFillColor(...colors.primary)
    doc.rect(15, yPos, 180, 10, 'F')
    
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text(converterParaLatin1(`Transações (${relatoriosFiltrados.value.length})`), 20, yPos + 7)
    
    yPos += 18
    
    // Cabeçalho da tabela
    doc.setFillColor(...colors.background)
    doc.rect(15, yPos, 180, 8, 'F')
    
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...colors.dark)
    
    doc.text('Data', 17, yPos + 5)
    doc.text('Tipo', 40, yPos + 5)
    doc.text('Categoria', 60, yPos + 5)
    doc.text('Descrição', 90, yPos + 5)
    doc.text('Valor', 158, yPos + 5)
    doc.text('Status', 178, yPos + 5)
    
    yPos += 10
    
    // Função auxiliar para processar transações (incluindo parcelas de grupos)
    const obterTodasTransacoes = () => {
      const todas: any[] = []
      
      relatoriosFiltrados.value.forEach(item => {
        if (item.isGrupo) {
          // Adicionar grupo e suas parcelas
          todas.push({
            ...item,
            isGrupoCabecalho: true
          })
          item.parcelas.forEach((parcela: any) => {
            todas.push({
              ...parcela,
              isParcela: true
            })
          })
        } else {
          todas.push(item)
        }
      })
      
      return todas
    }
    
    const todasTransacoes = obterTodasTransacoes()
    
    // Renderizar todas as transações com paginação automática
    for (let i = 0; i < todasTransacoes.length; i++) {
      const transacao = todasTransacoes[i]
      
      // Verificar se precisa de nova página (deixar espaço para rodapé)
      if (yPos > 270) {
        adicionarRodape()
        doc.addPage()
        pageNumber++
        adicionarCabecalho(pageNumber)
        yPos = 25
        
        // Repetir cabeçalho da tabela na nova página
        doc.setFillColor(...colors.background)
        doc.rect(15, yPos, 180, 8, 'F')
        
        doc.setFontSize(8)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(...colors.dark)
        
        doc.text('Data', 17, yPos + 5)
        doc.text('Tipo', 40, yPos + 5)
        doc.text('Categoria', 60, yPos + 5)
        doc.text('Descrição', 90, yPos + 5)
        doc.text('Valor', 158, yPos + 5)
        doc.text('Status', 178, yPos + 5)
        
        yPos += 10
      }
      
      // Renderizar linha
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7)
      
      // Background alternado
      if (i % 2 === 0) {
        doc.setFillColor(250, 250, 250)
        doc.rect(15, yPos - 3, 180, 7, 'F')
      }
      
      // Cor especial para grupos e parcelas
      if (transacao.isGrupoCabecalho) {
        doc.setFillColor(243, 232, 255) // Purple 100
        doc.rect(15, yPos - 3, 180, 7, 'F')
        doc.setFont('helvetica', 'bold')
      } else if (transacao.isParcela) {
        doc.setFillColor(249, 250, 251) // Gray 50
        doc.rect(15, yPos - 3, 180, 7, 'F')
      }
      
      doc.setTextColor(...colors.dark)
      
      // Data
      const dataTexto = transacao.isGrupoCabecalho 
        ? (transacao.proximoVencimento ? formatarData(transacao.proximoVencimento) : '—')
        : formatarData(transacao.data_vencimento || transacao.data)
      doc.text(dataTexto, 17, yPos + 2)
      
      // Tipo com cor
      const tipoTexto = transacao.isGrupoCabecalho ? 'Parcelada' : getTipoNome(transacao.tipo)
      let corTipo = colors.muted
      
      if (!transacao.isGrupoCabecalho) {
        if (transacao.tipo === 'entrada') corTipo = colors.success
        else if (transacao.tipo === 'saida') corTipo = colors.danger
        else if (transacao.tipo === 'dizimo') corTipo = colors.purple
      } else {
        corTipo = colors.purple
      }
      
      doc.setTextColor(...corTipo)
      doc.text(converterParaLatin1(tipoTexto), 40, yPos + 2)
      doc.setTextColor(...colors.dark)
      
      // Categoria
      const categoriaTexto = transacao.categoria_nome || '-'
      doc.text(converterParaLatin1(categoriaTexto.substring(0, 12)), 60, yPos + 2)
      
      // Descrição
      let descricaoTexto = transacao.descricao
      if (transacao.isGrupoCabecalho) {
        descricaoTexto = `${transacao.descricao} (${transacao.parcelasPagas}/${transacao.totalParcelas})`
      } else if (transacao.isParcela) {
        descricaoTexto = `  > ${transacao.descricao}`
      }
      doc.text(converterParaLatin1(descricaoTexto.substring(0, 35)), 90, yPos + 2)
      
      // Valor com cor
      const valorTexto = transacao.isGrupoCabecalho 
        ? formatarMoeda(transacao.valorTotal)
        : formatarMoeda(transacao.valor)
      
      let corValor = colors.dark
      if (transacao.tipo === 'entrada') corValor = colors.success
      else if (transacao.tipo === 'saida' || transacao.isGrupoCabecalho) corValor = colors.danger
      else if (transacao.tipo === 'dizimo') corValor = colors.purple
      
      doc.setTextColor(...corValor)
      doc.text(valorTexto, 158, yPos + 2)
      doc.setTextColor(...colors.dark)
      
      // Status
      if (!transacao.isGrupoCabecalho) {
        const statusTexto = getStatusNome(transacao.status_pagamento)
        let corStatus = colors.muted
        
        if (transacao.status_pagamento === 'pago') corStatus = colors.success
        else if (transacao.status_pagamento === 'pendente') corStatus = colors.warning
        else if (transacao.status_pagamento === 'vencido') corStatus = colors.danger
        
        doc.setTextColor(...corStatus)
        doc.text(converterParaLatin1(statusTexto), 178, yPos + 2)
      }
      
      yPos += 7
    }
    
    // Adicionar rodapé na última página
    adicionarRodape()
    
    // Salvar PDF
    const nomeArquivo = `relatorio-financeiro-${new Date().toISOString().split('T')[0]}.pdf`
    doc.save(nomeArquivo)
    
    console.log('✅ PDF gerado com sucesso:', nomeArquivo)
    
  } catch (error) {
    console.error('❌ Erro ao exportar PDF:', error)
    alert('Erro ao gerar PDF. Tente novamente.')
  } finally {
    isExporting.value = false
  }
}

const exportarParaExcel = async () => {
  if (isExporting.value) return
  
  try {
    isExporting.value = true
    
    // Importação dinâmica para evitar erro SSR
    const XLSX = await import('xlsx')
    const { saveAs } = await import('file-saver')
    
    // Criar workbook
    const wb = XLSX.utils.book_new()
    
    // Aba 1: Resumo
    const resumoData = [
      ['RELATÓRIO FINANCEIRO'],
      [''],
      ['Gerado em:', new Date().toLocaleDateString('pt-BR')],
      [''],
      ['RESUMO FINANCEIRO'],
      ['Tipo', 'Valor'],
      ['Entradas', totais.value.entradas],
      ['Saídas', totais.value.saidas],
      ['Dízimos', totais.value.dizimos],
      ['Saldo', totais.value.saldo]
    ]
    
    const wsResumo = XLSX.utils.aoa_to_sheet(resumoData)
    
    // Formatação do resumo
    wsResumo['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }, // Título
      { s: { r: 4, c: 0 }, e: { r: 4, c: 1 } }  // Subtítulo
    ]
    
    XLSX.utils.book_append_sheet(wb, wsResumo, 'Resumo')
    
    // Aba 2: Transações
    const transacoesData = [
      ['Data', 'Tipo', 'Categoria', 'Descrição', 'Valor', 'Status', 'Data Vencimento', 'Observações']
    ]
    
    relatoriosFiltrados.value.forEach(relatorio => {
      transacoesData.push([
        formatarData(relatorio.data),
        getTipoNome(relatorio.tipo),
        relatorio.categoria_nome,
        relatorio.descricao,
        relatorio.valor,
        getStatusNome(relatorio.status_pagamento),
        relatorio.data_vencimento ? formatarData(relatorio.data_vencimento) : '',
        relatorio.observacoes || ''
      ])
    })
    
    const wsTransacoes = XLSX.utils.aoa_to_sheet(transacoesData)
    
    // Ajustar largura das colunas
    wsTransacoes['!cols'] = [
      { wch: 12 }, // Data
      { wch: 10 }, // Tipo
      { wch: 15 }, // Categoria
      { wch: 30 }, // Descrição
      { wch: 12 }, // Valor
      { wch: 12 }, // Status
      { wch: 15 }, // Data Vencimento
      { wch: 25 }  // Observações
    ]
    
    XLSX.utils.book_append_sheet(wb, wsTransacoes, 'Transações')
    
    // Salvar arquivo
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    
    const nomeArquivo = `relatorio-financeiro-${new Date().toISOString().split('T')[0]}.xlsx`
    saveAs(blob, nomeArquivo)
    
  } catch (error) {
    console.error('Erro ao exportar Excel:', error)
    alert('Erro ao gerar Excel. Tente novamente.')
  } finally {
    isExporting.value = false
  }
}

const limparFiltros = () => {
  filtros.value = {
    dataInicial: '',
    dataFinal: '',
    tipo: ''
  }
}

// Função para alternar expansão de grupo
const toggleGrupoExpansao = (grupoId: string) => {
  if (despesasParceladasExpandidas.value.has(grupoId)) {
    despesasParceladasExpandidas.value.delete(grupoId)
  } else {
    despesasParceladasExpandidas.value.add(grupoId)
  }
}

// Funções de paginação
const irParaPagina = (pagina: number) => {
  if (pagina >= 1 && pagina <= totalPaginas.value) {
    paginaAtual.value = pagina
    // Scroll suave para o topo da tabela
    const tabela = document.querySelector('.transacoes-tabela')
    if (tabela) {
      tabela.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
}

const proximaPagina = () => {
  if (paginaAtual.value < totalPaginas.value) {
    irParaPagina(paginaAtual.value + 1)
  }
}

const paginaAnterior = () => {
  if (paginaAtual.value > 1) {
    irParaPagina(paginaAtual.value - 1)
  }
}

// Resetar página quando filtros mudarem
watch(filtros, () => {
  paginaAtual.value = 1
}, { deep: true })
</script>