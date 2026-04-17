import { useState } from "react"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Bot,
  CheckCircle2,
  Timer,
  Percent,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Phone,
  Heart,
  Trophy,
  ShoppingCart,
  Pause,
  DollarSign,
  Activity,
} from "lucide-react"
import { cn } from "@/lib/utils"

type Status = "top" | "stable" | "warning" | "paused"

interface AgentStat {
  id: string
  name: string
  initials: string
  icon: typeof Phone
  accent: string
  status: Status
  model: string
  leadsToday: number
  leadsMonth: number
  capacityMonth: number
  responseRate: number
  avgQualificationHours: number
  handoffRate: number
  scoreDelta: number
  costMonth: number
  sparkline: number[]
}

const agents: AgentStat[] = [
  {
    id: "ag1",
    name: "Ana Prospectora",
    initials: "AP",
    icon: Phone,
    accent:
      "from-primary/15 to-orange-500/10 text-primary border-primary/20",
    status: "top",
    model: "Claude Sonnet 4.6",
    leadsToday: 38,
    leadsMonth: 1842,
    capacityMonth: 2400,
    responseRate: 42,
    avgQualificationHours: 6.2,
    handoffRate: 38,
    scoreDelta: 12,
    costMonth: 41.2,
    sparkline: [80, 110, 95, 120, 130, 142, 138, 150, 168, 175, 182, 195],
  },
  {
    id: "ag2",
    name: "Roberto Recuperador",
    initials: "RR",
    icon: Heart,
    accent:
      "from-sky-500/15 to-sky-500/5 text-sky-700 dark:text-sky-400 border-sky-500/20",
    status: "stable",
    model: "Claude Haiku 4.5",
    leadsToday: 18,
    leadsMonth: 612,
    capacityMonth: 800,
    responseRate: 26,
    avgQualificationHours: 9.4,
    handoffRate: 22,
    scoreDelta: 4,
    costMonth: 8.7,
    sparkline: [40, 45, 50, 55, 48, 52, 58, 60, 62, 60, 65, 68],
  },
  {
    id: "ag3",
    name: "Sofia Pré-Vendas",
    initials: "SP",
    icon: Trophy,
    accent:
      "from-violet-500/15 to-violet-500/5 text-violet-700 dark:text-violet-400 border-violet-500/20",
    status: "warning",
    model: "Claude Opus 4.7",
    leadsToday: 6,
    leadsMonth: 184,
    capacityMonth: 240,
    responseRate: 56,
    avgQualificationHours: 14.2,
    handoffRate: 52,
    scoreDelta: -3,
    costMonth: 28.4,
    sparkline: [22, 18, 24, 20, 16, 22, 18, 14, 20, 16, 18, 14],
  },
  {
    id: "ag4",
    name: "Bruno Carrinho",
    initials: "BC",
    icon: ShoppingCart,
    accent:
      "from-amber-500/15 to-amber-500/5 text-amber-700 dark:text-amber-400 border-amber-500/20",
    status: "paused",
    model: "GPT-4o",
    leadsToday: 0,
    leadsMonth: 0,
    capacityMonth: 600,
    responseRate: 0,
    avgQualificationHours: 0,
    handoffRate: 0,
    scoreDelta: 0,
    costMonth: 0,
    sparkline: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
]

const teamTotals = {
  leadsMonth: agents.reduce((a, s) => a + s.leadsMonth, 0),
  capacityMonth: agents.reduce((a, s) => a + s.capacityMonth, 0),
  avgResponseRate: Math.round(
    agents.filter((a) => a.responseRate > 0).reduce(
      (acc, a, _, arr) => acc + a.responseRate / arr.length,
      0
    )
  ),
  avgQualificationHours:
    Math.round(
      (agents
        .filter((a) => a.avgQualificationHours > 0)
        .reduce((acc, a, _, arr) => acc + a.avgQualificationHours / arr.length, 0)) *
        10
    ) / 10,
  costMonth: Number(
    agents.reduce((acc, a) => acc + a.costMonth, 0).toFixed(2)
  ),
}

const statusMeta: Record<
  Status,
  { label: string; tone: string; icon: typeof Sparkles }
> = {
  top: {
    label: "Top performer",
    tone: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
    icon: Sparkles,
  },
  stable: {
    label: "Estável",
    tone: "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20",
    icon: Activity,
  },
  warning: {
    label: "Requer atenção",
    tone: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
    icon: TrendingDown,
  },
  paused: {
    label: "Pausado",
    tone: "bg-muted text-muted-foreground border-border",
    icon: Pause,
  },
}

function Sparkline({ data }: { data: number[] }) {
  const allZero = data.every((v) => v === 0)
  if (allZero) {
    return (
      <div className="flex h-7 items-center justify-center text-[10px] text-muted-foreground/40">
        sem atividade
      </div>
    )
  }
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const w = 100
  const h = 28
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w
      const y = h - ((v - min) / range) * h
      return `${x},${y}`
    })
    .join(" ")

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="h-7 w-full"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="sl-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        fill="url(#sl-fill)"
        points={`0,${h} ${points} ${w},${h}`}
        className="text-primary"
      />
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        className="text-primary"
      />
    </svg>
  )
}

