/**
 * Trilha sonora engraçada para cada etapa do placar (Web Audio API).
 * Toca apenas quando a etapa muda.
 */

let audioContext: AudioContext | null = null

function getContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
  }
  return audioContext
}

export function resumeAudio(): void {
  const ctx = audioContext ?? getContext()
  if (ctx.state === 'suspended') {
    ctx.resume()
  }
}

function beep(
  freq: number,
  durationMs: number,
  type: OscillatorType = 'sine',
  volume = 0.15,
  startTime = 0,
  endFreq?: number
): void {
  try {
    const ctx = getContext()
    const now = ctx.currentTime + startTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = type
    osc.frequency.setValueAtTime(freq, now)
    if (endFreq !== undefined) {
      osc.frequency.linearRampToValueAtTime(endFreq, now + durationMs / 1000)
    }
    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(volume, now + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.001, now + durationMs / 1000)
    osc.start(now)
    osc.stop(now + durationMs / 1000)
  } catch {
    // ignore
  }
}

/** Retorna o índice da etapa (0–7) a partir das horas atuais. */
export function getEtapa(horas: number): number {
  if (horas <= 2) return 7
  if (horas <= 2.2) return 6
  if (horas <= 2.5) return 5
  if (horas <= 3) return 4
  if (horas <= 3.5) return 3
  if (horas <= 4) return 2
  if (horas < 5) return 1
  return 0
}

/** Toca a trilha engraçada da etapa (0–7). */
export function tocarTrilhaEtapa(etapa: number): void {
  resumeAudio()
  const ctx = getContext()
  if (ctx.state !== 'running') return

  switch (etapa) {
    case 0:
      // 5h — ponto de partida: "zzz" (sonolento)
      beep(220, 120, 'sine', 0.12)
      beep(200, 100, 'sine', 0.1, 0.15)
      break
    case 1:
      // Cliente esperando: dois tons baixos
      beep(260, 80, 'triangle', 0.12)
      beep(240, 100, 'triangle', 0.1, 0.12)
      break
    case 2:
      // Câmera lenta: tartaruga
      beep(300, 150, 'sawtooth', 0.08, 0, 180)
      break
    case 3:
      // Esquentando motores: subindo
      beep(320, 100, 'square', 0.08)
      beep(400, 100, 'square', 0.08, 0.1)
      break
    case 4:
      // Pegando velocidade: três notas animadas
      beep(400, 70, 'sine', 0.1)
      beep(500, 70, 'sine', 0.1, 0.08)
      beep(600, 100, 'sine', 0.12, 0.16)
      break
    case 5:
      // Quase no ritmo do Flash
      beep(523, 80, 'sine', 0.12)
      beep(659, 80, 'sine', 0.12, 0.06)
      beep(784, 120, 'sine', 0.14, 0.12)
      break
    case 6:
      // Meta batida! — mini fanfarra
      beep(523, 100, 'sine', 0.15)
      beep(659, 100, 'sine', 0.15, 0.08)
      beep(784, 100, 'sine', 0.15, 0.16)
      beep(1047, 200, 'sine', 0.18, 0.24)
      break
    case 7:
      // Além da meta — vitória
      beep(523, 80, 'sine', 0.14)
      beep(659, 80, 'sine', 0.14, 0.06)
      beep(784, 80, 'sine', 0.14, 0.12)
      beep(1047, 80, 'sine', 0.16, 0.18)
      beep(1319, 250, 'sine', 0.18, 0.24)
      break
    default:
      break
  }
}

/** Trilha motivacional estilo fanfarra (30s). Toca ao clicar em "Motivação". */
function notaMotivacao(
  freq: number,
  startSec: number,
  durationSec: number,
  volume = 0.12,
  type: OscillatorType = 'sine'
): void {
  try {
    const ctx = getContext()
    const t = ctx.currentTime + startSec
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = type
    osc.frequency.setValueAtTime(freq, t)
    gain.gain.setValueAtTime(0, t)
    gain.gain.linearRampToValueAtTime(volume, t + 0.03)
    gain.gain.exponentialRampToValueAtTime(0.001, t + durationSec)
    osc.start(t)
    osc.stop(t + durationSec)
  } catch {
    // ignore
  }
}

