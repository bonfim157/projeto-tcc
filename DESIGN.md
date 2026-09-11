---
name: EduCalendário
description: Portal escolar de calendário, comunicação e gestão educacional para professores, gestores e alunos.
colors:
  professor-accent: "#1E40AF"
  professor-accent-light: "#DBEAFE"
  gestao-accent: "#7C3AED"
  gestao-accent-light: "#EDE9FE"
  aluno-accent: "#059669"
  aluno-accent-light: "#DCFCE7"
  surface: "#F8FAFC"
  surface-card: "#FFFFFF"
  border-subtle: "#E2E8F0"
  text-primary: "#1E293B"
  text-muted: "#94A3B8"
  text-label: "#64748B"
  category-urgente-bg: "#FEE2E2"
  category-urgente-fg: "#991B1B"
  category-urgente-hex: "#dc2626"
  category-avaliacao-bg: "#FEF3C7"
  category-avaliacao-fg: "#92400E"
  category-avaliacao-hex: "#d97706"
  category-atividade-bg: "#D1FAE5"
  category-atividade-fg: "#065F46"
  category-atividade-hex: "#16a34a"
  category-informativo-bg: "#DBEAFE"
  category-informativo-fg: "#1E40AF"
  category-informativo-hex: "#1a73e8"
  category-cultural-bg: "#EDE9FE"
  category-cultural-fg: "#5B21B6"
  category-cultural-hex: "#7c3aed"
  category-outros-bg: "#FFEDD5"
  category-outros-fg: "#9A3412"
  category-outros-hex: "#ea580c"
  scrollbar-thumb: "#CBD5E1"
  scrollbar-thumb-hover: "#94A3B8"
  login-dark-professor: "#0d1117"
  login-dark-gestao: "#0b0618"
  login-dark-aluno: "#052e16"
typography:
  display:
    fontFamily: "Nunito, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 900
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Nunito, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 800
    lineHeight: 1.3
  title:
    fontFamily: "Nunito, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 700
    lineHeight: 1.4
  body:
    fontFamily: "Nunito, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.5
  label:
    fontFamily: "Nunito, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.05em"
  micro:
    fontFamily: "Nunito, sans-serif"
    fontSize: "0.625rem"
    fontWeight: 700
    lineHeight: 1.4
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  "2xl": "24px"
  full: "9999px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "5": "20px"
  "6": "24px"
components:
  button-primary:
    backgroundColor: "{colors.professor-accent}"
    textColor: "#FFFFFF"
    rounded: "{rounded.lg}"
    padding: "8px 16px"
  button-today:
    backgroundColor: "transparent"
    textColor: "{colors.text-label}"
    rounded: "{rounded.lg}"
    padding: "6px 12px"
  calendar-day:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
  calendar-day-today:
    backgroundColor: "rgba(30,64,175,0.05)"
    textColor: "{colors.professor-accent}"
    rounded: "{rounded.lg}"
  event-chip:
    backgroundColor: "{colors.category-informativo-bg}"
    textColor: "{colors.category-informativo-fg}"
    rounded: "{rounded.sm}"
    padding: "2px 6px"
  sidebar-nav-active:
    backgroundColor: "rgba(255,255,255,0.15)"
    textColor: "#FFFFFF"
    rounded: "{rounded.xl}"
    padding: "10px 12px"
  sidebar-nav-default:
    backgroundColor: "transparent"
    textColor: "rgba(255,255,255,0.65)"
    rounded: "{rounded.xl}"
    padding: "10px 12px"
---

# Design System — EduCalendário

## Overview

**Creative North Star: "A Sala dos Professores Digital"**

O EduCalendário é um sistema operacional de escola: funcional, hierárquico, e construído para decisões rápidas. O design não adorna — organiza. A tela principal é um calendário de trabalho real, não um marketing asset; cada elemento existe porque alguém precisa ver ou fazer algo.

A identidade muda conforme o papel do usuário. Professor carrega o azul institucional denso de uma escola pública moderna. Gestão usa o roxo de autoridade deliberada. Aluno recebe o verde de presença e pertencimento. Essa identidade não é cosmética: o `--accent` ativo tinge a sidebar, os botões de ação, o anel de foco do dia atual — é o sistema reconhecendo quem você é enquanto você trabalha.

