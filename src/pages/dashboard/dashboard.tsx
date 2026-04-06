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
import { Progress } from "@/components/ui/progress"
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
  Phone,
  Target,
  Zap,
  MessageCircle,
  ListChecks,
  UserCheck,
  Filter,
  Send,
  Camera,
  Globe,
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
    color: "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-950",
    gradient: "from-blue-500 to-indigo-500",
  },
  {
    title: "Deals Ativos",
    value: "342",
    change: 8.3,
    icon: Handshake,
    color:
      "text-violet-600 bg-violet-100 dark:text-violet-400 dark:bg-violet-950",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    title: "Taxa de Conversao",
    value: "23,4%",
    change: 2.1,
    icon: TrendingUp,
    color:
      "text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-950",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    title: "Receita do Mes",
    value: "R$ 287.450,00",
    change: 15.7,
    icon: DollarSign,
    color:
      "text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-950",
    gradient: "from-amber-500 to-orange-500",
  },
]

const funnelData = [
  { stage: "Novos Leads", value: 1847, rate: null },
  { stage: "Qualificados", value: 892, rate: "48,3%" },
  { stage: "Propostas", value: 456, rate: "51,1%" },
  { stage: "Negociacao", value: 234, rate: "51,3%" },
  { stage: "Fechados", value: 142, rate: "60,7%" },
]

const FUNNEL_COLORS = [
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#22c55e",
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
    title: "Leads parados em Negociacao",
    description:
      "3 leads estao ha mais de 7 dias sem interacao na fase de Negociacao",
    icon: AlertTriangle,
    badgeLabel: "Atencao",
    badgeClass: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
    iconClass: "text-amber-600 dark:text-amber-400",
    accentColor: "border-l-amber-500",
  },
  {
    type: "recommendation" as const,
    title: "Redistribuir leads",
    description:
      "Rafael Silva tem a melhor taxa de conversao (31,2%) - considere redistribuir leads",
    icon: Lightbulb,
    badgeLabel: "Recomendacao",
    badgeClass: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
    iconClass: "text-blue-600 dark:text-blue-400",
    accentColor: "border-l-blue-500",
  },
  {
    type: "pattern" as const,
    title: "Instagram converte mais",
    description:
      "Leads vindos do Instagram convertem 2,3x mais que WhatsApp neste mes",
    icon: BarChart3,
    badgeLabel: "Padrao detectado",
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
    time: "2 min atras",
  },
  {
    id: 2,
    icon: ArrowRightLeft,
    iconClass: "text-blue-600 dark:text-blue-400",
    bgClass: "bg-blue-100 dark:bg-blue-950",
    description:
      "Lead Pedro Henrique movido para Negociacao",
    time: "15 min atras",
  },
  {
    id: 3,
    icon: MessageSquare,
    iconClass: "text-violet-600 dark:text-violet-400",
    bgClass: "bg-violet-100 dark:bg-violet-950",
    description: "Camila Santos enviou proposta para Tech Solutions",
    time: "1h atras",
  },
  {
    id: 4,
    icon: CalendarCheck,
    iconClass: "text-amber-600 dark:text-amber-400",
    bgClass: "bg-amber-100 dark:bg-amber-950",
    description: "Reuniao agendada com DataCorp para amanha as 14h",
    time: "2h atras",
  },
  {
    id: 5,
    icon: Star,
    iconClass: "text-yellow-600 dark:text-yellow-400",
    bgClass: "bg-yellow-100 dark:bg-yellow-950",
    description: "Novo lead qualificado: Logistica Express (Score 87)",
    time: "3h atras",
  },
  {
    id: 6,
    icon: MessageSquare,
    iconClass: "text-violet-600 dark:text-violet-400",
    bgClass: "bg-violet-100 dark:bg-violet-950",
    description:
      "Bruno Oliveira respondeu mensagem de Ana Paula via WhatsApp",
    time: "4h atras",
  },
]

