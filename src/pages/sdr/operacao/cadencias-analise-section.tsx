import { useState } from "react"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Repeat,
  Users,
  Percent,
  DollarSign,
  ArrowRight,
  Zap,
  Clock,
  TrendingUp,
  AlertCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface StepFunnel {
  step: string
  sent: number
  replied: number
  qualified: number
}

interface CadenceAnalysis {
  id: string
  name: string
  type: "outreach" | "reactivation" | "outbound"
  active: boolean
  leadsProcessed: number
  leadsActive: number
  replyRate: number
  handoffRate: number
  costPerQualified: number
  avgTimeToQualifyDays: number
  funnel: StepFunnel[]
  trend: "up" | "down" | "flat"
}

const cadenceList: CadenceAnalysis[] = [
  {
    id: "ca1",
    name: "Prospecção B2B Inicial",
    type: "outreach",
    active: true,
    leadsProcessed: 312,
    leadsActive: 82,
    replyRate: 34,
    handoffRate: 18,
    costPerQualified: 24,
    avgTimeToQualifyDays: 3.8,
    trend: "up",
    funnel: [
      { step: "Step 1 · Dia 0", sent: 312, replied: 106, qualified: 0 },
      { step: "Step 2 · Dia +2", sent: 206, replied: 62, qualified: 24 },
      { step: "Step 3 · Dia +4", sent: 144, replied: 38, qualified: 22 },
      { step: "Step 4 · Dia +7", sent: 106, replied: 19, qualified: 10 },
    ],
  },
  {
    id: "ca2",
    name: "Reativação 30 dias",
    type: "reactivation",
    active: true,
    leadsProcessed: 187,
    leadsActive: 41,
    replyRate: 22,
    handoffRate: 11,
    costPerQualified: 38,
    avgTimeToQualifyDays: 5.2,
    trend: "flat",
    funnel: [
      { step: "Step 1 · Dia 0", sent: 187, replied: 41, qualified: 0 },
      { step: "Step 2 · Dia +3", sent: 146, replied: 28, qualified: 12 },
      { step: "Step 3 · Dia +7", sent: 118, replied: 18, qualified: 8 },
    ],
  },
  {
    id: "ca3",
    name: "Outbound LinkedIn → WhatsApp",
    type: "outbound",
    active: false,
    leadsProcessed: 92,
    leadsActive: 0,
    replyRate: 18,
    handoffRate: 6,
    costPerQualified: 72,
    avgTimeToQualifyDays: 8.1,
    trend: "down",
    funnel: [
      { step: "Step 1 · Dia 0", sent: 92, replied: 17, qualified: 0 },
      { step: "Step 2 · Dia +3", sent: 75, replied: 8, qualified: 3 },
      { step: "Step 3 · Dia +6", sent: 67, replied: 4, qualified: 2 },
    ],
  },
]

const typeTone: Record<CadenceAnalysis["type"], string> = {
  outreach: "bg-primary/10 text-primary border-primary/20",
  reactivation:
    "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20",
  outbound:
    "bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/20",
}

const typeLabel: Record<CadenceAnalysis["type"], string> = {
  outreach: "Prospecção",
  reactivation: "Reativação",
  outbound: "Outbound",
}