A página de login é o oposto do dashboard: escura, íntima, focada em um único gesto de seleção de papel. O fundo muda de cor quando o usuário escolhe seu perfil, sinalizando "você entrou no espaço desse papel" antes mesmo de autenticar. A passagem do dark do login para o branco do dashboard é a transição do corredor para a sala de aula.

**Key Characteristics:**
- Identidade visual determinada pelo papel (`[data-role]`), não pelo branding fixo
- Modo **Operate**: a tarefa do usuário é criar, aprovar e consultar — não ser persuadido
- Tipografia Nunito — arredondada, amigável, legível em tamanhos pequenos de grade
- Fundo `slate-50` no dashboard; branco puro nas superfícies de card — hierarquia por tom, não por sombra
- Dark profundo na tela de login por contraste intencional com o sistema interno
- Touch targets mínimos 44px — sistema desenhado para tablets de coordenação escolar

---

## Colors

A paleta é **tripartite por papel + semântica de categoria**. O acento é a única cor com personalidade; os neutros são totalmente funcionais.

### Primary (por papel — variável via CSS custom property `--accent`)

- **Azul Institucional** (`#1E40AF` / professor): Cor de autoridade educacional. Tinge toda a identidade quando o papel ativo é professor — sidebar, botões de ação primária, anel do dia atual, seleção de texto.
- **Roxo de Gestão** (`#7C3AED` / gestao): Diferencia administrativos de docentes. Comunica hierarquia sem conflitar com azul no mesmo layout.
- **Verde de Presença** (`#059669` / aluno): Mais suave em autoridade; evoca crescimento e pertencimento.

**The Role Accent Rule.** Um único `--accent` ativo por sessão. Nunca exibir dois acentos de papel na mesma superfície — isso quebraria a identidade contextual que faz o sistema legível.

### Neutral

- **Surface Base** (`#F8FAFC`): Fundo do layout do dashboard. Separa o canvas do branco puro dos cards.
- **Card White** (`#FFFFFF`): Superfície de todas as células do calendário, painéis laterais e modais.
- **Border Subtle** (`#E2E8F0`): Divisores de célula, bordas de input no estado padrão. Presente mas nunca chamativo.
- **Text Primary** (`#1E293B`): Títulos de eventos, nomes de usuário, rótulos de navegação ativos.
- **Text Label** (`#64748B`): Labels de categorias, textos secundários de painel.
- **Text Muted** (`#94A3B8`): Números de dia no calendário (dias não-hoje), timestamps de chat, metadados.
- **Scrollbar Thumb** (`#CBD5E1` / hover `#94A3B8`): Scrollbar personalizada de 6px — presente mas discreta.

### Semântica de Categoria (6 cores)

Cada categoria de evento tem um par `light` (fundo do chip) e `dark` (texto do chip), garantindo contraste interno independente do fundo da célula:

| Categoria   | Fundo chip | Texto chip | Hex sólido  |
|-------------|------------|------------|-------------|
| Urgente     | `#FEE2E2`  | `#991B1B`  | `#dc2626`   |
| Avaliação   | `#FEF3C7`  | `#92400E`  | `#d97706`   |
| Atividade   | `#D1FAE5`  | `#065F46`  | `#16a34a`   |
| Informativo | `#DBEAFE`  | `#1E40AF`  | `#1a73e8`   |
| Cultural    | `#EDE9FE`  | `#5B21B6`  | `#7c3aed`   |
| Outros      | `#FFEDD5`  | `#9A3412`  | `#ea580c`   |

**The Chip Contrast Rule.** Chips de evento sempre usam o par `light/dark` correspondente — nunca o hex sólido como fundo num chip. O hex sólido é reservado para os botões de seleção de categoria no modal, onde o fundo saturado mais opacidade comunica "escolhido vs. não escolhido".

### Dark Login (fundos de tela de seleção de papel)

- **Professor Dark** (`#0d1117`): Quase preto com tom azulado.
- **Gestão Dark** (`#0b0618`): Quase preto com ton violeta.
- **Aluno Dark** (`#052e16`): Quase preto com tom verde escuro.

Esses fundos são exclusivos da tela de login. Não aparecem no dashboard.

---

## Typography

**Fonte principal:** Nunito (Google Fonts — subsets: latin, pesos: 400/500/600/700/800)

**Character:** Nunito é geométrica com terminações arredondadas — mantém legibilidade em 10–11px (tamanho dos chips de evento) sem perder personalidade. A extremidade arredondada a distingue do Swiss funcional sem ser informal.