// ---------------------------------------------------------------------------
// Closer Data
// ---------------------------------------------------------------------------

const closerStats = [
  {
    title: "Meus Leads Ativos",
    value: "18",
    change: null,
    icon: Users,
    color: "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-950",
    gradient: "from-blue-500 to-indigo-500",
  },
  {
    title: "Deals em Negociacao",
    value: "5",
    change: null,
    icon: Handshake,
    color:
      "text-violet-600 bg-violet-100 dark:text-violet-400 dark:bg-violet-950",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    title: "Minha Conversao",
    value: "28,7%",
    change: 3.2,
    icon: TrendingUp,
    color:
      "text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-950",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    title: "Receita do Mes",
    value: "R$ 42.800",
    change: 12,
    icon: DollarSign,
    color:
      "text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-950",
    gradient: "from-amber-500 to-orange-500",
  },
]

const closerTasks = [
  {
    id: 1,
    description: "Retornar ligacao - Fernanda Costa (InovaTech)",
    deadline: "Vence em 2h",
    deadlineClass: "text-amber-600 dark:text-amber-400",
    badgeVariant: "secondary" as const,
    badgeClass: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  },
  {
    id: 2,
    description: "Enviar proposta - Patricia Lima (CloudBase)",
    deadline: "Vence hoje",
    deadlineClass: "text-amber-600 dark:text-amber-400",
    badgeVariant: "secondary" as const,
    badgeClass: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  },
  {
    id: 3,
    description: "Follow-up WhatsApp - Ricardo Santos (MegaSoft)",
    deadline: "Vencida",
    deadlineClass: "text-red-600 dark:text-red-400",
    badgeVariant: "destructive" as const,
    badgeClass: "",
  },
  {
    id: 4,
    description: "Agendar demo - Andre Moreira (NextGen)",
    deadline: "Amanha",
    deadlineClass: "text-muted-foreground",
    badgeVariant: "secondary" as const,
    badgeClass: "",
  },
]

const closerCopilotSuggestions = [
  {
    id: 1,
    text: "Lead Maria Silva esta com score alto (92) e respondeu rapido. Recomendo proposta agressiva.",
    icon: Zap,
    iconClass: "text-amber-600 dark:text-amber-400",
    bgClass: "bg-amber-100 dark:bg-amber-950",
  },
  {
    id: 2,
    text: "Ricardo Santos nao responde ha 8h. Considere enviar audio pelo WhatsApp.",
    icon: MessageCircle,
    iconClass: "text-blue-600 dark:text-blue-400",
    bgClass: "bg-blue-100 dark:bg-blue-950",
  },
]

const closerRecentActivity = [
  {
    id: 1,
    icon: Phone,
    iconClass: "text-emerald-600 dark:text-emerald-400",
    bgClass: "bg-emerald-100 dark:bg-emerald-950",
    description: "Ligacao de 12 min com Patricia Lima (CloudBase)",
    time: "30 min atras",
  },
  {
    id: 2,
    icon: Send,
    iconClass: "text-blue-600 dark:text-blue-400",
    bgClass: "bg-blue-100 dark:bg-blue-950",
    description: "Proposta enviada para Maria Fernanda (TechSol)",
    time: "1h atras",
  },
  {
    id: 3,
    icon: MessageCircle,
    iconClass: "text-violet-600 dark:text-violet-400",
    bgClass: "bg-violet-100 dark:bg-violet-950",
    description: "Mensagem WhatsApp para Andre Moreira (NextGen)",
    time: "2h atras",
  },
  {
    id: 4,
    icon: CalendarCheck,
    iconClass: "text-amber-600 dark:text-amber-400",
    bgClass: "bg-amber-100 dark:bg-amber-950",
    description: "Demo agendada com Logistica Express para quinta",
    time: "3h atras",
  },
]

// ---------------------------------------------------------------------------
// SDR Data
// ---------------------------------------------------------------------------