export function PerformanceSection() {
  const [period, setPeriod] = useState("30d")

  return (
    <div className="space-y-5">
      {/* Section header */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h3 className="font-display text-lg font-bold tracking-tight">
            Performance por Agente
          </h3>
          <p className="text-sm text-muted-foreground">
            Volume processado, qualidade e custo de cada agente IA SDR.
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="sm:w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
              <SelectItem value="90d">Últimos 90 dias</SelectItem>
            </SelectContent>
          </Select>
          <Button
            size="sm"
            className="btn-lift bg-gradient-to-r from-primary to-orange-600 text-primary-foreground shadow-md shadow-primary/10"
          >
            Exportar
          </Button>
        </div>
      </header>

      {/* Team summary */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label="Leads processados"
          value={teamTotals.leadsMonth.toLocaleString("pt-BR")}
          hint={`de ${teamTotals.capacityMonth.toLocaleString("pt-BR")} de capacidade`}
          icon={CheckCircle2}
          progress={(teamTotals.leadsMonth / teamTotals.capacityMonth) * 100}
        />
        <SummaryCard
          label="Taxa média de resposta"
          value={`${teamTotals.avgResponseRate}%`}
          hint="entre agentes ativos"
          icon={Percent}
        />
        <SummaryCard
          label="Tempo médio p/ qualificar"
          value={`${teamTotals.avgQualificationHours}h`}
          hint="do 1º contato até handoff"
          icon={Timer}
        />
        <SummaryCard
          label="Custo total LLM"
          value={`$ ${teamTotals.costMonth.toFixed(2)}`}
          hint="últimos 30 dias"
          icon={DollarSign}
        />
      </div>

      {/* Agent cards */}
      <div className="space-y-3">
        {agents.map((a, i) => {
          const usagePct = Math.round((a.leadsMonth / a.capacityMonth) * 100)
          const TrendIcon =
            a.scoreDelta > 0
              ? TrendingUp
              : a.scoreDelta < 0
                ? TrendingDown
                : Minus
          const trendColor =
            a.scoreDelta > 0
              ? "text-emerald-600 dark:text-emerald-400"
              : a.scoreDelta < 0
                ? "text-rose-600 dark:text-rose-400"
                : "text-muted-foreground"
          const status = statusMeta[a.status]
          const isPaused = a.status === "paused"
          return (
            <Card
              key={a.id}
              className={cn(
                "animate-card-in card-hover",
                `stagger-${Math.min(i + 1, 6)}`,
                isPaused && "opacity-70"
              )}
            >
              <CardContent className="p-5">
                <div className="grid grid-cols-1 items-center gap-4 lg:grid-cols-[auto_minmax(0,1fr)_minmax(0,2fr)_minmax(0,1.2fr)]">
                  {/* Identity */}
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex size-12 shrink-0 items-center justify-center rounded-xl border-2 bg-gradient-to-br",
                        a.accent
                      )}
                      aria-hidden
                    >
                      <a.icon className="size-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="font-display text-[15px] font-semibold tracking-tight">
                          {a.name}
                        </p>
                        <Badge
                          variant="secondary"
                          className="bg-primary/10 text-primary border-primary/20 text-[9px]"
                        >
                          <Bot className="mr-0.5 size-2.5" />
                          IA
                        </Badge>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-1.5">
                        <Badge
                          variant="secondary"
                          className={cn("gap-1 text-[10px]", status.tone)}
                        >
                          <status.icon className="size-2.5" />
                          {status.label}
                        </Badge>
                        <span className="text-[10px] font-mono text-muted-foreground/70">
                          {a.model}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Capacity progress */}
                  <div className="space-y-1.5">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/80">
                        Capacidade utilizada
                      </span>
                      <span className="font-display text-sm font-bold tabular-nums">
                        {a.leadsMonth.toLocaleString("pt-BR")}
                        <span className="text-xs font-normal text-muted-foreground">
                          /{a.capacityMonth.toLocaleString("pt-BR")}
                        </span>
                      </span>
                    </div>
                    <Progress value={usagePct} className="h-1.5" />
                    <p className="text-[11px] text-muted-foreground">
                      {isPaused
                        ? "Agente sem execução no período"
                        : `${usagePct}% da capacidade · ${a.leadsToday} hoje`}
                    </p>
                  </div>

                  {/* KPI grid */}
                  <div className="grid grid-cols-4 gap-3">
                    <Kpi
                      label="Resposta"
                      value={isPaused ? "—" : `${a.responseRate}%`}
                      tone={
                        isPaused
                          ? undefined
                          : a.responseRate >= 35
                            ? "good"
                            : "warn"
                      }
                    />
                    <Kpi
                      label="Tempo qual."
                      value={isPaused ? "—" : `${a.avgQualificationHours}h`}
                      tone={
                        isPaused
                          ? undefined
                          : a.avgQualificationHours <= 8
                            ? "good"
                            : "warn"
                      }
                    />
                    <Kpi
                      label="Handoff"
                      value={isPaused ? "—" : `${a.handoffRate}%`}
                      tone={
                        isPaused
                          ? undefined
                          : a.handoffRate >= 30
                            ? "good"
                            : "warn"
                      }
                    />
                    <Kpi
                      label="Custo"
                      value={isPaused ? "—" : `$${a.costMonth.toFixed(2)}`}
                      tone={
                        isPaused
                          ? undefined
                          : a.costMonth / Math.max(a.leadsMonth, 1) <= 0.05
                            ? "good"
                            : "warn"
                      }
                    />
                  </div>

                  {/* Sparkline + delta */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/80">
                        Tendência (12 sem)
                      </span>
                      {!isPaused && (
                        <span
                          className={cn(
                            "flex items-center gap-0.5 text-[11px] font-bold",
                            trendColor
                          )}
                        >
                          <TrendIcon className="size-3" />
                          {a.scoreDelta > 0 ? "+" : ""}
                          {a.scoreDelta} pts
                        </span>
                      )}
                    </div>
                    <Sparkline data={a.sparkline} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="flex items-start gap-2 rounded-xl bg-primary/[0.04] border border-primary/10 px-3.5 py-2.5">
        <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
        <p className="flex-1 text-[12px] leading-relaxed text-muted-foreground">
          <span className="font-medium text-foreground/80">
            Insight da IA Gestora:
          </span>{" "}
          o agente <span className="font-semibold">Sofia Pré-Vendas</span>{" "}
          mostra queda de score (-3 pts) nas últimas semanas — vale revisar o
          prompt ou trocar o modelo (Opus tem custo $28/mês para 184 leads).
          <span className="font-semibold"> Bruno Carrinho</span> está pausado e
          pode ser ativado para absorver demanda do e-commerce.
        </p>
      </div>
    </div>
  )
}

function SummaryCard({
  label,
  value,
  hint,
  icon: Icon,
  progress,
}: {
  label: string
  value: string
  hint: string
  icon: typeof Bot
  progress?: number
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/50 p-4 backdrop-blur-sm">
      <div className="flex items-start justify-between">
        <div className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-orange-500/10">
          <Icon className="size-4 text-primary" />
        </div>
        {progress != null && (
          <Badge
            variant="secondary"
            className="bg-primary/10 text-primary border-primary/20 text-[10px] font-display"
          >
            {Math.round(progress)}%
          </Badge>
        )}
      </div>
      <p className="mt-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
        {label}
      </p>
      <p className="font-display text-xl font-bold tracking-tight">{value}</p>
      <p className="text-[11px] text-muted-foreground/70">{hint}</p>
      {progress != null && <Progress value={progress} className="mt-2 h-1" />}
    </div>
  )
}

function Kpi({
  label,
  value,
  tone,
}: {
  label: string
  value: string | number
  tone?: "good" | "warn"
}) {
  const toneCls =
    tone === "good"
      ? "text-emerald-600 dark:text-emerald-400"
      : tone === "warn"
        ? "text-amber-600 dark:text-amber-400"
        : ""
  return (
    <div className="text-center">
      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
        {label}
      </p>
      <p
        className={cn(
          "font-display text-base font-bold tracking-tight tabular-nums",
          toneCls
        )}
      >
        {value}
      </p>
    </div>
  )
}