**The One Font Rule.** O sistema usa exclusivamente Nunito. Não há fonte secundária para display, mono ou label. Variações de papel e hierarquia são expressas por peso e tamanho dentro da mesma família.

### Hierarchy

- **Display** (900, 1.75rem, lh 1.15, tracking -0.02em): Título do modal de novo evento, headline de boas-vindas na tela de login. Máximo uma ocorrência por superfície.
- **Headline** (800, 1.25rem, lh 1.3): Nome do mês/ano no header do calendário. `font-extrabold` em Tailwind.
- **Title** (700, 0.875rem, lh 1.4): Nomes de seção no painel lateral ("Pendentes de Aprovação", "Próximos Eventos"), nome do usuário na sidebar.
- **Body** (500–600, 0.875rem, lh 1.5): Texto principal de conteúdo. Títulos de eventos no modal, mensagens de chat, texto de observações.
- **Label** (700, 0.75rem, tracking 0.05em): Cabeçalhos de dia da semana, badges de categoria no modal, rótulos de status ("pendente", "rejeitado"), itens de navegação na sidebar.
- **Micro** (700, 0.625rem / 10–11px): Números de dia no calendário, counters de evento nas células, timestamps de chat. Menor tamanho no sistema.

---

## Layout

### Dashboard

O dashboard é um layout de **três colunas fixas em desktop** que colapsa para **coluna única + bottom-sheet em mobile**:

```
┌─────────────┬──────────────────────────────┬──────────────┐
│  Sidebar    │         Topbar               │              │
│  (w-64)     ├──────────────────────────────┤  RightPanel  │
│  sticky     │                              │  (w-80)      │
│  full-height│      Calendar Grid           │  sticky      │
│             │      (flex-1)                │  full-height │
└─────────────┴──────────────────────────────┴──────────────┘
```

- **Container:** `h-screen overflow-hidden` — sem scroll na página; scroll ocorre internamente em cada coluna.
- **Sidebar:** `w-64`, fundo `--accent`, fixa. Mobile: drawer oculto (`-translate-x-full`) que desliza via `ShellContext`.
- **Topbar:** `h-16`, branca com `border-b border-slate-100`. Exibe hambúrguer no mobile, avatar do usuário, mês/ano atual.
- **Calendar:** `flex-1 overflow-y-auto p-4 md:p-6` — conteúdo central com scroll próprio.
- **RightPanel:** `w-80`, `border-l border-slate-100`, `bg-slate-50/50`. Mobile: bottom-sheet com FAB flutuante.

### Calendário (grade)

- **Grid:** `grid grid-cols-7 gap-1 md:gap-2` — 7 colunas fixas sem responsividade de coluna; o conteúdo interno adapta.
- **Célula:** `min-h-16 sm:min-h-24` — altura mínima crescente. Em desktop comporta até 3 chips de evento visíveis.
- **Header do calendário:** flex row em sm+, flex column em mobile, com navegação de meses centralizada e botões de ação à direita.

### Tela de Login

- Layout centralizado vertical e horizontal, `min-h-screen`, padding `p-6`.
- Largura máxima dos cards de papel: `max-w-2xl` para os três cards em linha (`flex-col sm:flex-row`).
- Formulário de autenticação: `max-w-sm`, card branco com `rounded-2xl p-7`.

### Responsividade

| Breakpoint | Mudança principal |
|---|---|
| `< 640px` (mobile) | Sidebar vira drawer; RightPanel vira bottom-sheet; cabeçalhos de dia viram iniciais (D/S/T); botão "+ Novo Evento" vira `w-11 h-11` com ícone |
| `≥ 640px` (sm) | Cards de login em linha; botão de novo evento com texto; células do calendário crescem para `min-h-24` |
| `≥ 768px` (md) | Sidebar permanente; RightPanel permanente; padding interno do calendário aumenta; gap de grade aumenta |

---

## Elevation & Depth

O sistema é **quase plano**: a hierarquia de profundidade vem de diferença de tom (slate-50 → branco) e bordas sutis, não de sombras expressivas. Sombras existem em dois papéis muito específicos.

**The Flat-By-Default Rule.** Cards do calendário, itens da sidebar, e painéis laterais são planos em repouso. Sombra aparece como resposta a estado (hover do card, modal aberto) — nunca no estado padrão de elementos repetitivos.

### Shadow Vocabulary

