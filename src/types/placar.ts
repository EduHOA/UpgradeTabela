import type { ReactNode } from 'react'

export interface PontoPlacar {
  semana: number
  valor: number
}

export interface PlacarMCIProps {
  /** Título do placar (ex: "Vença o Bode") */
  titulo: string
  /** Descrição da MCI (texto ou JSX com quebras de linha) */
  mciDescricao: string | ReactNode
  /** Meta total a atingir */
  metaTotal: number
  /** Valor atual do progresso */
  progressoAtual: number
  /** Semanas restantes (eixo X) */
  semanasRestantes: number
  /** Histórico do progresso por semana */
  dadosProgresso: PontoPlacar[]
  /** Histórico da meta por semana (trajetória do "bode") */
  dadosMeta: PontoPlacar[]
  /** Valor máximo do eixo Y (padrão 450) */
  maxEixoY?: number
  /** Valor mínimo do eixo Y (padrão 0) */
  minEixoY?: number
  /** Rótulo do eixo Y (ex: "Número de Expositores Inscritos" ou "Tempo de produção (horas)") */
  labelEixoY?: string
  /** URL da foto do cliente (ex.: do upload). Se informada, substitui o ícone do bode na linha da meta. Recomendado 640x640. */
  imagemCliente?: string
  /** URL da nossa foto (ex.: do upload). Se informada, substitui o ícone da pessoa na linha de progresso. Recomendado 640x640. */
  imagemProgresso?: string
}