const sdrStats = [
  {
    title: "Leads para Qualificar",
    value: "34",
    change: null,
    icon: Filter,
    color: "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-950",
    gradient: "from-blue-500 to-indigo-500",
  },
  {
    title: "Qualificados Hoje",
    value: "8",
    change: null,
    icon: UserCheck,
    color:
      "text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-950",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    title: "Taxa de Qualificacao",
    value: "45,2%",
    change: null,
    icon: TrendingUp,
    color:
      "text-violet-600 bg-violet-100 dark:text-violet-400 dark:bg-violet-950",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    title: "MQLs Gerados",
    value: "12",
    change: null,
    icon: Target,
    color:
      "text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-950",
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
  },
  {
    id: 3,
    name: "Thiago Nascimento",
    phone: "(31) 97654-3210",
    source: "Formulario",
    sourceIcon: Globe,
    sourceClass: "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-950",
    score: 72,
    waiting: "25 min",
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
  },
]

const sdrRecentLeads = [
  { id: 1, name: "Beatriz Almeida", source: "WhatsApp", score: 91, time: "2 min atras", status: "Novo" },
  { id: 2, name: "Gustavo Lima", source: "Instagram", score: 76, time: "8 min atras", status: "Novo" },
  { id: 3, name: "Renata Campos", source: "Formulario", score: 82, time: "15 min atras", status: "Novo" },
  { id: 4, name: "Diego Ferreira", source: "WhatsApp", score: 69, time: "22 min atras", status: "Novo" },
  { id: 5, name: "Isabela Souza", source: "Instagram", score: 73, time: "35 min atras", status: "Novo" },
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
  closer: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-400",
  sdr: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
}

