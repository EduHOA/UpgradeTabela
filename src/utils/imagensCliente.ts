/**
 * Imagens fixas do cliente que mudam conforme o avanço da meta (etapa 0–7).
 * Se o usuário fizer upload de uma foto, ela substitui a imagem por etapa.
 */

const BASE = '/images/cliente'

export const IMAGENS_CLIENTE_POR_ETAPA = [
  `${BASE}/primeiras_etapas.png`,   // 0: 5h — primeiras etapas (neutro)
  `${BASE}/primeiras_etapas.png`,   // 1: 4–5h — cliente esperando
  `${BASE}/meio_do_caminho.png`,    // 2: 3,5–4h — câmera lenta
  `${BASE}/meio_do_caminho.png`,    // 3: 3–3,5h — esquentando motores
  `${BASE}/quase_atingindo.png`,    // 4: 2,5–3h — pegando velocidade
  `${BASE}/quase_atingindo.png`,    // 5: 2,2–2,5h — quase no ritmo do Flash
  `${BASE}/meta_atingida.png`,      // 6: 2–2,2h — meta batida
  `${BASE}/meta_atingida.png`,      // 7: ≤2h — além da meta
] as const

/** Retorna a URL da imagem do cliente para a etapa (0–7). */
export function getImagemClientePorEtapa(etapa: number): string {
  const i = Math.max(0, Math.min(7, Math.floor(etapa)))
  return IMAGENS_CLIENTE_POR_ETAPA[i]
}