- **`--shadow-card`** (`0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)`): Usada em cards do painel lateral (ApprovalPanel, ChatPanel, ScheduleView) para separá-los do fundo `slate-50/50`. Nunca nas células da grade do calendário.
- **`--shadow-modal`** (`0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)`): Exclusiva para o modal de criação de evento. Eleva claramente o modal sobre o overlay.
- **Ring do dia atual** (`box-shadow: 0 0 0 2px var(--accent)`): Anel de destaque na célula do dia corrente — usa o acento de papel para sinalizar "você está aqui".
- **Bottom-sheet mobile** (`box-shadow: 0 -4px 24px rgba(0,0,0,0.15)`): Sombra superior no painel bottom-sheet mobile; comunica que o painel flutua sobre o conteúdo.
- **Modal de login** (`box-shadow: 0 24px 64px rgba(0,0,0,0.6)`): Sombra intensa no card de login branco sobre fundo escuro. Dose máxima no sistema — justificada pelo alto contraste do cenário.

---

## Shapes

O sistema usa uma linguagem de cantos **consistentemente arredondada** — nunca cantos vivos, nunca `rounded-full` em superfícies de conteúdo (apenas em elementos circulares e badges).

**The Rounded Consistency Rule.** Todo card, modal, painel, input e botão usa cantos arredondados. A quantidade varia pelo tamanho e peso do elemento — maior o elemento, maior o raio.

| Elemento | Raio | Valor |
|---|---|---|
| Chips de evento na grade | `rounded` (Tailwind) | 4px |
| Botões pequenos ("Hoje", badge de status) | `rounded-lg` | 8px |
| Inputs de formulário | `rounded-lg` | 8px |
| Células do calendário | `rounded-lg` | 8px |
| Botões de ação primária | `rounded-lg` | 8px |
| Cards de painel lateral | `rounded-2xl` | 16px |
| Modal de novo evento | `sm:rounded-2xl rounded-t-2xl` | 16px (desktop) / top-only mobile |
| Itens de navegação na sidebar | `rounded-xl` | 12px |
| Avatar do usuário | `rounded-full` | 9999px |
| Badge contador de eventos | `rounded-full` | 9999px |
| Scrollbar thumb | `rounded-full` | 9999px |
| Bottom-sheet mobile | `rounded-t-2xl` | top corners apenas |
| Card de formulário do login | `rounded-2xl` | 16px |
| Cards de papel na seleção de login | `rounded-2xl` | 16px |

---

## Components

### Sidebar

A sidebar é a identidade do papel em forma de navegação: fundo `--accent` com texto branco, items de nav arredondados, marcador de ativo com `inset 3px 0 0 rgba(255,255,255,0.7)` no left edge.

- **Shape:** `w-64`, altura total, `rounded-xl` nos items de nav (12px)
- **Background:** `var(--accent)` — muda com o papel logado
- **Nav item padrão:** `rgba(255,255,255,0.65)`, fundo `transparent`
- **Nav item ativo:** branco puro, fundo `rgba(255,255,255,0.15)`, shadow inset esquerda
- **Hover:** `hover:bg-white/15`
- **Touch target:** `min-height: 44px` em todos os items
- **Avatar do usuário:** círculo `w-10 h-10 rounded-full`, fundo `rgba(255,255,255,0.2)`, iniciais em bold
- **Indicador online:** `w-2 h-2 rounded-full bg-emerald-400` fixo no canto direito do avatar
- **Mobile:** `fixed inset-y-0 left-0`, controlado por `ShellContext` via `translate-x`

### Topbar

- **Shape:** `h-16`, `border-b border-slate-100`, fundo branco
- **Conteúdo:** Hambúrguer (mobile-only) + Mês/Ano + Avatar do usuário à direita
- **Avatar:** `w-9 h-9 rounded-full`, fundo `--accent`, iniciais brancas

### Células do Calendário

O componente de maior densidade visual do sistema — precisa comunicar dia, status e categoria em `min-h-16` (64px).

- **Padrão:** fundo branco, `border-slate-100`, `rounded-lg`
- **Hover (usuários que podem criar):** `border-[--accent]/30 shadow-sm`
- **Dia atual:** fundo `[--accent]/5`, `border-[--accent]/40`, anel `shadow-[0_0_0_2px_var(--accent)]`
- **Número do dia:** `text-xs font-bold text-slate-400`; dia atual: `text-[--accent] font-extrabold`
- **Badge contador:** `w-4 h-4 rounded-full`, fundo `--accent`, texto branco 10px, posição `absolute -top-1.5 -right-1.5`
- **Botão + hover:** `w-5 h-5 rounded-full bg-[--accent] text-white`, `opacity-0 group-hover:opacity-100`