function Greeting({ user }: { user: AuthUser }) {
  return (
    <div className="flex items-center gap-3">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold tracking-tight">
            <span className="text-gradient">Bom dia</span>, {user.name}
          </h2>
          <Badge
            variant="secondary"
            className={roleBadgeClass[user.role] ?? ""}
          >
            {roleLabels[user.role] ?? user.role}
          </Badge>
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
    <div className="rounded-lg border bg-card px-3 py-2 text-sm shadow-md">
      <p className="font-medium">{data.stage}</p>
      <p className="text-muted-foreground">
        {data.value.toLocaleString("pt-BR")} leads
      </p>
      {data.rate && (
        <p className="text-muted-foreground">Conversao: {data.rate}</p>
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
      <div className="space-y-0 px-4">
        {events.map((event, idx) => (
          <div
            key={event.id}
            className={`flex gap-3 py-3 animate-card-in stagger-${Math.min(idx + 1, 6)}`}
          >
            <div className="flex flex-col items-center">
              <div
                className={`flex size-8 shrink-0 items-center justify-center rounded-full ${event.bgClass} ring-2 ring-offset-2 ring-offset-card ring-transparent shadow-sm`}
              >
                <event.icon className={`size-4 ${event.iconClass}`} />
              </div>
              {idx < events.length - 1 && (
                <div className="mt-1 w-px flex-1 bg-border" />
              )}
            </div>
            <div className="flex-1 pb-1">
              <p className="text-sm leading-snug">{event.description}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
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
      className={`card-hover animate-card-in stagger-${index + 1}`}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {stat.title}
        </CardTitle>
        <div
          className={`rounded-lg p-2 bg-gradient-to-br ${stat.gradient} text-white shadow-sm`}
        >
          <Icon className="size-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
        {stat.change !== null && (
          <div className="mt-1 flex items-center gap-1 text-xs">
            {isPositive ? (
              <ArrowUpRight className="size-3 text-emerald-600" />
            ) : (
              <ArrowDownRight className="size-3 text-red-600" />
            )}
            <span
              className={
                isPositive
                  ? "font-medium text-emerald-600"
                  : "font-medium text-red-600"
              }
            >
              {isPositive ? "+" : ""}
              {stat.change.toLocaleString("pt-BR", {
                minimumFractionDigits: 1,
              })}
              %
            </span>
            <span className="text-muted-foreground">vs mes anterior</span>
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
            Visao geral do seu CRM - Abril 2026
          </p>
        </div>
        <Button variant="outline" size="sm" className="w-fit btn-lift">
          <Clock className="size-4" />
          Ultimos 30 dias
        </Button>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => (
          <StatCard key={stat.title} stat={stat} index={idx} />
        ))}
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Middle Row: Funnel + Team */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Funnel Chart */}
        <Card className="lg:col-span-3 animate-card-in stagger-5 overflow-hidden border-t-2 border-t-primary/20"
              style={{ borderImage: "linear-gradient(to right, #3b82f6, #8b5cf6, #22c55e) 1 0 0 0" }}>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Funil de Vendas</CardTitle>
            <CardDescription>
              Conversao entre etapas do pipeline
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
        <Card className="lg:col-span-2 animate-card-in stagger-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="glow-primary rounded-md p-1">
                <Trophy className="size-5 text-amber-500 drop-shadow-sm" />
              </div>
              <CardTitle className="text-lg font-semibold">Ranking do Time</CardTitle>
            </div>
            <CardDescription>Desempenho dos vendedores este mes</CardDescription>
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
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Bottom Row: AI Insights + Activity */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* AI Insights */}
        <Card className="lg:col-span-3 animate-card-in stagger-5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-violet-500 animate-spin" style={{ animationDuration: "4s" }} />
              <CardTitle className="text-lg font-semibold">Insights da IA</CardTitle>
            </div>
            <CardDescription>
              Recomendacoes baseadas nos seus dados
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
        <Card className="lg:col-span-2 animate-card-in stagger-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Atividade Recente</CardTitle>
            <CardDescription>Ultimas interacoes do time</CardDescription>
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
// CLOSER DASHBOARD
// ===========================================================================

function CloserDashboard({ user }: { user: AuthUser }) {
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
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Personal Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {closerStats.map((stat, idx) => (
          <StatCard key={stat.title} stat={stat} index={idx} />
        ))}
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Middle Row: Lead Lock + Tasks */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Proximo Lead (Lead Lock) -- HERO element */}
        <Card className="border-gradient bg-gradient-to-br from-violet-50/50 to-background dark:from-violet-950/30 lg:col-span-2 animate-card-in stagger-5">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="rounded-md bg-gradient-to-br from-violet-500 to-purple-500 p-1.5">
                <Target className="size-4 text-white" />
              </div>
              <CardTitle className="text-lg font-semibold">Proximo Lead</CardTitle>
            </div>
            <CardDescription>
              Foque neste lead antes de avancar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-6 pb-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold">{/* larger name */}Maria Silva</span>
                  <Badge
                    variant="secondary"
                    className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                  >
                    <MessageCircle className="mr-1 size-3" />
                    WhatsApp
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">TechCorp</p>
              </div>
              <div className="flex flex-col items-center rounded-xl bg-gradient-to-br from-violet-100 to-violet-50 px-4 py-2 dark:from-violet-950 dark:to-violet-900/50 shadow-sm">
                <span className="text-xs text-muted-foreground">Score</span>
                <span className="text-2xl font-bold text-violet-700 dark:text-violet-400">
                  92
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="size-3.5" />
              <span>Ultimo contato: 30 min atras</span>
            </div>

            <Button
              className="w-full btn-lift bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-md"
              asChild
            >
              <Link to="/inbox">
                <MessageSquare className="size-4" />
                Abrir Conversa
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Minhas Tarefas Pendentes */}
        <Card className="lg:col-span-3 animate-card-in stagger-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ListChecks className="size-4 text-blue-500" />
              <CardTitle className="text-lg font-semibold">Minhas Tarefas Pendentes</CardTitle>
            </div>
            <CardDescription>
              {closerTasks.length} tarefas para hoje
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {closerTasks.map((task) => {
              const isOverdue = task.deadline === "Vencida"
              return (
                <div
                  key={task.id}
                  className={`flex items-center justify-between rounded-lg border p-3 transition-all hover:bg-muted/50 hover:shadow-sm ${
                    isOverdue ? "border-red-200 bg-red-50/30 dark:border-red-900 dark:bg-red-950/20 animate-pulse" : ""
                  }`}
                  style={isOverdue ? { animationDuration: "3s" } : undefined}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex size-6 items-center justify-center rounded-full border-2 ${
                        isOverdue
                          ? "border-red-400 dark:border-red-500"
                          : "border-muted-foreground/30"
                      }`}
                    />
                    <span className={`text-sm ${isOverdue ? "font-medium" : ""}`}>
                      {task.description}
                    </span>
                  </div>
                  <Badge
                    variant={task.badgeVariant}
                    className={`shrink-0 text-xs ${task.badgeClass}`}
                  >
                    {task.deadline}
                  </Badge>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Bottom Row: IA Copilot + Activity */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* IA Copilot Sugestoes */}
        <Card className="lg:col-span-3 animate-card-in stagger-5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-violet-500 animate-spin" style={{ animationDuration: "4s" }} />
              <CardTitle className="text-lg font-semibold">IA Copilot - Sugestoes</CardTitle>
            </div>
            <CardDescription>
              Recomendacoes personalizadas para seus leads
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {closerCopilotSuggestions.map((suggestion, idx) => (
              <div
                key={suggestion.id}
                className={`flex gap-3 rounded-lg border border-l-[3px] p-3 transition-colors hover:bg-muted/50 ${
                  idx === 0
                    ? "border-l-amber-500"
                    : "border-l-blue-500"
                }`}
              >
                <div
                  className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg ${suggestion.bgClass}`}
                >
                  <suggestion.icon
                    className={`size-4 ${suggestion.iconClass}`}
                  />
                </div>
                <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                  {suggestion.text}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="shrink-0 self-center"
                >
                  Agir
                  <ChevronRight className="size-3" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Minha Atividade Recente */}
        <Card className="lg:col-span-2 animate-card-in stagger-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Minha Atividade Recente</CardTitle>
            <CardDescription>Suas ultimas interacoes</CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <ActivityTimeline events={closerRecentActivity} />
          </CardContent>
        </Card>
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
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Personal Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {sdrStats.map((stat, idx) => (
          <StatCard key={stat.title} stat={stat} index={idx} />
        ))}
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Middle Row: Qualification Queue + Cadence */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Fila de Qualificacao */}
        <Card className="lg:col-span-3 animate-card-in stagger-5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Filter className="size-4 text-blue-500" />
              <CardTitle className="text-lg font-semibold">Fila de Qualificacao</CardTitle>
            </div>
            <CardDescription>
              {qualificationQueue.length} leads aguardando qualificacao
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
                  </div>
                </div>
                <Button
                  size="sm"
                  className="btn-lift bg-gradient-to-r from-primary to-violet-600 text-primary-foreground hover:from-primary/90 hover:to-violet-600/90 shadow-sm"
                >
                  Qualificar
                  <ChevronRight className="size-3" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Cadencia do Dia + Leads Recentes (stacked) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Cadencia do Dia */}
          <Card className="animate-card-in stagger-5">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Zap className="size-4 text-amber-500" />
                <CardTitle className="text-lg font-semibold">Cadencia do Dia</CardTitle>
              </div>
              <CardDescription>Progresso de contatos hoje</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-3xl font-bold">8</span>
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
                <span className="font-medium">53% concluido</span>
                <span>Faltam 7 contatos</span>
              </div>
            </CardContent>
          </Card>

          {/* Leads Recentes */}
          <Card className="animate-card-in stagger-6">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Leads Recentes</CardTitle>
              <CardDescription>Ultimos leads que chegaram</CardDescription>
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
