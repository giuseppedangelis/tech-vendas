import { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"
import {
  Users,
  Handshake,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  Lightbulb,
  BarChart3,
  Trophy,
  CheckCircle2,
  MessageSquare,
  CalendarCheck,
  ArrowRightLeft,
  Star,
  Sparkles,
  ChevronRight,
  Clock,
  Target,
  Zap,
  MessageCircle,
  ListChecks,
  UserCheck,
  Filter,
  Camera,
  Globe,
  Flame,
  Plus,
  Mail,
} from "lucide-react"
import { useAuth, type AuthUser } from "@/hooks/use-auth"
import { Link } from "react-router-dom"

// ---------------------------------------------------------------------------
// Shared Data (Gestor / Admin)
// ---------------------------------------------------------------------------

const stats = [
  {
    title: "Total de Leads",
    value: "1.847",
    change: 12.5,
    icon: Users,
    color: "text-sky-600 bg-sky-50 dark:text-sky-400 dark:bg-sky-950",
    gradient: "from-sky-500 to-cyan-500",
  },
  {
    title: "Deals Ativos",
    value: "342",
    change: 8.3,
    icon: Handshake,
    color:
      "text-primary bg-primary/10 dark:text-primary dark:bg-primary/15",
    gradient: "from-primary to-orange-500",
  },
  {
    title: "Taxa de Conversão",
    value: "23,4%",
    change: 2.1,
    icon: TrendingUp,
    color:
      "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    title: "Receita do Mês",
    value: "R$ 287.450,00",
    change: 15.7,
    icon: DollarSign,
    color:
      "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950",
    gradient: "from-amber-500 to-orange-500",
  },
]

const funnelData = [
  { stage: "Novos Leads", value: 1847, rate: null },
  { stage: "Qualificados", value: 892, rate: "48,3%" },
  { stage: "Propostas", value: 456, rate: "51,1%" },
  { stage: "Negociação", value: 234, rate: "51,3%" },
  { stage: "Fechados", value: 142, rate: "60,7%" },
]

const FUNNEL_COLORS = [
  "#c4553a",
  "#d97a2e",
  "#b8863e",
  "#5a9a7a",
  "#2d8a6e",
]

const teamRanking = [
  {
    position: 1,
    name: "Rafael Silva",
    initials: "RS",
    dealsWon: 28,
    revenue: "R$ 64.200,00",
    conversion: "31,2%",
    sla: "12 min",
  },
  {
    position: 2,
    name: "Camila Santos",
    initials: "CS",
    dealsWon: 24,
    revenue: "R$ 58.750,00",
    conversion: "28,7%",
    sla: "18 min",
  },
  {
    position: 3,
    name: "Bruno Oliveira",
    initials: "BO",
    dealsWon: 21,
    revenue: "R$ 52.300,00",
    conversion: "25,4%",
    sla: "22 min",
  },
  {
    position: 4,
    name: "Juliana Costa",
    initials: "JC",
    dealsWon: 18,
    revenue: "R$ 45.100,00",
    conversion: "22,1%",
    sla: "25 min",
  },
  {
    position: 5,
    name: "Fernando Almeida",
    initials: "FA",
    dealsWon: 15,
    revenue: "R$ 38.900,00",
    conversion: "19,8%",
    sla: "30 min",
  },
]

const insights = [
  {
    type: "warning" as const,
    title: "Leads parados em Negociação",
    description:
      "3 leads estão há mais de 7 dias sem interação na fase de Negociação",
    icon: AlertTriangle,
    badgeLabel: "Atenção",
    badgeClass: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
    iconClass: "text-amber-600 dark:text-amber-400",
    accentColor: "border-l-amber-500",
  },
  {
    type: "recommendation" as const,
    title: "Redistribuir leads",
    description:
      "Rafael Silva tem a melhor taxa de conversão (31,2%) - considere redistribuir leads",
    icon: Lightbulb,
    badgeLabel: "Recomendação",
    badgeClass: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
    iconClass: "text-blue-600 dark:text-blue-400",
    accentColor: "border-l-blue-500",
  },
  {
    type: "pattern" as const,
    title: "Instagram converte mais",
    description:
      "Leads vindos do Instagram convertem 2,3x mais que WhatsApp neste mês",
    icon: BarChart3,
    badgeLabel: "Padrão detectado",
    badgeClass:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
    iconClass: "text-emerald-600 dark:text-emerald-400",
    accentColor: "border-l-emerald-500",
  },
]

const recentActivity = [
  {
    id: 1,
    icon: CheckCircle2,
    iconClass: "text-emerald-600 dark:text-emerald-400",
    bgClass: "bg-emerald-100 dark:bg-emerald-950",
    description: "Deal com Maria Fernanda foi ganho - R$ 12.400,00",
    time: "2 min atrás",
  },
  {
    id: 2,
    icon: ArrowRightLeft,
    iconClass: "text-blue-600 dark:text-blue-400",
    bgClass: "bg-blue-100 dark:bg-blue-950",
    description:
      "Lead Pedro Henrique movido para Negociação",
    time: "15 min atrás",
  },
  {
    id: 3,
    icon: MessageSquare,
    iconClass: "text-primary dark:text-primary",
    bgClass: "bg-primary/10 dark:bg-primary/15",
    description: "Camila Santos enviou proposta para Tech Solutions",
    time: "1h atrás",
  },
  {
    id: 4,
    icon: CalendarCheck,
    iconClass: "text-amber-600 dark:text-amber-400",
    bgClass: "bg-amber-100 dark:bg-amber-950",
    description: "Reunião agendada com DataCorp para amanhã às 14h",
    time: "2h atrás",
  },
  {
    id: 5,
    icon: Star,
    iconClass: "text-yellow-600 dark:text-yellow-400",
    bgClass: "bg-yellow-100 dark:bg-yellow-950",
    description: "Novo lead qualificado: Logística Express (Score 87)",
    time: "3h atrás",
  },
  {
    id: 6,
    icon: MessageSquare,
    iconClass: "text-primary dark:text-primary",
    bgClass: "bg-primary/10 dark:bg-primary/15",
    description:
      "Bruno Oliveira respondeu mensagem de Ana Paula via WhatsApp",
    time: "4h atrás",
  },
]

// ---------------------------------------------------------------------------
// Closer Data (Reference: April 2026, meta-driven)
// ---------------------------------------------------------------------------

const closerTarget = {
  monthTarget: 180000,
  realized: 127450,
  daysLeft: 8,
  acceleratorTarget: 220000,
}

const closerHudStats = [
  {
    label: "Ganho no mês",
    value: "R$ 127,5k",
    sub: "14 deals · +23% vs. mar",
    tone: "success" as const,
  },
  {
    label: "Pipe ativo",
    value: "R$ 842k",
    sub: "38 oportunidades",
    tone: "neutral" as const,
  },
  {
    label: "Previsão fechada",
    value: "R$ 186k",
    sub: "Copiloto · confiança 82%",
    tone: "primary" as const,
    ai: true,
  },
]

interface CloserHotLead {
  id: number
  name: string
  company: string
  score: number
  stage: string
  value: number
  when: string
  ch: "whatsapp" | "mail"
  done: boolean
}

const closerHotLeads: CloserHotLead[] = [
  { id: 1, name: "Mariana Teixeira", company: "Pepsico Brasil", score: 92, stage: "Proposta enviada", value: 48500, when: "respondeu há 12min", ch: "whatsapp", done: false },
  { id: 2, name: "Ricardo Albuquerque", company: "Klabin S/A", score: 88, stage: "Negociação", value: 120000, when: "abriu proposta 3x hoje", ch: "mail", done: false },
  { id: 3, name: "Juliana Prates", company: "Natura", score: 85, stage: "Qualificado", value: 32000, when: "novo lead de inbound", ch: "whatsapp", done: true },
  { id: 4, name: "Fábio Guedes", company: "Raia Drogasil", score: 82, stage: "Proposta", value: 78000, when: "agendou reunião p/ amanhã", ch: "mail", done: false },
  { id: 5, name: "Camila Herrera", company: "iFood", score: 79, stage: "Proposta", value: 56000, when: "mencionou orçamento 2026", ch: "whatsapp", done: false },
  { id: 6, name: "Diego Rosso", company: "Localiza", score: 76, stage: "Qualificado", value: 22000, when: "evento Endeavor SP", ch: "mail", done: false },
  { id: 7, name: "Ana Beatriz Freitas", company: "Nubank", score: 73, stage: "Qualificado", value: 95000, when: "indicação do Lucas", ch: "whatsapp", done: false },
  { id: 8, name: "Otávio Menezes", company: "Movida", score: 71, stage: "Nutrição", value: 18000, when: "reabriu e-mail 2x", ch: "mail", done: false },
]

interface CloserTodayTask {
  id: number
  title: string
  lead: string
  time: string
  overdue: boolean
  done: boolean
}

const closerTodayTasks: CloserTodayTask[] = [
  { id: 1, title: "Ligar para Ricardo (Klabin) — confirmar prazo de pagamento", lead: "Ricardo Albuquerque", time: "09:30", overdue: false, done: true },
  { id: 2, title: "Enviar contrato revisado — Pepsico", lead: "Mariana Teixeira", time: "11:00", overdue: false, done: false },
  { id: 3, title: "Follow-up pós reunião — Natura", lead: "Juliana Prates", time: "13:15", overdue: false, done: false },
  { id: 4, title: "Preparar deck de proposta para Raia", lead: "Fábio Guedes", time: "14:00", overdue: false, done: false },
  { id: 5, title: "Revisar objeções do Diego (Localiza)", lead: "Diego Rosso", time: "Atrasada", overdue: true, done: false },
  { id: 6, title: "Call de descoberta — Ana Beatriz / Nubank", lead: "Ana Beatriz Freitas", time: "16:30", overdue: false, done: false },
]

interface CloserRescueCard {
  id: number
  kind: "hot" | "cooling" | "risk"
  title: string
  days?: number
  value: number
  msg: string
  sug: string
}

const closerRescueCards: CloserRescueCard[] = [
  { id: 1, kind: "cooling", title: "Klabin S/A", days: 3, value: 120000, msg: "Última interação há 3 dias. Ricardo abriu a proposta 3x hoje — momento ideal para acionar.", sug: "Enviar mensagem \"checking in\" no WhatsApp agora." },
  { id: 2, kind: "hot", title: "Mariana respondeu há 12min", value: 48500, msg: "Mencionou \"fechar essa semana\" — janela de fechamento ativa.", sug: "Responder já com link de contrato." },
  { id: 3, kind: "risk", title: "Localiza — 7 dias sem follow-up", days: 7, value: 22000, msg: "Diego (Localiza) pediu retorno na semana passada. Risco de perda para concorrente.", sug: "Ligar antes das 16h." },
]

const closerWeekSnapshot = [
  { label: "Ligações", value: "32", delta: "+8", positive: true },
  { label: "Mensagens", value: "184", delta: "+21%", positive: true },
  { label: "Reuniões", value: "11", delta: "+2", positive: true },
  { label: "No-shows", value: "2", delta: "-1", positive: true },
  { label: "Taxa resposta", value: "68%", delta: "+4pp", positive: true },
  { label: "Tempo 1ª resp.", value: "6min", delta: "-2min", positive: true },
]

function fmtBRL(v: number) {
  return "R$ " + v.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}
function fmtBRLk(v: number) {
  if (v >= 1000) {
    const k = v / 1000
    return "R$ " + k.toFixed(v >= 10000 ? 0 : 1).replace(".", ",") + "k"
  }
  return fmtBRL(v)
}
function scoreToneClass(score: number) {
  if (score >= 75) return "bg-emerald-500"
  if (score >= 50) return "bg-amber-500"
  return "bg-sky-500"
}

// ---------------------------------------------------------------------------
// SDR Data
// ---------------------------------------------------------------------------

const sdrStats = [
  {
    title: "Leads para Qualificar",
    value: "34",
    change: null,
    icon: Filter,
    color: "text-sky-600 bg-sky-50 dark:text-sky-400 dark:bg-sky-950",
    gradient: "from-sky-500 to-cyan-500",
  },
  {
    title: "Qualificados Hoje",
    value: "8",
    change: null,
    icon: UserCheck,
    color: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    title: "Taxa de Qualificação",
    value: "45,2%",
    change: null,
    icon: TrendingUp,
    color: "text-primary bg-primary/10 dark:text-primary dark:bg-primary/15",
    gradient: "from-primary to-orange-500",
  },
  {
    title: "MQLs Gerados",
    value: "12",
    change: null,
    icon: Target,
    color: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950",
    gradient: "from-amber-500 to-orange-500",
  },
]

const qualificationQueue = [
  {
    id: 1,
    name: "Marcos Pereira",
    phone: "(11) 98765-4321",
    source: "WhatsApp",
    sourceIcon: MessageCircle,
    sourceClass: "text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-950",
    score: 85,
    waiting: "5 min",
    aiSuggestion: "IA: Perfil decisor, prioridade máxima",
  },
  {
    id: 2,
    name: "Carolina Dias",
    phone: "(21) 99876-5432",
    source: "Instagram",
    sourceIcon: Camera,
    sourceClass: "text-pink-600 bg-pink-100 dark:text-pink-400 dark:bg-pink-950",
    score: 78,
    waiting: "12 min",
    aiSuggestion: "IA: Engajamento alto no Instagram, boa receptividade",
  },
  {
    id: 3,
    name: "Thiago Nascimento",
    phone: "(31) 97654-3210",
    source: "Formulário",
    sourceIcon: Globe,
    sourceClass: "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-950",
    score: 72,
    waiting: "25 min",
    aiSuggestion: "IA: Formulário detalhado, interesse genuíno",
  },
  {
    id: 4,
    name: "Fernanda Rocha",
    phone: "(41) 98543-2109",
    source: "WhatsApp",
    sourceIcon: MessageCircle,
    sourceClass: "text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-950",
    score: 68,
    waiting: "40 min",
    aiSuggestion: "IA: Segundo contato, já conhece o produto",
  },
  {
    id: 5,
    name: "Lucas Martins",
    phone: "(51) 97432-1098",
    source: "Instagram",
    sourceIcon: Camera,
    sourceClass: "text-pink-600 bg-pink-100 dark:text-pink-400 dark:bg-pink-950",
    score: 64,
    waiting: "1h 10min",
    aiSuggestion: "IA: Score abaixo da média, qualificar com cautela",
  },
]

const sdrRecentLeads = [
  { id: 1, name: "Beatriz Almeida", source: "WhatsApp", score: 91, time: "2 min atrás", status: "Novo" },
  { id: 2, name: "Gustavo Lima", source: "Instagram", score: 76, time: "8 min atrás", status: "Novo" },
  { id: 3, name: "Renata Campos", source: "Formulário", score: 82, time: "15 min atrás", status: "Novo" },
  { id: 4, name: "Diego Ferreira", source: "WhatsApp", score: 69, time: "22 min atrás", status: "Novo" },
  { id: 5, name: "Isabela Souza", source: "Instagram", score: 73, time: "35 min atrás", status: "Novo" },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function positionMedal(position: number) {
  if (position === 1) return "\uD83E\uDD47"
  if (position === 2) return "\uD83E\uDD48"
  if (position === 3) return "\uD83E\uDD49"
  return `${position}`
}

const roleLabels: Record<string, string> = {
  admin: "Administrador",
  gestor: "Gestor",
  closer: "Closer",
  sdr: "SDR",
}

const roleBadgeClass: Record<string, string> = {
  admin: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
  gestor: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  closer: "bg-primary/10 text-primary dark:bg-primary/15 dark:text-primary",
  sdr: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
}

function Greeting({ user }: { user: AuthUser }) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-orange-500/5 ring-1 ring-primary/10">
        <span className="font-display text-sm font-bold text-primary">{user.initials}</span>
      </div>
      <div>
        <div className="flex items-center gap-2.5">
          <h2 className="font-display text-2xl font-bold tracking-tight">
            <span className="text-gradient">Bom dia</span>, {user.name.split(" ")[0]}
          </h2>
          <span className={`inline-flex items-center rounded-lg px-2 py-0.5 text-[10px] font-bold leading-none backdrop-blur-sm ${roleBadgeClass[user.role] ?? ""}`}>
            {roleLabels[user.role] ?? user.role}
          </span>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Custom Recharts tooltip
// ---------------------------------------------------------------------------

interface FunnelTooltipProps {
  active?: boolean
  payload?: Array<{ payload: (typeof funnelData)[number] }>
}

function FunnelTooltip({ active, payload }: FunnelTooltipProps) {
  if (!active || !payload?.length) return null
  const data = payload[0].payload
  return (
    <div className="rounded-xl border border-border/50 bg-card/95 backdrop-blur-xl px-4 py-3 text-sm shadow-elevated">
      <p className="font-semibold">{data.stage}</p>
      <p className="text-muted-foreground mt-0.5">
        {data.value.toLocaleString("pt-BR")} leads
      </p>
      {data.rate && (
        <p className="text-primary font-medium mt-0.5">Conversão: {data.rate}</p>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Shared activity timeline
// ---------------------------------------------------------------------------

function ActivityTimeline({
  events,
}: {
  events: typeof recentActivity
}) {
  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-0 px-5">
        {events.map((event, idx) => (
          <div
            key={event.id}
            className={`flex gap-3 py-3.5 animate-card-in stagger-${Math.min(idx + 1, 6)}`}
          >
            <div className="flex flex-col items-center">
              <div
                className={`flex size-8 shrink-0 items-center justify-center rounded-xl ${event.bgClass} shadow-sm transition-transform duration-200 hover:scale-105`}
              >
                <event.icon className={`size-3.5 ${event.iconClass}`} />
              </div>
              {idx < events.length - 1 && (
                <div className="mt-1.5 w-px flex-1 bg-gradient-to-b from-border to-transparent" />
              )}
            </div>
            <div className="flex-1 pb-1">
              <p className="text-[13px] leading-snug">{event.description}</p>
              <p className="mt-1 text-[11px] text-muted-foreground/60">
                {event.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

// ---------------------------------------------------------------------------
// AI Daily Briefing Hero Component
// ---------------------------------------------------------------------------

function AIBriefing({ role, userName }: { role: string; userName: string }) {
  const briefings = {
    gestor: {
      title: "Briefing Diário da IA Gestora",
      summary: "Bom dia! Analisei sua operação nas últimas 24h. Aqui está o que precisa da sua atenção:",
      items: [
        { icon: AlertTriangle, text: "3 leads estão parados há +7 dias em Negociação. Risco de perda estimado: R$ 87.000", type: "warning" },
        { icon: TrendingUp, text: "Rafael Silva está 23% acima da meta. Considere redistribuir 2 leads de Fernando para ele", type: "success" },
        { icon: Zap, text: "Instagram converteu 2.3x mais que WhatsApp esta semana. Recomendo aumentar investimento", type: "insight" },
      ],
    },
    closer: {
      title: "Seu Assistente IA Copilot",
      summary: `${userName}, preparei sua estratégia para hoje baseada nos seus leads ativos:`,
      items: [
        { icon: Target, text: "Maria Silva (Score 92) respondeu rápido ontem. Alta probabilidade de fechamento — envie proposta agressiva", type: "action" },
        { icon: AlertTriangle, text: "Ricardo Santos não responde há 8h. Risco de esfriar. Envie um áudio personalizado pelo WhatsApp", type: "warning" },
        { icon: Sparkles, text: "Sua taxa de conversão subiu 3.2% este mês. Continue usando a abordagem DEF nos primeiros contatos", type: "success" },
      ],
    },
    sdr: {
      title: "IA de Qualificação",
      summary: `${userName}, a IA pré-analisou seus leads da fila. Aqui estão as prioridades:`,
      items: [
        { icon: Star, text: "Marcos Pereira (Score 85) tem perfil ideal: empresa de tecnologia, 50+ func, decisor. Qualifique primeiro", type: "action" },
        { icon: Lightbulb, text: "Leads do Instagram estão chegando com score médio 12 pontos acima do WhatsApp. Priorize-os", type: "insight" },
        { icon: Target, text: "Você está a 7 qualificações da meta diária. Ritmo atual: 5.3/hora — no caminho certo", type: "success" },
      ],
    },
  }

  const data = briefings[role as keyof typeof briefings] ?? briefings.gestor

  const typeStyles: Record<string, { bg: string; border: string; icon: string }> = {
    warning: { bg: "bg-amber-500/10", border: "border-l-amber-500", icon: "text-amber-600 dark:text-amber-400" },
    success: { bg: "bg-emerald-500/10", border: "border-l-emerald-500", icon: "text-emerald-600 dark:text-emerald-400" },
    insight: { bg: "bg-blue-500/10", border: "border-l-blue-500", icon: "text-blue-600 dark:text-blue-400" },
    action: { bg: "bg-primary/10", border: "border-l-primary", icon: "text-primary dark:text-primary" },
  }

  return (
    <Card className="animate-card-in stagger-1 overflow-hidden relative accent-line-left">
      {/* Subtle gradient background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-orange-500/[0.01]" />

      <CardHeader className="relative pb-2">
        <div className="flex items-center gap-3">
          <div className="relative flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-orange-500/10">
            <Sparkles className="size-4 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="font-display text-[15px]">{data.title}</CardTitle>
              <span className="inline-flex items-center rounded-lg ai-shimmer px-2 py-0.5 text-[9px] font-bold ai-text-shimmer">
                AI
              </span>
            </div>
          </div>
        </div>
        <p className="text-[13px] text-muted-foreground/80 mt-1.5 leading-relaxed">{data.summary}</p>
      </CardHeader>

      <CardContent className="relative space-y-2.5 pb-5">
        {data.items.map((item, idx) => {
          const style = typeStyles[item.type] ?? typeStyles.insight
          const Icon = item.icon
          return (
            <div
              key={idx}
              className={`flex items-start gap-3 rounded-xl border border-transparent border-l-[3px] ${style.border} ${style.bg} p-3.5 transition-all duration-200 hover:border-border/40 hover:shadow-sm`}
            >
              <Icon className={`mt-0.5 size-4 shrink-0 ${style.icon}`} />
              <p className="text-sm leading-relaxed">{item.text}</p>
            </div>
          )
        })}

        <div className="pt-3">
          <Button variant="outline" size="sm" className="btn-lift">
            <Sparkles className="size-3.5" />
            Ver análise completa
            <ChevronRight className="size-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// Reusable stat card with gradient icon background
// ---------------------------------------------------------------------------

function StatCard({
  stat,
  index,
}: {
  stat: {
    title: string
    value: string
    change: number | null
    icon: React.ComponentType<{ className?: string }>
    color: string
    gradient: string
  }
  index: number
}) {
  const Icon = stat.icon
  const isPositive = stat.change !== null ? stat.change >= 0 : true
  return (
    <Card
      className={`card-hover accent-top animate-card-in stagger-${index + 1} group`}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-1">
        <CardTitle className="text-[11px] font-semibold text-muted-foreground/70 tracking-wide uppercase">
          {stat.title}
        </CardTitle>
        <div className={`rounded-xl p-2 ${stat.color} transition-transform duration-300 group-hover:scale-110`}>
          <Icon className="size-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="font-display text-[1.75rem] font-bold tracking-tight leading-none">{stat.value}</div>
        {stat.change !== null && (
          <div className="mt-2 flex items-center gap-1.5 text-xs">
            <div className={`flex items-center gap-0.5 rounded-md px-1.5 py-0.5 ${
              isPositive
                ? "bg-emerald-500/8 text-emerald-600 dark:bg-emerald-500/12 dark:text-emerald-400"
                : "bg-red-500/8 text-red-600 dark:bg-red-500/12 dark:text-red-400"
            }`}>
              {isPositive ? (
                <ArrowUpRight className="size-3" />
              ) : (
                <ArrowDownRight className="size-3" />
              )}
              <span className="font-bold">
                {isPositive ? "+" : ""}
                {stat.change.toLocaleString("pt-BR", {
                  minimumFractionDigits: 1,
                })}%
              </span>
            </div>
            <span className="text-muted-foreground/60">vs mês anterior</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ===========================================================================
// GESTOR / ADMIN DASHBOARD
// ===========================================================================

function GestorDashboard({ user }: { user: AuthUser }) {
  return (
    <div className="animate-page-in space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Greeting user={user} />
          <p className="text-muted-foreground">
            Visão geral do seu CRM - Abril 2026
          </p>
        </div>
        <Button variant="outline" size="sm" className="w-fit btn-lift">
          <Clock className="size-4" />
          Últimos 30 dias
        </Button>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />

      {/* AI Daily Briefing Hero */}
      <AIBriefing role="gestor" userName={user.name} />

      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => (
          <StatCard key={stat.title} stat={stat} index={idx} />
        ))}
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />

      {/* Middle Row: Funnel + Team */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Funnel Chart */}
        <Card className="lg:col-span-3 animate-card-in stagger-5 overflow-hidden">
          <CardHeader>
            <CardTitle className="font-display text-base font-semibold">Funil de Vendas</CardTitle>
            <CardDescription>
              Conversão entre etapas do pipeline
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={funnelData}
                  layout="vertical"
                  margin={{ top: 0, right: 30, left: 10, bottom: 0 }}
                  barCategoryGap="20%"
                >
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="stage"
                    axisLine={false}
                    tickLine={false}
                    width={100}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    content={<FunnelTooltip />}
                    cursor={{ fill: "transparent" }}
                  />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={40}>
                    {funnelData.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={FUNNEL_COLORS[index]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Funnel rate annotations */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {funnelData.map((stage, idx) => (
                <div key={stage.stage} className="flex items-center gap-2">
                  <div
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: FUNNEL_COLORS[idx] }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {stage.stage}
                    {stage.rate && (
                      <span className="ml-1 font-semibold text-foreground">
                        ({stage.rate})
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Team Ranking */}
        <Card className="lg:col-span-2 animate-card-in stagger-6 overflow-hidden">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Trophy className="size-4 text-amber-500" />
              <CardTitle className="font-display text-base font-semibold">Ranking do Time</CardTitle>
            </div>
            <CardDescription>Desempenho dos vendedores este mês</CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <ScrollArea className="h-[340px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10 pl-4">#</TableHead>
                    <TableHead>Vendedor</TableHead>
                    <TableHead className="text-right">Deals</TableHead>
                    <TableHead className="hidden text-right sm:table-cell">
                      Receita
                    </TableHead>
                    <TableHead className="text-right pr-4">Conv.</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamRanking.map((member) => (
                    <TableRow
                      key={member.position}
                      className="transition-colors hover:bg-muted/60"
                    >
                      <TableCell className="pl-4 font-medium">
                        <span className="text-base">
                          {positionMedal(member.position)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="size-7">
                            <AvatarFallback className="text-[10px]">
                              {member.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium leading-tight">
                              {member.name}
                            </span>
                            <span className="text-[11px] text-muted-foreground">
                              SLA {member.sla}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        {member.dealsWon}
                      </TableCell>
                      <TableCell className="hidden text-right sm:table-cell">
                        {member.revenue}
                      </TableCell>
                      <TableCell className="text-right pr-4">
                        <Badge variant="secondary" className="font-mono">
                          {member.conversion}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />

      {/* Bottom Row: AI Insights + Activity */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* AI Insights */}
        <Card className="lg:col-span-3 animate-card-in stagger-5 overflow-hidden">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="size-3.5 text-primary" />
              <CardTitle className="font-display text-base font-semibold">IA Gestora — Análise em Tempo Real</CardTitle>
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
              </span>
            </div>
            <CardDescription>
              Recomendações baseadas nos seus dados
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {insights.map((insight, idx) => (
              <div
                key={idx}
                className={`flex gap-3 rounded-lg border border-l-[3px] ${insight.accentColor} p-3 transition-colors hover:bg-muted/50`}
              >
                <div
                  className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg ${
                    insight.type === "warning"
                      ? "bg-amber-100 dark:bg-amber-950"
                      : insight.type === "recommendation"
                        ? "bg-blue-100 dark:bg-blue-950"
                        : "bg-emerald-100 dark:bg-emerald-950"
                  }`}
                >
                  <insight.icon className={`size-4 ${insight.iconClass}`} />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{insight.title}</span>
                    <Badge
                      variant="secondary"
                      className={`text-[10px] ${insight.badgeClass}`}
                    >
                      {insight.badgeLabel}
                    </Badge>
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {insight.description}
                  </p>
                </div>
                <Button variant="ghost" size="sm" className="shrink-0 self-center">
                  Ver detalhes
                  <ChevronRight className="size-3" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2 animate-card-in stagger-6 overflow-hidden">
          <CardHeader>
            <CardTitle className="font-display text-base font-semibold">Atividade Recente</CardTitle>
            <CardDescription>Últimas interações do time</CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <ActivityTimeline events={recentActivity} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// ===========================================================================
// CLOSER DASHBOARD (Reference-style: meta HUD + leads quentes + rescue AI)
// ===========================================================================

function CloserDashboard({ user }: { user: AuthUser }) {
  const [leads, setLeads] = useState(closerHotLeads)
  const [tasks, setTasks] = useState(closerTodayTasks)

  const { monthTarget, realized, daysLeft, acceleratorTarget } = closerTarget
  const pct = Math.round((realized / monthTarget) * 100)
  const remaining = monthTarget - realized
  const accelerator = acceleratorTarget - realized
  const acceleratorPct = Math.min((acceleratorTarget / monthTarget) * 100, 100)
  const firstName = user.name.split(" ")[0]
  const pendingTasks = tasks.filter((t) => !t.done).length
  const overdueTasks = tasks.filter((t) => t.overdue && !t.done).length

  const toggleLead = (id: number) =>
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, done: !l.done } : l)))
  const toggleTask = (id: number) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))

  return (
    <div className="animate-page-in space-y-6">
      {/* ── Greeting ─────────────────────── */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <h2 className="font-display text-2xl font-bold tracking-tight">
              <span className="text-gradient">Boa tarde</span>, {firstName}.
            </h2>
            <span className={`inline-flex items-center rounded-lg px-2 py-0.5 text-[10px] font-bold leading-none backdrop-blur-sm ${roleBadgeClass[user.role] ?? ""}`}>
              {roleLabels[user.role] ?? user.role}
            </span>
          </div>
          <p className="text-[13.5px] text-muted-foreground">
            Você está a <strong className="text-foreground">{daysLeft} dias</strong> de bater a meta.
          </p>
        </div>
        <div className="text-[12px] font-medium text-muted-foreground/70 font-mono">
          Terça-feira, 14 de abril · 14:28
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />

      {/* ── HUD: Meta de abril + 3 stats ── */}
      <div className="grid gap-4 lg:grid-cols-5">
        {/* Meta hero card */}
        <Card className="lg:col-span-2 accent-line-left overflow-hidden relative animate-card-in stagger-1">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-orange-500/[0.02]" />
          <CardContent className="relative space-y-4 pt-6">
            <div className="flex items-center gap-2">
              <Target className="size-3.5 text-primary" />
              <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/70">
                Meta de abril
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-display font-mono text-[2rem] font-bold leading-none tracking-tight">
                {fmtBRL(realized)}
              </span>
              <span className="text-sm font-mono text-muted-foreground/60">/ {fmtBRL(monthTarget)}</span>
            </div>
            <p className="text-[12.5px] text-muted-foreground">
              {pct}% realizado · faltam <strong className="text-foreground">{fmtBRL(remaining)}</strong> para bater a cota
            </p>
            <div className="relative h-2 w-full rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-orange-500 transition-all"
                style={{ width: pct + "%" }}
              />
              <div
                className="absolute -top-1 h-4 w-px bg-foreground/30"
                style={{ left: "100%" }}
                title="100% Meta"
              />
              <div
                className="absolute -top-1 h-4 w-px bg-amber-500"
                style={{ left: acceleratorPct + "%" }}
                title="Acelerador ×1.5"
              />
            </div>
            <div className="flex items-start gap-2 rounded-lg bg-amber-500/[0.07] border border-amber-500/15 px-3 py-2">
              <Zap className="size-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <p className="text-[12px] text-muted-foreground leading-snug">
                Faltam <strong className="text-foreground">{fmtBRL(accelerator)}</strong> para entrar na faixa de acelerador <strong className="text-amber-600 dark:text-amber-400">×1.5</strong>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 3 hud stats */}
        {closerHudStats.map((s, idx) => (
          <Card key={s.label} className={`animate-card-in stagger-${idx + 2} card-hover accent-top`}>
            <CardContent className="pt-6 space-y-2">
              <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/70">
                {s.label}
              </div>
              <div
                className={`font-display font-mono text-[1.65rem] font-bold leading-none tracking-tight ${
                  s.tone === "success"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : s.tone === "primary"
                      ? "text-primary"
                      : "text-foreground"
                }`}
              >
                {s.value}
              </div>
              <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                {s.ai && <Sparkles className="size-3 text-primary" />}
                {s.sub}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />

      {/* ── Main Grid ── */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left stack: Leads + Tasks */}
        <div className="space-y-6 lg:col-span-3">
          {/* Leads quentes hoje */}
          <Card className="animate-card-in stagger-5 overflow-hidden">
            <CardHeader>
              <div className="flex items-start gap-2">
                <Flame className="size-4 text-primary mt-0.5" />
                <div className="flex-1 min-w-0">
                  <CardTitle className="font-display text-base font-semibold">Leads quentes hoje</CardTitle>
                  <CardDescription className="flex items-center gap-1.5 mt-1">
                    <Sparkles className="size-3 text-primary shrink-0" />
                    <span>Copiloto · priorizados por score, recência e momentum · Top 15 de 284</span>
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="shrink-0 h-7 px-2.5 text-xs">
                  <Filter className="size-3.5" />
                  Filtrar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="divide-y divide-border/60">
                {leads.map((l) => {
                  const ChannelIcon = l.ch === "whatsapp" ? MessageCircle : Mail
                  return (
                    <button
                      key={l.id}
                      onClick={() => toggleLead(l.id)}
                      className={`w-full flex items-center gap-3 px-5 py-3 transition-colors hover:bg-muted/40 ${
                        l.done ? "opacity-50" : ""
                      }`}
                    >
                      <div
                        className={`flex size-[18px] shrink-0 items-center justify-center rounded-[5px] border-2 transition-colors ${
                          l.done
                            ? "bg-primary border-primary text-white"
                            : "border-muted-foreground/30"
                        }`}
                      >
                        {l.done && <CheckCircle2 className="size-2.5" />}
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <div className={`text-[13px] font-medium truncate ${l.done ? "line-through" : ""}`}>
                          {l.name}
                          <span className="font-normal text-muted-foreground/70"> · {l.company}</span>
                        </div>
                        <div className="text-[11px] text-muted-foreground/70 flex items-center gap-1 mt-0.5 truncate">
                          <ChannelIcon
                            className={`size-[10px] shrink-0 ${
                              l.ch === "whatsapp" ? "text-emerald-500" : "text-sky-500"
                            }`}
                          />
                          <span className="truncate">{l.stage} · {l.when}</span>
                        </div>
                      </div>
                      <div className="font-mono text-[12px] text-muted-foreground shrink-0 w-16 text-right">
                        {fmtBRLk(l.value)}
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 w-10 justify-end">
                        <span className={`size-2 rounded-full ${scoreToneClass(l.score)}`} />
                        <span className="font-mono text-[12px] text-muted-foreground">{l.score}</span>
                      </div>
                      <ChevronRight className="size-3.5 text-muted-foreground/40 shrink-0" />
                    </button>
                  )
                })}
              </div>
              <div className="border-t border-border/60 py-2.5 text-center">
                <Link
                  to="/pipeline"
                  className="text-[12px] text-muted-foreground/70 hover:text-primary transition-colors"
                >
                  Ver os 15 leads do dia →
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Minhas tarefas de hoje */}
          <Card className="animate-card-in stagger-6 overflow-hidden">
            <CardHeader>
              <div className="flex items-start gap-2">
                <ListChecks className="size-4 text-sky-500 mt-0.5" />
                <div className="flex-1">
                  <CardTitle className="font-display text-base font-semibold">Minhas tarefas de hoje</CardTitle>
                  <CardDescription className="mt-1">
                    {pendingTasks} pendentes{overdueTasks > 0 && ` · ${overdueTasks} atrasada${overdueTasks > 1 ? "s" : ""}`}
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="shrink-0 h-7 px-2.5 text-xs">
                  <Plus className="size-3.5" />
                  Nova tarefa
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-0 pb-2">
              <div className="divide-y divide-border/60">
                {tasks.map((t) => (
                  <div
                    key={t.id}
                    className={`flex items-center gap-3 px-5 py-3 ${t.done ? "opacity-50" : ""}`}
                  >
                    <button
                      onClick={() => toggleTask(t.id)}
                      className={`flex size-[18px] shrink-0 items-center justify-center rounded-[5px] border-2 transition-colors ${
                        t.done
                          ? "bg-primary border-primary text-white"
                          : "border-muted-foreground/30 hover:border-primary/50"
                      }`}
                    >
                      {t.done && <CheckCircle2 className="size-2.5" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className={`text-[13px] leading-snug ${t.done ? "line-through text-muted-foreground/70" : ""}`}>
                        {t.title}
                      </div>
                      <Link
                        to="/contacts"
                        className="text-[11px] text-muted-foreground/60 hover:text-primary transition-colors mt-0.5 inline-block"
                      >
                        → {t.lead}
                      </Link>
                    </div>
                    <span
                      className={`font-mono text-[11px] shrink-0 ${
                        t.overdue
                          ? "text-red-600 dark:text-red-400 font-semibold"
                          : "text-muted-foreground"
                      }`}
                    >
                      {t.time}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right stack: Rescue + Snapshot */}
        <div className="space-y-6 lg:col-span-2">
          {/* Cards de resgate (AI) */}
          <Card className="animate-card-in stagger-5 overflow-hidden relative">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-amber-500/[0.02]" />
            <CardHeader className="relative">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-primary" />
                <CardTitle className="font-display text-base font-semibold">Cards de resgate</CardTitle>
                <span className="inline-flex items-center rounded-lg ai-shimmer px-2 py-0.5 text-[9px] font-bold ai-text-shimmer">
                  AI
                </span>
              </div>
              <CardDescription className="mt-1">
                Copiloto detectou 3 situações que pedem atenção
              </CardDescription>
            </CardHeader>
            <CardContent className="relative space-y-3">
              {closerRescueCards.map((r) => {
                const toneBadge =
                  r.kind === "hot"
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                    : r.kind === "cooling"
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                      : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
                const toneBorder =
                  r.kind === "hot"
                    ? "border-l-emerald-500"
                    : r.kind === "cooling"
                      ? "border-l-amber-500"
                      : "border-l-red-500"
                const chipLabel =
                  r.kind === "hot"
                    ? "Oportunidade viva"
                    : r.kind === "cooling"
                      ? `Esfriando · ${r.days}d parada`
                      : `Risco alto · ${r.days}d`
                return (
                  <div
                    key={r.id}
                    className={`rounded-lg border border-l-[3px] ${toneBorder} bg-card/80 p-3 space-y-2`}
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className={`text-[10px] ${toneBadge}`}>
                        {chipLabel}
                      </Badge>
                      <div className="flex-1" />
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {fmtBRLk(r.value)}
                      </span>
                    </div>
                    <p className="text-[13px] leading-snug">
                      <strong>{r.title}.</strong>{" "}
                      <span className="text-muted-foreground">{r.msg}</span>
                    </p>
                    <p className="text-[12px] text-muted-foreground/80">
                      <span className="text-primary">↳ Sugestão:</span> {r.sug}
                    </p>
                    <div className="flex items-center gap-1.5 pt-1">
                      <Button
                        size="sm"
                        className="h-7 px-3 text-xs btn-lift bg-gradient-to-r from-primary to-orange-600 text-white"
                        asChild
                      >
                        <Link to="/inbox">
                          <Sparkles className="size-3" />
                          Aplicar sugestão
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 px-3 text-xs">
                        Depois
                      </Button>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Snapshot da semana */}
          <Card className="animate-card-in stagger-6 overflow-hidden">
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="size-4 text-primary" />
                <CardTitle className="font-display text-base font-semibold">Snapshot da semana</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {closerWeekSnapshot.map((s) => (
                  <div key={s.label}>
                    <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/70">
                      {s.label}
                    </div>
                    <div className="flex items-baseline gap-1.5 mt-1">
                      <span className="font-display font-mono text-[18px] font-semibold leading-none tracking-tight">
                        {s.value}
                      </span>
                      <span
                        className={`font-mono text-[11px] ${
                          s.positive
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {s.delta}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// ===========================================================================
// SDR DASHBOARD
// ===========================================================================

function SDRDashboard({ user }: { user: AuthUser }) {
  return (
    <div className="animate-page-in space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <Greeting user={user} />
        <Button variant="outline" size="sm" className="w-fit btn-lift">
          <Clock className="size-4" />
          Hoje
        </Button>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />

      {/* AI Daily Briefing Hero */}
      <AIBriefing role="sdr" userName={user.name.split(" ")[0]} />

      {/* Personal Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {sdrStats.map((stat, idx) => (
          <StatCard key={stat.title} stat={stat} index={idx} />
        ))}
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />

      {/* Middle Row: Qualification Queue + Cadence */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Fila de Qualificação */}
        <Card className="lg:col-span-3 animate-card-in stagger-5 overflow-hidden">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Filter className="size-4 text-sky-500" />
              <CardTitle className="font-display text-base font-semibold">Fila de Qualificação</CardTitle>
            </div>
            <CardDescription>
              {qualificationQueue.length} leads aguardando qualificação
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {qualificationQueue.map((lead) => (
              <div
                key={lead.id}
                className="card-hover flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="size-8">
                    <AvatarFallback className="text-[10px]">
                      {lead.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{lead.name}</span>
                      <Badge
                        variant="secondary"
                        className={`text-[10px] ${lead.sourceClass}`}
                      >
                        <lead.sourceIcon className="mr-1 size-3" />
                        {lead.source}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{lead.phone}</span>
                      <span className="font-semibold text-foreground">Score: {lead.score}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {lead.waiting}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 pt-0.5">
                      <Sparkles className="size-3 text-primary" />
                      <span className="text-xs text-primary dark:text-primary">{lead.aiSuggestion}</span>
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  className="btn-lift bg-gradient-to-r from-primary to-orange-600 text-white hover:from-primary/90 hover:to-orange-600/90 shadow-sm"
                >
                  Qualificar
                  <ChevronRight className="size-3" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Cadência do Dia + Leads Recentes (stacked) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Cadência do Dia */}
          <Card className="animate-card-in stagger-5 overflow-hidden">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Zap className="size-4 text-amber-500" />
                <CardTitle className="font-display text-base font-semibold">Cadência do Dia</CardTitle>
              </div>
              <CardDescription>Progresso de contatos hoje</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-end justify-between">
                <div>
                  <span className="font-display text-3xl font-semibold">8</span>
                  <span className="text-lg text-muted-foreground">/15</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  contatos feitos hoje
                </span>
              </div>
              <div className="relative h-3 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-500 transition-all"
                  style={{ width: `${(8 / 15) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span className="font-medium">53% concluído</span>
                <span>Faltam 7 contatos</span>
              </div>
            </CardContent>
          </Card>

          {/* Leads Recentes */}
          <Card className="animate-card-in stagger-6 overflow-hidden">
            <CardHeader>
              <CardTitle className="font-display text-base font-semibold">Leads Recentes</CardTitle>
              <CardDescription>Últimos leads que chegaram</CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-4">Nome</TableHead>
                    <TableHead>Origem</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                    <TableHead className="text-right pr-4">Quando</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sdrRecentLeads.map((lead) => (
                    <TableRow key={lead.id} className="transition-colors hover:bg-muted/60">
                      <TableCell className="pl-4 font-medium text-sm">
                        {lead.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-[10px]">
                          {lead.source}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm font-bold">
                        {lead.score}
                      </TableCell>
                      <TableCell className="text-right pr-4 text-xs text-muted-foreground">
                        {lead.time}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// ===========================================================================
// MAIN EXPORT - Role-based routing
// ===========================================================================

export function Dashboard() {
  const { user } = useAuth()

  if (!user) return null

  if (user.role === "closer") return <CloserDashboard user={user} />
  if (user.role === "sdr") return <SDRDashboard user={user} />
  return <GestorDashboard user={user} />
}