export function CadenciasAnaliseSection() {
  const [period, setPeriod] = useState("30d")

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h3 className="font-display text-lg font-bold tracking-tight">
            Análise por Cadência
          </h3>
          <p className="text-sm text-muted-foreground">
            Efetividade e custo por cadência ativa.
          </p>
        </div>
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
      </header>

      {/* Comparative bar */}
      <Card className="animate-card-in">
        <CardContent className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="font-display text-sm font-semibold tracking-tight">
                Comparativo de handoff
              </p>
              <p className="text-[11px] text-muted-foreground">
                Taxa de handoff de cada cadência contra a média da operação.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {cadenceList.map((c) => {
              const maxRate = Math.max(...cadenceList.map((cc) => cc.handoffRate))
              const pct = (c.handoffRate / maxRate) * 100
              return (
                <div key={c.id} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="truncate text-[12px] font-medium">
                        {c.name}
                      </span>
                      <Badge
                        variant="secondary"
                        className={cn("shrink-0 text-[9px]", typeTone[c.type])}
                      >
                        {typeLabel[c.type]}
                      </Badge>
                    </div>
                    <span className="font-display text-sm font-bold tabular-nums">
                      {c.handoffRate}%
                    </span>
                  </div>
                  <div className="relative h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn(
                        "absolute inset-y-0 left-0 rounded-full transition-all duration-500",
                        c.active
                          ? "bg-gradient-to-r from-primary to-orange-500"
                          : "bg-muted-foreground/40"
                      )}
                      style={{ width: `${pct}%` }}
                      aria-hidden
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Cadence detail cards */}
      <div className="space-y-4">
        {cadenceList.map((c, i) => (
          <Card
            key={c.id}
            className={cn(
              "animate-card-in card-hover",
              `stagger-${Math.min(i + 1, 6)}`,
              !c.active && "opacity-75"
            )}
          >
            <CardContent className="p-5 space-y-5">
              {/* Header */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-xl border",
                      typeTone[c.type]
                    )}
                    aria-hidden
                  >
                    <Repeat className="size-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-display text-[15px] font-semibold tracking-tight">
                        {c.name}
                      </h4>
                      <Badge
                        variant="secondary"
                        className={cn("text-[10px]", typeTone[c.type])}
                      >
                        {typeLabel[c.type]}
                      </Badge>
                      {c.active ? (
                        <Badge
                          variant="secondary"
                          className="gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px]"
                        >
                          <span className="size-1.5 rounded-full bg-emerald-500 pulse-online" />
                          Ativa
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-[10px]">
                          Pausada
                        </Badge>
                      )}
                      {c.trend === "down" && c.active && (
                        <Badge
                          variant="secondary"
                          className="gap-1 bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20 text-[10px]"
                        >
                          <AlertCircle className="size-2.5" />
                          Performance em queda
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Abrir editor
                  <ArrowRight className="ml-1 size-3.5" />
                </Button>
              </div>

              {/* KPI row */}
              <div className="grid gap-3 border-y border-border/60 py-4 sm:grid-cols-2 lg:grid-cols-5">
                <KpiCell
                  icon={Users}
                  label="Processados"
                  value={c.leadsProcessed.toString()}
                  hint={`${c.leadsActive} ativos`}
                />
                <KpiCell
                  icon={Percent}
                  label="Taxa de resposta"
                  value={`${c.replyRate}%`}
                  tone={c.replyRate >= 30 ? "good" : "warn"}
                />
                <KpiCell
                  icon={Zap}
                  label="Taxa de handoff"
                  value={`${c.handoffRate}%`}
                  tone={c.handoffRate >= 15 ? "good" : "warn"}
                />
                <KpiCell
                  icon={Clock}
                  label="Tempo médio"
                  value={`${c.avgTimeToQualifyDays}d`}
                  hint="até qualificar"
                />
                <KpiCell
                  icon={DollarSign}
                  label="Custo / qual."
                  value={`R$ ${c.costPerQualified}`}
                  tone={c.costPerQualified <= 30 ? "good" : "warn"}
                />
              </div>

              {/* Step funnel */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                    Funil step por step
                  </p>
                  <p className="text-[10px] text-muted-foreground/60">
                    respostas · qualificações
                  </p>
                </div>
                <ol className="space-y-2">
                  {c.funnel.map((f, idx) => {
                    const replyPct = Math.round((f.replied / f.sent) * 100)
                    const qualPct = Math.round((f.qualified / f.sent) * 100)
                    return (
                      <li key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-muted-foreground">
                            {f.step}
                          </span>
                          <span className="font-display tabular-nums">
                            <span className="text-foreground/80">
                              {f.sent}
                            </span>
                            <span className="text-muted-foreground/60">
                              {" "}
                              enviados
                            </span>
                          </span>
                        </div>
                        <div className="relative h-5 overflow-hidden rounded-md bg-muted/60">
                          <div
                            className="absolute inset-y-0 left-0 flex items-center justify-end bg-sky-500/30 pr-2 text-[9px] font-bold text-sky-700 dark:text-sky-300 transition-all duration-500"
                            style={{ width: `${replyPct}%` }}
                            aria-label={`${f.replied} respostas`}
                          >
                            {replyPct >= 8 && `${f.replied}`}
                          </div>
                          <div
                            className="absolute inset-y-0 left-0 flex items-center justify-end bg-gradient-to-r from-primary/60 to-orange-500/60 pr-2 text-[9px] font-bold text-white transition-all duration-500"
                            style={{ width: `${qualPct}%` }}
                            aria-label={`${f.qualified} qualificados`}
                          >
                            {qualPct >= 5 && f.qualified > 0 && `${f.qualified}`}
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ol>

                {/* Legend */}
                <div className="mt-3 flex items-center gap-4 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-sm bg-sky-500/40" />
                    Respostas
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-sm bg-primary/60" />
                    Qualificados
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-start gap-2 rounded-xl bg-primary/[0.04] border border-primary/10 px-3.5 py-2.5">
        <TrendingUp className="mt-0.5 size-4 shrink-0 text-primary" />
        <p className="flex-1 text-[12px] leading-relaxed text-muted-foreground">
          <span className="font-medium text-foreground/80">Insight:</span>{" "}
          Step 2 (Dia +2) é onde a cadência de Prospecção B2B gera mais
          handoffs por resposta. Vale estudar o template para replicar padrão
          nas outras cadências.
        </p>
      </div>
    </div>
  )
}

function KpiCell({
  icon: Icon,
  label,
  value,
  hint,
  tone,
}: {
  icon: typeof Users
  label: string
  value: string
  hint?: string
  tone?: "good" | "warn"
}) {
  const toneCls =
    tone === "good"
      ? "text-emerald-600 dark:text-emerald-400"
      : tone === "warn"
        ? "text-amber-600 dark:text-amber-400"
        : ""
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted/50 text-muted-foreground">
        <Icon className="size-3.5" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
          {label}
        </p>
        <p
          className={cn(
            "font-display text-sm font-bold tracking-tight tabular-nums",
            toneCls
          )}
        >
          {value}
        </p>
        {hint && (
          <p className="text-[10px] text-muted-foreground/60">{hint}</p>
        )}
      </div>
    </div>
  )
}
