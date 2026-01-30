import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { PlacarMCI } from './components/PlacarMCI'
import { getEtapa, tocarTrilhaEtapa, resumeAudio, tocarMotivacao, getDuracaoMotivacaoSeg } from './utils/trilhaEtapas'
import { getImagemClientePorEtapa } from './utils/imagensCliente'
import './App.css'

const mciDescricao = (
  <>
    Para este ciclo, o MCI (Meta Crucialmente Importante) é reduzir o tempo
    de produção de um relatório estratégico de 5 horas para 2 horas.
    <br />
    <br />
    O prazo final definido para alcançar esse resultado é o dia 28/02/2026.
    <br />
    <br />
    Para atingir essa meta, as medidas de direção estabelecidas incluem:
    <br />
    • Definição de um relatório padrão em HTML.
    <br />
    • Otimização do processo de coleta de dados.
    <br />
    • Upgrade do prompt de análise para resumir resultados e entregar valor,
    integrando dados do GSC, GA4, concorrentes, Meta e tarefas finalizadas.
    <br />
    <br />
    <strong>Queremos a cada semana uma melhoria no tempo de produção do relatório, com o objetivo de reduzir o tempo final de produção para 2 horas.</strong>
  </>
)

const META_INICIAL_HORAS = 5
const META_FINAL_HORAS = 2
const REDUCAO_MAXIMA_HORAS = META_INICIAL_HORAS - META_FINAL_HORAS // 3h

function fraseDoMomento(horas: number): { texto: string; emoji: string; metaBatida: boolean } {
  if (horas > META_INICIAL_HORAS) return { texto: 'Tempo de produção aumentou — vamos reduzir de novo!', emoji: '📈', metaBatida: false }
  if (horas <= META_FINAL_HORAS) return { texto: 'Além da meta! O cliente está sorrindo!', emoji: '🎉', metaBatida: true }
  if (horas <= 2.2) return { texto: 'Você É o Flash! Meta batida!', emoji: '🏃‍♂️💨', metaBatida: true }
  if (horas <= 2.5) return { texto: 'Quase no ritmo do Flash!', emoji: '⚡', metaBatida: false }
  if (horas <= 3) return { texto: 'Pegando velocidade!', emoji: '🏃', metaBatida: false }
  if (horas <= 3.5) return { texto: 'Esquentando os motores!', emoji: '🔥', metaBatida: false }
  if (horas <= 4) return { texto: 'Ainda em câmera lenta...', emoji: '🐢', metaBatida: false }
  if (horas < 5) return { texto: 'O cliente está esperando...', emoji: '⏳', metaBatida: false }
  return { texto: '5h é o ponto de partida. Bora virar o Flash!', emoji: '💤', metaBatida: false }
}