### Chips de Evento (dentro das células)

- **Shape:** `rounded text-[11px] px-1.5 py-0.5` — compactos ao máximo
- **Cor:** par `light/dark` da categoria (fundo light, texto dark)
- **Ícone de pendente:** emoji ⏳ inline à esquerda, opacidade 70% no chip inteiro
- **Truncate:** sempre — nunca quebra linha dentro da célula
- **Overflow:** máximo 2 chips visíveis; `"+N mais"` como link de expansão

### Modal de Evento

Bottom-sheet em mobile (`items-end`), centralizado em desktop (`sm:items-center`).

- **Overlay:** `rgba(0,0,0,0.45)` com `backdrop-filter: blur(4px)`
- **Card:** `bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl p-6`
- **Sombra:** `--shadow-modal`
- **Seleção de categoria:** grid 3×2, botões com fundo sólido (hex da categoria), opacidade 55% nos não-selecionados, `box-shadow: 0 0 0 2px white, 0 0 0 4px {hex}` no selecionado
- **Inputs:** `border border-slate-200 rounded-lg px-4 py-2.5`, focus `ring-2 ring-[--accent]`
- **Botão primário:** fundo `--accent`, `rounded-lg`, `min-height: 44px`
- **Fechar:** `w-11 h-11 rounded-full hover:bg-slate-100` — touch target garantido

### Painel Lateral Direito (RightPanel)

- **Desktop:** `w-80 border-l border-slate-100 bg-slate-50/50`
- **Tabs:** 2 abas ("Visão Geral" / "Horários"), `border-b border-slate-100`, aba ativa com `border-[--accent] text-[--accent]`
- **Cards internos:** `bg-white rounded-2xl p-4 shadow-sm border border-slate-100`
- **Mobile:** FAB circular `w-14 h-14 rounded-full bg-[--accent]` + bottom-sheet `rounded-t-2xl max-h-[80vh]`

### ApprovalPanel (Gestão)

- **Visível apenas para papel `gestao`**
- Badge de contagem: `bg-amber-100 text-amber-700 rounded-full`
- Cards de evento pendente: `border border-slate-100 rounded-xl p-3`
- Dot de categoria: `w-2 h-2 rounded-full` com o hex sólido da categoria
- Botões: Aprovar (`bg-emerald-500`) / Rejeitar (`bg-red-500`) — ambos `rounded-lg py-2 text-xs font-bold text-white`

### Chat

- **Container:** `rounded-2xl p-4 height: 320px` fixo
- **Mensagens próprias:** alinhadas à direita, fundo `--accent`, texto branco, `rounded-2xl rounded-tr-sm`
- **Mensagens alheias:** alinhadas à esquerda, fundo `slate-100`, texto `slate-800`, `rounded-2xl rounded-tl-sm`
- **Input:** `border border-slate-200 rounded-lg text-xs`
- **Botão enviar:** `bg-[--accent] rounded-lg px-3 py-2`
- **Polling:** exibe "atualiza a cada 5s" como label auxiliar

### Tela de Login

**Seleção de papel (fase 1):**
- Cards de papel: `rounded-2xl px-6 py-8`, fundo `rgba(255,255,255,0.04)`, borda `rgba(255,255,255,0.08)`
- Hover: borda muda para a cor do papel, fundo muda para `{cor}22`
- Ícone do papel: emoji 4xl centralizado
- CTA interno: pill `rounded-full px-4 py-1.5 text-xs font-semibold` com fundo `{cor}30` e texto na cor do papel

**Formulário de autenticação (fase 2):**
- Card branco: `rounded-2xl p-7`, `shadow-[0_24px_64px_rgba(0,0,0,0.6)]`
- Marcador de papel: `w-1 h-5 rounded-full` com cor do papel + label uppercase tracking-widest
- Inputs: `border border-slate-200 rounded-lg`, focus `ring-2` na cor do papel
- Botão de submit: fundo cor do papel, `rounded-lg min-height: 44px`, spinner de loading inline
- Erro: `bg-red-50 border border-red-200 text-red-700 rounded-lg`
- Botão "← Trocar perfil": texto `rgba(255,255,255,0.4)`, hover `rgba(255,255,255,0.9)`, touch target `44px`

