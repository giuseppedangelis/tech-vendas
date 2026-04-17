import { useState } from "react"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Trophy,
  Users,
  CheckCircle2,
  Timer,
  Percent,
  TrendingUp,
  TrendingDown,
  Minus,
  Medal,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SdrStat {
  id: string
  rank: number
  name: string
  initials: string
  qualifiedDay: number
  qualifiedMonth: number
  goalMonth: number
  responseRate: number
  avgQualificationHours: number
  handoffRate: number
  avgScoreDelta: number
  sparkline: number[]
}

const sdrs: SdrStat[] = [
  {
    id: "p1",
    rank: 1,
    name: "Pedro Henrique",
    initials: "PH",
    qualifiedDay: 8,
    qualifiedMonth: 142,
    goalMonth: 150,
    responseRate: 42,
    avgQualificationHours: 6.2,
    handoffRate: 38,
    avgScoreDelta: 12,
    sparkline: [4, 6, 5, 7, 6, 8, 9, 8, 10, 12, 11, 14],
  },
  {
    id: "p2",
    rank: 2,
    name: "Larissa Moura",
    initials: "LM",
    qualifiedDay: 6,
    qualifiedMonth: 118,
    goalMonth: 150,
    responseRate: 38,
    avgQualificationHours: 8.1,
    handoffRate: 31,
    avgScoreDelta: 7,
    sparkline: [3, 4, 5, 6, 5, 6, 7, 6, 8, 7, 9, 10],
  },
  {
    id: "p3",
    rank: 3,
    name: "João Batista",
    initials: "JB",
    qualifiedDay: 4,
    qualifiedMonth: 82,
    goalMonth: 120,
    responseRate: 28,
    avgQualificationHours: 11.4,
    handoffRate: 22,
    avgScoreDelta: -2,
    sparkline: [2, 3, 3, 4, 3, 4, 5, 4, 3, 5, 4, 6],
  },
  {
    id: "p4",
    rank: 4,
    name: "Tatiana Vieira",
    initials: "TV",
    qualifiedDay: 2,
    qualifiedMonth: 48,
    goalMonth: 120,
    responseRate: 19,
    avgQualificationHours: 14.8,
    handoffRate: 14,
    avgScoreDelta: -6,
    sparkline: [2, 3, 2, 3, 2, 3, 3, 2, 3, 2, 3, 4],
  },
]

const teamTotals = {
  qualifiedMonth: sdrs.reduce((a, s) => a + s.qualifiedMonth, 0),
  goalMonth: sdrs.reduce((a, s) => a + s.goalMonth, 0),
  avgResponseRate: Math.round(
    sdrs.reduce((a, s) => a + s.responseRate, 0) / sdrs.length
  ),
  avgQualificationHours:
    Math.round(
      (sdrs.reduce((a, s) => a + s.avgQualificationHours, 0) / sdrs.length) * 10
    ) / 10,
}

function rankBadgeTone(rank: number) {
  if (rank === 1)
    return "bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-sm shadow-amber-500/30"
  if (rank === 2)
    return "bg-gradient-to-br from-slate-300 to-slate-500 text-white shadow-sm"
  if (rank === 3)
    return "bg-gradient-to-br from-orange-700 to-orange-900 text-white shadow-sm"
  return "bg-muted text-muted-foreground"
}