const DURACAO_MOTIVACAO_SEG = 30

export function tocarMotivacao(): void {
  resumeAudio()
  const ctx = getContext()
  if (ctx.state !== 'running') return

  const C4 = 262
  const D4 = 294
  const E4 = 330
  const F4 = 349
  const G4 = 392
  const A4 = 440
  const B4 = 494
  const C5 = 523
  const E5 = 659
  const G5 = 784
  const C6 = 1047
  const E6 = 1319
  const G6 = 1568

  let t = 0
  const beat = 0.4

  // Fanfarra inicial (0–8s)
  notaMotivacao(C4, t, beat * 1.2, 0.14, 'sine')
  t += beat
  notaMotivacao(E4, t, beat * 1.2, 0.14, 'sine')
  t += beat
  notaMotivacao(G4, t, beat * 1.2, 0.14, 'sine')
  t += beat
  notaMotivacao(C5, t, beat * 1.5, 0.16, 'sine')
  t += beat * 1.5
  notaMotivacao(G4, t, beat, 0.14, 'sine')
  t += beat
  notaMotivacao(E4, t, beat * 1.5, 0.14, 'sine')
  t += beat * 2
  notaMotivacao(C5, t, beat * 1.2, 0.15, 'sine')
  t += beat
  notaMotivacao(E5, t, beat * 1.2, 0.15, 'sine')
  t += beat
  notaMotivacao(G5, t, beat * 1.5, 0.16, 'sine')
  t += beat * 1.5
  notaMotivacao(C6, t, beat * 2, 0.18, 'sine')
  t += beat * 2.5

  // Reprise subindo (8–16s)
  t = 8
  notaMotivacao(E4, t, beat, 0.12, 'sine')
  t += beat
  notaMotivacao(G4, t, beat, 0.12, 'sine')
  t += beat
  notaMotivacao(C5, t, beat * 1.2, 0.14, 'sine')
  t += beat * 1.2
  notaMotivacao(E5, t, beat, 0.14, 'sine')
  t += beat
  notaMotivacao(G5, t, beat * 1.2, 0.15, 'sine')
  t += beat * 1.2
  notaMotivacao(C6, t, beat * 1.5, 0.16, 'sine')
  t += beat * 2
  notaMotivacao(E6, t, beat * 2, 0.16, 'sine')
  t += beat * 2.5

  // Build (16–24s)
  t = 16
  notaMotivacao(C5, t, beat * 1.5, 0.14, 'sine')
  t += beat * 1.5
  notaMotivacao(G5, t, beat * 1.5, 0.15, 'sine')
  t += beat * 1.5
  notaMotivacao(C6, t, beat * 2, 0.16, 'sine')
  t += beat * 2.5
  notaMotivacao(G5, t, beat, 0.14, 'sine')
  t += beat
  notaMotivacao(C6, t, beat * 1.5, 0.16, 'sine')
  t += beat * 2
  notaMotivacao(E6, t, beat * 2, 0.16, 'sine')
  t += beat * 2.5

  // Final (24–30s)
  t = 24
  notaMotivacao(C5, t, beat, 0.14, 'sine')
  t += beat
  notaMotivacao(E5, t, beat, 0.14, 'sine')
  t += beat
  notaMotivacao(G5, t, beat, 0.15, 'sine')
  t += beat
  notaMotivacao(C6, t, beat * 1.2, 0.16, 'sine')
  t += beat * 1.2
  notaMotivacao(E6, t, beat * 1.2, 0.16, 'sine')
  t += beat * 1.2
  notaMotivacao(G6, t, beat * 2, 0.18, 'sine')
  t += beat * 2
  notaMotivacao(C6, t, DURACAO_MOTIVACAO_SEG - t, 0.2, 'sine')
}

export function getDuracaoMotivacaoSeg(): number {
  return DURACAO_MOTIVACAO_SEG
}