---

## Funcionalidades do Front-End

Esta seção documenta as features de UI a implementar ou expandir, com comportamento esperado, estados e regras de acesso por papel.

### 1. Autenticação

**Tela de seleção de papel:**
- 3 cards (Professor / Gestão / Aluno) com transição de cor de fundo ao selecionar
- Animação de entrada escalonada dos cards (stagger 0/80/160ms)
- Transição fade (180ms) entre fase de seleção e formulário

**Formulário de login:**
- Campos login + senha com preenchimento automático dos dados demo
- Loading spinner no botão enquanto autenticando
- Erro exibido inline (sem alert), com animação `shake` (400ms)
- Botão "← Trocar perfil" retorna à fase anterior com fade

**Estados:**
- [ ] Seleção de papel
- [ ] Formulário de papel selecionado
- [ ] Loading (aguardando resposta da API)
- [ ] Erro de credencial
- [ ] Redirecionamento para dashboard após sucesso

---

### 2. Dashboard — Layout

**Shell + Sidebar (desktop):**
- Sidebar fixa à esquerda com identidade do papel
- Indicador visual do item de navegação ativo (inset border + opacidade)
- Stagger de entrada nos items de nav (delays de 0/40/80/120/160ms)

**Topbar:**
- Hambúrguer abre drawer da sidebar no mobile
- Exibe mês e ano atual como headline
- Avatar com iniciais do usuário

**Drawer mobile:**
- Overlay semitransparente ao fundo
- Sidebar desliza da esquerda com `slideInLeft` (300ms)
- Fecha ao clicar no overlay, no ✕ interno, ou ao navegar

**RightPanel mobile:**
- FAB circular fixo `bottom: 20px right: 20px`
- Overlay + bottom-sheet ao clicar no FAB
- Handle visual de arraste no topo do sheet
- Fecha com Escape, clique no overlay, ou ✕

---

### 3. Calendário

**Grade mensal:**
- Header: mês/ano + botões de navegação arredondados + botão "Hoje" + botão "+ Novo Evento"
- Cabeçalho de dias: nomes abreviados (desktop) / iniciais (mobile)
- Células: renderização lazy de 7×6 = até 42 células por mês
- Dia atual: destaque com ring `--accent` e fundo tintado
- Legenda de categorias no rodapé da grade
- Contador "Total este mês: N" abaixo da legenda

**Células interativas:**
- Clique na célula abre modal de criação (apenas Professor e Gestão)
- Hover revela botão `+` no canto inferior direito da célula
- Expansão inline de eventos (máx 2 visíveis, clique expande todos)

**Visualização por papel:**
- **Aluno:** vê apenas eventos com `status === 'approved'`
- **Professor/Gestão:** vê todos os eventos incluindo pendentes (opacidade 70% + ⏳)

**Estados de célula:**
- [ ] Vazia
- [ ] Com eventos (chips)
- [ ] Dia atual
- [ ] Hover (com permissão de criação)
- [ ] Expandida (overflow de eventos)

**A implementar — Vista Semana:**
- O botão "Semana" existe mas não renderiza view diferente
- Deve exibir 7 colunas com os dias da semana atual, com colunas de horário

---

### 4. Modal de Criação de Evento

**Comportamento:**
- Abre ao clicar em célula ou no botão "+ Novo Evento" do header
- Bottom-sheet em mobile, modal centralizado em desktop
- Fecha com Escape, clique no overlay, ou botão ✕
- Overlay com blur (`backdrop-filter: blur(4px)`)

**Campos:**
- Título (obrigatório, max 200 chars, autoFocus)
- Categoria: grid 3×2 com botões coloridos, opacidade diferencia selecionado/não-selecionado
- Observações (opcional, textarea 3 linhas, max 500 chars)

**Aviso contextual:**
- Professores veem aviso "⏳ Seu evento ficará pendente até a gestão aprovar"
- Gestão cria eventos já aprovados (sem aviso)

**Estados:**
- [ ] Formulário vazio (data da célula clicada pré-preenchida)
- [ ] Com dados (título preenchido, categoria selecionada)
- [ ] Enviando (botão disabled + spinner)
- [ ] Erro de validação (mensagem inline, sem fechar o modal)

---

### 5. Painel de Aprovação (Gestão)

**Visibilidade:** exclusivo para `papel === 'gestao'`

