import { useId } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from 'recharts'
import type { PlacarMCIProps } from '../types/placar'
import './PlacarMCI.css'

const TAMANHO_FOTO_NO_GRAFICO = 64
const RAIO_FOTO = TAMANHO_FOTO_NO_GRAFICO / 2

const COR_PROGRESSO = '#c0392b'
const COR_META = '#7f8c8d'
const COR_GRID = '#e8d48a'
const COR_FUNDO_GRID = 'rgba(232, 212, 138, 0.15)'

function IconePessoa({ cx, cy }: { cx?: number; cy?: number }) {
  return (
    <g transform={`translate(${cx ?? 0},${cy ?? 0})`}>
      <text x={0} y={0} dy={-10} textAnchor="middle" fontSize={18}>
        🏃
      </text>
    </g>
  )
}

function IconeBode({ cx, cy }: { cx?: number; cy?: number }) {
  return (
    <g transform={`translate(${cx ?? 0},${cy ?? 0})`}>
      <text x={0} y={0} dy={-10} textAnchor="middle" fontSize={18}>
        🐐
      </text>
    </g>
  )
}

function IconeFotoNoGrafico({
  cx,
  cy,
  imagemUrl,
  clipId,
}: {
  cx?: number
  cy?: number
  imagemUrl: string
  clipId: string
}) {
  return (
    <g transform={`translate(${cx ?? 0},${cy ?? 0})`}>
      <defs>
        <clipPath id={clipId}>
          <circle r={RAIO_FOTO} cx={0} cy={0} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <image
          href={imagemUrl}
          x={-RAIO_FOTO}
          y={-RAIO_FOTO}
          width={TAMANHO_FOTO_NO_GRAFICO}
          height={TAMANHO_FOTO_NO_GRAFICO}
          preserveAspectRatio="xMidYMid slice"
        />
      </g>
    </g>
  )
}

const LABEL_EIXO_Y_PADRAO = 'Número de Expositores Inscritos'

export function PlacarMCI({
  titulo,
  mciDescricao,
  metaTotal: _metaTotal,
  progressoAtual,
  semanasRestantes,
  dadosProgresso,
  dadosMeta,
  maxEixoY = 450,
  minEixoY = 0,
  labelEixoY = LABEL_EIXO_Y_PADRAO,
  imagemCliente,
  imagemProgresso,
}: PlacarMCIProps) {
  const clipIdMeta = useId().replace(/:/g, '-')
  const clipIdProgresso = useId().replace(/:/g, '-')
  const shapeMeta = imagemCliente
    ? (props: { cx?: number; cy?: number }) => (
        <IconeFotoNoGrafico {...props} imagemUrl={imagemCliente} clipId={clipIdMeta} />
      )
    : IconeBode
  const shapeProgresso = imagemProgresso
    ? (props: { cx?: number; cy?: number }) => (
        <IconeFotoNoGrafico {...props} imagemUrl={imagemProgresso} clipId={clipIdProgresso} />
      )
    : IconePessoa

  const numSemanas = Math.max(
    ...dadosProgresso.map((d) => d.semana),
    ...dadosMeta.map((d) => d.semana),
    1
  )
  // Unir dados para o gráfico (uma linha por série)
  const dados = Array.from({ length: numSemanas }, (_, i) => {
    const semana = numSemanas - i
    const prog = dadosProgresso.find((d) => d.semana === semana)
    const meta = dadosMeta.find((d) => d.semana === semana)
    return {
      semana,
      progresso: prog?.valor ?? 0,
      meta: meta?.valor ?? 0,
    }
  }).reverse()

  const valorAtualProgresso = dadosProgresso.find((d) => d.semana === semanasRestantes)?.valor ?? progressoAtual
  const valorAtualMeta = dadosMeta.find((d) => d.semana === semanasRestantes)?.valor ?? 0

  return (
    <div className="placar-mci">
      <div className="placar-grafico-wrapper">
        <div className="placar-cabecalho">
          <h2 className="placar-titulo">{titulo}</h2>
          <p className="placar-mci-descricao">{mciDescricao}</p>
        </div>

        <ResponsiveContainer width="100%" height={680}>
          <LineChart
            data={dados}
            margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
          >
            <CartesianGrid
              strokeDasharray="0"
              stroke={COR_GRID}
              vertical={false}
              fill={COR_FUNDO_GRID}
            />
            <XAxis
              dataKey="semana"
              type="number"
              domain={[1, numSemanas]}
              reversed
              tickCount={numSemanas}
              label={{
                value: 'Semanas restantes',
                position: 'bottom',
                offset: 0,
              }}
              tick={{ fill: '#333', fontSize: 12 }}
              axisLine={{ stroke: '#666' }}
            />
            <YAxis
              domain={[minEixoY, maxEixoY]}
              tickCount={Math.min(10, maxEixoY - minEixoY + 1)}
              tick={{ fill: '#333', fontSize: 12 }}
              axisLine={{ stroke: '#666' }}
              label={{
                value: labelEixoY,
                angle: -90,
                position: 'insideLeft',
                style: { textAnchor: 'middle' },
              }}
            />
            <Tooltip
              formatter={(value: number) => [value, '']}
              labelFormatter={(label) => `Semana ${label}`}
            />
            {/* Linha de progresso (vermelha, contínua, com pontos) */}
            <Line
              type="monotone"
              dataKey="progresso"
              name="Progresso"
              stroke={COR_PROGRESSO}
              strokeWidth={2}
              dot={{ fill: COR_PROGRESSO, r: 4 }}
              activeDot={{ r: 6 }}
              isAnimationActive={true}
            />
            {/* Linha da meta / bode (cinza, pontilhada) */}
            <Line
              type="monotone"
              dataKey="meta"
              name="Meta (Bode)"
              stroke={COR_META}
              strokeWidth={2}
              strokeDasharray="6 4"
              dot={{ fill: COR_META, r: 3 }}
              activeDot={{ r: 5 }}
              isAnimationActive={true}
            />
            {/* Ícone nossa foto ou pessoa no ponto atual do progresso */}
            <ReferenceDot
              x={semanasRestantes}
              y={valorAtualProgresso}
              r={0}
              shape={shapeProgresso}
            />
            {/* Ícone cliente (foto) ou bode no ponto da meta na mesma semana */}
            <ReferenceDot
              x={semanasRestantes}
              y={valorAtualMeta}
              r={0}
              shape={shapeMeta}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