function Sparkline({ data }: { data: number[] }) {
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
            Performance por SDR
          </h3>
          <p className="text-sm text-muted-foreground">
            KPIs individuais, tendência e progresso contra a meta mensal.
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
          label="Qualificados no mês"
          value={`${teamTotals.qualifiedMonth}`}
          hint={`de ${teamTotals.goalMonth} · meta da equipe`}
          icon={CheckCircle2}
          progress={(teamTotals.qualifiedMonth / teamTotals.goalMonth) * 100}
        />
        <SummaryCard
          label="Taxa média de resposta"
          value={`${teamTotals.avgResponseRate}%`}
          hint="média entre SDRs"
          icon={Percent}
        />
        <SummaryCard
          label="Tempo médio p/ qualificar"
          value={`${teamTotals.avgQualificationHours}h`}
          hint="do 1º contato até handoff"
          icon={Timer}
        />
        <SummaryCard
          label="SDRs ativos"
          value={`${sdrs.length}`}
          hint="distribuição equilibrada"
          icon={Users}
        />
      </div>

      {/* Ranking list */}
      <div className="space-y-3">
        {sdrs.map((s, i) => {
          const goalPct = Math.round((s.qualifiedMonth / s.goalMonth) * 100)
          const onTrack = goalPct >= 80
          const TrendIcon =
            s.avgScoreDelta > 0
              ? TrendingUp
              : s.avgScoreDelta < 0
                ? TrendingDown
                : Minus
          const trendColor =
            s.avgScoreDelta > 0
              ? "text-emerald-600 dark:text-emerald-400"
              : s.avgScoreDelta < 0
                ? "text-rose-600 dark:text-rose-400"
                : "text-muted-foreground"
          return (
            <Card
              key={s.id}
              className={cn(
                "animate-card-in card-hover",
                `stagger-${Math.min(i + 1, 6)}`
              )}
            >
              <CardContent className="p-5">
                <div className="grid grid-cols-1 items-center gap-4 lg:grid-cols-[auto_minmax(0,1fr)_minmax(0,2fr)_minmax(0,1.2fr)]">
                  {/* Rank + Identity */}
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-xl font-display text-sm font-bold",
                        rankBadgeTone(s.rank)
                      )}
                    >
                      {s.rank <= 3 ? <Medal className="size-4" /> : s.rank}
                    </div>
                    <Avatar className="size-11 ring-2 ring-border/60">
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-orange-500/20 text-sm font-bold text-primary">
                        {s.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-display text-[15px] font-semibold tracking-tight">
                        {s.name}
                      </p>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-[10px]",
                          onTrack
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                        )}
                      >
                        {onTrack ? "No ritmo" : "Abaixo da meta"}
                      </Badge>
                    </div>
                  </div>

                  {/* Goal progress */}
                  <div className="space-y-1.5">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/80">
                        Meta do mês
                      </span>
                      <span className="font-display text-sm font-bold tabular-nums">
                        {s.qualifiedMonth}
                        <span className="text-xs font-normal text-muted-foreground">
                          /{s.goalMonth}
                        </span>
                      </span>
                    </div>
                    <Progress value={goalPct} className="h-1.5" />
                    <p className="text-[11px] text-muted-foreground">
                      {goalPct}% atingido · faltam {s.goalMonth - s.qualifiedMonth}
                    </p>
                  </div>

                  {/* KPI grid */}
                  <div className="grid grid-cols-4 gap-3">
                    <Kpi label="Hoje" value={s.qualifiedDay} unit="qual." />
                    <Kpi
                      label="Resposta"
                      value={`${s.responseRate}%`}
                      tone={s.responseRate >= 35 ? "good" : "warn"}
                    />
                    <Kpi
                      label="Tempo qual."
                      value={`${s.avgQualificationHours}h`}
                      tone={s.avgQualificationHours <= 8 ? "good" : "warn"}
                    />
                    <Kpi
                      label="Handoff"
                      value={`${s.handoffRate}%`}
                      tone={s.handoffRate >= 30 ? "good" : "warn"}
                    />
                  </div>

                  {/* Sparkline + delta */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/80">
                        Tendência (12 sem)
                      </span>
                      <span
                        className={cn(
                          "flex items-center gap-0.5 text-[11px] font-bold",
                          trendColor
                        )}
                      >
                        <TrendIcon className="size-3" />
                        {s.avgScoreDelta > 0 ? "+" : ""}
                        {s.avgScoreDelta} pts
                      </span>
                    </div>
                    <Sparkline data={s.sparkline} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="flex items-start gap-2 rounded-xl bg-primary/[0.04] border border-primary/10 px-3.5 py-2.5">
        <Trophy className="mt-0.5 size-4 shrink-0 text-primary" />
        <p className="flex-1 text-[12px] leading-relaxed text-muted-foreground">
          <span className="font-medium text-foreground/80">
            Pedro Henrique
          </span>{" "}
          é o destaque do período com +12 pts de melhora no score médio de lead.
          Clique no nome para ver o detalhamento.
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
  icon: typeof Users
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
  unit,
  tone,
}: {
  label: string
  value: string | number
  unit?: string
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
        {unit && (
          <span className="ml-0.5 text-[10px] font-normal text-muted-foreground">
            {unit}
          </span>
        )}
      </p>
    </div>
  )
}
