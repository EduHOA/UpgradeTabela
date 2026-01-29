# Placar MCI - Vença o Bode

Projeto React + TypeScript com um placar visual para acompanhamento de MCI (Meta Crucialmente Importante), no estilo do concurso de placares.

## O que tem no projeto

- **Placar MCI**: gráfico de linhas com:
  - **Eixo X**: Semanas restantes (10 → 1)
  - **Eixo Y**: Número de expositores inscritos (0 até o valor definido)
  - **Linha vermelha**: progresso real (com pontos e ícone de pessoa)
  - **Linha cinza pontilhada**: meta / “bode” a ser vencido (com triângulos e ícone de bode)
- **Orientações**: painel à direita com as orientações para as apresentações.

## Como rodar

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

3. Abra no navegador o endereço que aparecer no terminal (geralmente `http://localhost:5173`).

### Trilha do botão "Motivação" (30s)

O botão "Motivação" toca **Eye of the Tiger** (Survivor) por **30 segundos**. Coloque o arquivo **`motivacao.mp3`** (a música Eye of the Tiger) na pasta **`public/`**. Se o arquivo não existir, será usada a trilha sintetizada padrão.

## Como usar o componente

O `PlacarMCI` recebe as props definidas em `src/types/placar.ts`. Exemplo em `App.tsx`:

- **titulo**: nome do placar (ex.: "Vença o Bode")
- **mciDescricao**: texto da MCI (ex.: "MCI: Inscrever 428 Expositores...")
- **metaTotal**: meta final (ex.: 428)
- **progressoAtual**: valor atual do progresso
- **semanasRestantes**: semana atual no eixo “semanas restantes”
- **dadosProgresso**: array `{ semana, valor }` com o histórico do progresso
- **dadosMeta**: array `{ semana, valor }` com a trajetória da meta (“bode”)
- **maxEixoY** (opcional): valor máximo do eixo Y (padrão 450)

Ajuste esses dados em `App.tsx` para refletir sua MCI e seus números reais.