**Estado vazio:** ícone ✅ + "Nenhum evento pendente"

**Estado com pendentes:**
- Badge numérico com total de pendentes
- Card por evento: dot de categoria + título truncado + data + login do autor + nota (se houver)
- Input de motivo por evento (placeholder "Motivo (opcional)...")
- Botões Aprovar (verde) / Rejeitar (vermelho) por evento
- Feedback imediato: após ação, lista atualiza sem recarregar a página

**Regra do motivo:** motivo é obrigatório para rejeição (validação no backend).

---

### 6. Chat

**Comportamento:**
- Container de altura fixa (320px) com scroll interno
- Auto-scroll para última mensagem ao receber novas
- Polling a cada 5 segundos (label visual informando)
- Mensagem própria vs. alheia com layout diferenciado (right/left)

**Input:**
- Envio por Enter ou clique no botão ↑
- Botão desabilitado enquanto texto vazio ou enviando
- Limpa input após envio bem-sucedido

**A implementar:**
- Substituição do polling por Supabase Realtime (websocket)
- Indicador de "digitando..."
- Leitura de mensagem (double-check)

---

### 7. Horários

**Tab "Horários" no RightPanel:**
- Agrupamento por turma
- Linhas: dia da semana + slot (1º, 2º...) + disciplina
- Ordenação por dia e depois por slot

**A implementar:**
- CRUD de horários para Gestão
- Filtro por turma quando houver múltiplas

---

### 8. Estados globais a implementar

| Estado | Onde aparece | Tratamento atual |
|---|---|---|
| Loading inicial do dashboard | Tela inteira | Skeleton de 35 células + sidebar cinza |
| Erro de rede na validação | Dashboard | Redireciona para login |
| Lista de eventos vazia | RightPanel | Texto "Nenhum evento cadastrado" |
| Chat sem mensagens | ChatPanel | Texto "Sem mensagens ainda" |
| Supabase não configurado | Todas as rotas | Fallback automático para JSON local |

---

## Do's and Don'ts

### Do:

- **Do** usar `--accent` de CSS custom property para toda cor de destaque — nunca um hex hardcoded de papel fora do globals.css.
- **Do** manter `min-height: 44px` em todos os elementos clicáveis — botões, links, items de nav, e targets de formulário.
- **Do** usar o par `light/dark` de categoria em chips de evento — `light` como fundo, `dark` como texto.
- **Do** exibir chips de evento com `opacity: 70%` e ícone ⏳ quando `status === 'pending'`.
- **Do** usar Nunito em todos os pesos de 400 a 800 — peso é o principal diferenciador hierárquico.
- **Do** usar `cubic-bezier(0.4, 0, 0.2, 1)` (Material easing) como padrão para todas as transições de UI.
- **Do** usar `rounded-2xl` em cards de painel e modais; `rounded-lg` em cells, inputs e botões; `rounded-full` exclusivamente para avatares, badges e scrollbar.
- **Do** aplicar stagger de entrada (delays de 40–80ms por item) em listas de navegação e cards de seleção de papel.
- **Do** respeitar `@media (prefers-reduced-motion: reduce)` — todas as animações têm duração de 0.01ms nesse modo.

### Don't:

- **Don't** exibir dois acentos de papel na mesma tela — `--accent` é uma identidade singular por sessão.
- **Don't** usar sombra em células da grade do calendário no estado padrão — apenas `border-slate-100` em repouso.
- **Don't** usar o hex sólido de categoria como fundo de chip — apenas em botões de seleção no modal onde opacidade diferencia o estado.
- **Don't** mostrar eventos com `status === 'pending'` para `papel === 'aluno'` — filtro obrigatório no componente Calendar.
- **Don't** usar gradient text — hierarquia tipográfica vem de peso e tamanho, não de efeito.
- **Don't** usar `border-left` colorido acima de 1px em cards de aprovação ou chips — o dot circular de categoria já carrega a informação de cor.
- **Don't** usar emoji como substituto de ícone de ação (apenas ⏳ de status e 📚/🗓️/💬/📊 como identificadores visuais de seção, nunca como CTA).
- **Don't** abrir modal para navegação entre seções — navegação usa a sidebar diretamente.
- **Don't** usar os fundos dark de login (`#0d1117`, `#0b0618`, `#052e16`) fora da tela de autenticação.
- **Don't** exibir o ApprovalPanel para papéis diferentes de `gestao` — verificação de papel obrigatória no componente.