function App() {
  const [fotoClienteUrl, setFotoClienteUrl] = useState<string | null>(null)
  const [nossaFotoUrl, setNossaFotoUrl] = useState<string | null>(null)
  const [numSemanas, setNumSemanas] = useState(8)
  const [tempoPorSemana, setTempoPorSemana] = useState<Record<number, string>>({})
  const [sonsAtivados, setSonsAtivados] = useState(false)
  const [motivacaoTocando, setMotivacaoTocando] = useState(false)

  const handleUploadFotoCliente = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (fotoClienteUrl) URL.revokeObjectURL(fotoClienteUrl)
    setFotoClienteUrl(URL.createObjectURL(file))
  }, [fotoClienteUrl])

  const handleUploadNossaFoto = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (nossaFotoUrl) URL.revokeObjectURL(nossaFotoUrl)
    setNossaFotoUrl(URL.createObjectURL(file))
  }, [nossaFotoUrl])

  const setTempoSemana = useCallback((semana: number, valor: string) => {
    setTempoPorSemana((prev) => ({ ...prev, [semana]: valor }))
  }, [])

  const semanasArray = useMemo(
    () => Array.from({ length: numSemanas }, (_, i) => numSemanas - i),
    [numSemanas]
  )

  const reducaoAcumuladaPorSemana = useMemo(() => {
    const acum: Record<number, number> = {}
    let soma = 0
    for (let s = numSemanas; s >= 1; s--) {
      const v = tempoPorSemana[s]
      const reducaoSemana = parseFloat(String(v ?? ''))
      if (!Number.isNaN(reducaoSemana)) {
        if (reducaoSemana >= 0) {
          soma += Math.min(REDUCAO_MAXIMA_HORAS - soma, reducaoSemana)
        } else {
          soma += reducaoSemana
        }
      }
      acum[s] = soma
    }
    return acum
  }, [numSemanas, tempoPorSemana])

  const dadosProgresso = useMemo(
    () =>
      semanasArray.map((semana) => {
        const reducaoAcumulada = reducaoAcumuladaPorSemana[semana] ?? 0
        const tempoProducao = META_INICIAL_HORAS - reducaoAcumulada
        return {
          semana,
          valor: Math.max(0, tempoProducao),
        }
      }),
    [semanasArray, reducaoAcumuladaPorSemana]
  )

  const dadosMeta = useMemo(() => {
    if (numSemanas <= 1) return [{ semana: 1, valor: META_FINAL_HORAS }]
    return semanasArray.map((semana) => {
      const t = (numSemanas - semana) / (numSemanas - 1)
      const valor = META_INICIAL_HORAS + (META_FINAL_HORAS - META_INICIAL_HORAS) * t
      return { semana, valor: Math.round(valor * 10) / 10 }
    })
  }, [numSemanas, semanasArray])

  const semanasRestantes = useMemo(() => {
    const comValor = semanasArray.filter((semana) => {
      if (semana === numSemanas) return true
      const v = tempoPorSemana[semana]
      if (v === undefined || v === '') return false
      const n = parseFloat(String(v))
      return !Number.isNaN(n)
    })
    return comValor.length > 0 ? Math.min(...comValor) : numSemanas
  }, [semanasArray, numSemanas, tempoPorSemana])

  const progressoAtual = useMemo(() => {
    const reducaoAcumulada = reducaoAcumuladaPorSemana[semanasRestantes] ?? 0
    return META_INICIAL_HORAS - reducaoAcumulada
  }, [reducaoAcumuladaPorSemana, semanasRestantes])

  const { texto: fraseTexto, emoji: fraseEmoji, metaBatida } = useMemo(
    () => fraseDoMomento(progressoAtual),
    [progressoAtual]
  )

  const etapaAtual = useMemo(() => getEtapa(progressoAtual), [progressoAtual])
  const etapaAnteriorRef = useRef<number | null>(null)

  useEffect(() => {
    if (!sonsAtivados) return
    if (etapaAnteriorRef.current !== null && etapaAnteriorRef.current !== etapaAtual) {
      tocarTrilhaEtapa(etapaAtual)
    }
    etapaAnteriorRef.current = etapaAtual
  }, [etapaAtual, sonsAtivados])

  const handleAtivarSons = useCallback(() => {
    resumeAudio()
    setSonsAtivados(true)
  }, [])

  const audioMotivacaoRef = useRef<HTMLAudioElement | null>(null)
  const duracaoMotivacaoMs = getDuracaoMotivacaoSeg() * 1000

  const imagemCliente = useMemo(
    () => fotoClienteUrl ?? getImagemClientePorEtapa(etapaAtual),
    [fotoClienteUrl, etapaAtual]
  )

  const handleMotivacao = useCallback(() => {
    if (motivacaoTocando) return
    resumeAudio()
    setMotivacaoTocando(true)

    const audio = new Audio('/motivacao.mp3')
    audioMotivacaoRef.current = audio

    const pararApos30s = () => {
      setTimeout(() => {
        audio.pause()
        audio.currentTime = 0
        audioMotivacaoRef.current = null
        setMotivacaoTocando(false)
      }, duracaoMotivacaoMs)
    }

    audio.addEventListener('canplaythrough', () => {
      audio.play()
        .then(() => pararApos30s())
        .catch(() => {
          tocarMotivacao()
          pararApos30s()
        })
    }, { once: true })

    audio.addEventListener('error', () => {
      tocarMotivacao()
      pararApos30s()
    }, { once: true })

    audio.load()
  }, [motivacaoTocando, duracaoMotivacaoMs])

  return (
    <main className="app">
      <button
        type="button"
        className="app-btn-motivacao"
        onClick={handleMotivacao}
        disabled={motivacaoTocando}
        title={motivacaoTocando ? `Tocando Eye of the Tiger... (${getDuracaoMotivacaoSeg()}s)` : 'Toca Eye of the Tiger por 30s'}
      >
        {motivacaoTocando ? '🎵 Tocando...' : '💪 Motivação'}
      </button>
      <div className="app-config">
        <section className="app-fotos">
          <h3 className="app-fotos-titulo">Fotos no gráfico</h3>
          <div className="app-fotos-grid">
            <div className="app-upload-card">
              <span className="app-upload-card-titulo">Foto do cliente</span>
              <span className="app-upload-card-desc">Na linha da meta. Se não enviar, a imagem muda sozinha: Primeiras Etapas → Meio do Caminho → Quase Atingindo → Meta Atingida (recomendado 640×640)</span>
              <div className="app-upload-area">
                {fotoClienteUrl ? (
                  <div className="app-upload-preview">
                    <img src={fotoClienteUrl} alt="Preview cliente" />
                    <label className="app-upload-btn app-upload-btn-secondary">
                      Trocar foto
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleUploadFotoCliente}
                        className="app-upload-input-hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <label className="app-upload-btn">
                    Escolher foto do cliente
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadFotoCliente}
                      className="app-upload-input-hidden"
                    />
                  </label>
                )}
              </div>
            </div>
            <div className="app-upload-card">
              <span className="app-upload-card-titulo">Nossa foto</span>
              <span className="app-upload-card-desc">Substitui a pessoa na linha de progresso (recomendado 640×640)</span>
              <div className="app-upload-area">
                {nossaFotoUrl ? (
                  <div className="app-upload-preview">
                    <img src={nossaFotoUrl} alt="Preview nossa foto" />
                    <label className="app-upload-btn app-upload-btn-secondary">
                      Trocar foto
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleUploadNossaFoto}
                        className="app-upload-input-hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <label className="app-upload-btn">
                    Escolher nossa foto
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadNossaFoto}
                      className="app-upload-input-hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="app-semanas-config">
          <div className="app-campo">
            <label htmlFor="num-semanas">Número de semanas (até o prazo)</label>
            <input
              id="num-semanas"
              type="number"
              min={1}
              max={52}
              value={numSemanas}
              onChange={(e) => {
                const n = Math.max(1, Math.min(52, parseInt(e.target.value, 10) || 1))
                setNumSemanas(n)
              }}
            />
          </div>
          <div className="app-campo app-campo-readonly">
            <label>Semanas restantes (atual)</label>
            <span className="app-semanas-restantes-valor">{semanasRestantes}</span>
            <span className="app-semanas-restantes-hint">atualizado conforme o preenchimento da redução por semana</span>
          </div>
        </div>

        <div className="app-tempo-por-semana">
          <span className="app-tempo-por-semana-titulo">Redução nesta semana (horas) — os valores vão somando</span>
          <span className="app-tempo-por-semana-desc">Quanto diminuímos (+) ou aumentamos (−) naquela semana. Valor negativo = tempo de produção aumentou. Ex.: Semana 8 = 0,2h, Semana 7 = 0,5h → total 0,7h diminuídas</span>
          <div className="app-tempo-grid">
            {semanasArray.map((semana) => (
              <div key={semana} className="app-campo app-campo-inline">
                <label htmlFor={`tempo-${semana}`}>Semana {semana}</label>
                <input
                  id={`tempo-${semana}`}
                  type="number"
                  min={-24}
                  max={REDUCAO_MAXIMA_HORAS}
                  step={0.1}
                  placeholder="h (+ ou −)"
                  value={tempoPorSemana[semana] ?? ''}
                  onChange={(e) => setTempoSemana(semana, e.target.value)}
                />
                {reducaoAcumuladaPorSemana[semana] != null && reducaoAcumuladaPorSemana[semana] !== 0 && (
                  <span className="app-tempo-acumulado">
                    Total: {reducaoAcumuladaPorSemana[semana] >= 0 ? '' : '−'}{Math.abs(reducaoAcumuladaPorSemana[semana]).toFixed(1)}h
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={`app-frase ${metaBatida ? 'app-frase-meta' : ''}`}>
        <span className="app-frase-emoji">{fraseEmoji}</span>
        <span className="app-frase-texto">{fraseTexto}</span>
        {metaBatida && <span className="app-frase-badge">Meta batida!</span>}
        {!sonsAtivados && (
          <button type="button" className="app-frase-sons" onClick={handleAtivarSons} title="Ativar trilha sonora ao mudar de etapa">
            🔊 Ativar sons
          </button>
        )}
        {sonsAtivados && (
          <span className="app-frase-sons-ok" title="Sons ativados — cada nova etapa toca uma trilha diferente">🔊</span>
        )}
      </div>

      <PlacarMCI
        titulo="O Cliente tem razão, mas eu sou o Flash"
        mciDescricao={mciDescricao}
        metaTotal={META_FINAL_HORAS}
        progressoAtual={progressoAtual}
        semanasRestantes={semanasRestantes}
        dadosProgresso={dadosProgresso}
        dadosMeta={dadosMeta}
        maxEixoY={Math.max(5, Math.ceil(Math.max(progressoAtual, ...dadosProgresso.map((d) => d.valor))) + 1)}
        minEixoY={0}
        labelEixoY="Tempo de produção (horas)"
        imagemCliente={imagemCliente}
        imagemProgresso={nossaFotoUrl ?? undefined}
      />
    </main>
  )
}

export default App
