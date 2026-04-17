import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Users,
  CheckCircle2,
  Percent,
  Timer,
  Flame,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Activity as ActivityIcon,
} from "lucide-react"
import { Link } from "react-router-dom"

const kpis = [
  {
    id: "active",
    label: "Leads em qualificação",
    value: "124",
    delta: "+12%",
    trend: "up" as const,
    icon: Users,
    hint: "vs. semana passada",
  },
  {
    id: "qualified",
    label: "Qualificados hoje",
    value: "18",
    delta: "+3",
    trend: "up" as const,
    icon: CheckCircle2,
    hint: "meta diária: 20",
  },
  {
    id: "conversion",
    label: "Taxa de handoff",
    value: "32%",
    delta: "-1.8%",
    trend: "down" as const,
    icon: Percent,
    hint: "últimos 7 dias",
  },
  {
    id: "sla",
    label: "SLA de primeira resposta",
    value: "4m 12s",
    delta: "-22s",
    trend: "up" as const,
    icon: Timer,
    hint: "meta: < 5 min",
  },
]

const handoffQueue = [
  {
    id: "h1",
    lead: "Marcos Andrade",
    company: "Logibras Transportes",
    score: 92,
    sdr: "Pedro Henrique",
    readyIn: "pronto",
    framework: "BANT completo",
  },
  {
    id: "h2",
    lead: "Fernanda Castro",
    company: "Nexa Digital",
    score: 88,
    sdr: "Pedro Henrique",
    readyIn: "pronto",
    framework: "BANT completo",
  },
  {
    id: "h3",
    lead: "Renato Oliveira",
    company: "Hub Varejo",
    score: 84,
    sdr: "Larissa Moura",
    readyIn: "agendado",
    framework: "BANT 75%",
  },
  {
    id: "h4",
    lead: "Camila Dias",
    company: "Prático Contábil",
    score: 81,
    sdr: "Larissa Moura",
    readyIn: "agendado",
    framework: "BANT 75%",
  },
]

const alerts = [
  {
    id: "a1",
    severity: "warning" as const,
    title: "Cadência 'Reativação B2B' com baixa resposta",
    description: "Taxa de resposta caiu para 8% nos últimos 5 dias.",
    time: "há 20min",
  },
  {
    id: "a2",
    severity: "critical" as const,
    title: "3 leads sem interação há +48h",
    description: "SDR Larissa Moura pode estar com sobrecarga.",
    time: "há 1h",
  },
  {
    id: "a3",
    severity: "info" as const,
    title: "Novo template WhatsApp aprovado pela Meta",
    description: "Template 'qualificacao_v3' está pronto para uso.",
    time: "há 3h",
  },
]

const sdrLoad = [
  { name: "Pedro Henrique", active: 42, capacity: 50 },
  { name: "Larissa Moura", active: 38, capacity: 40 },
  { name: "João Batista", active: 22, capacity: 40 },
  { name: "Tatiana Vieira", active: 15, capacity: 40 },
]

const severityStyles = {
  warning: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  critical: "bg-rose-500/10 text-rose-600 border-rose-500/20",
  info: "bg-sky-500/10 text-sky-600 border-sky-500/20",
}

function scoreTone(score: number) {
  if (score >= 80) return "bg-rose-500/10 text-rose-600 border-rose-500/20"
  if (score >= 60) return "bg-amber-500/10 text-amber-600 border-amber-500/20"
  if (score >= 40) return "bg-sky-500/10 text-sky-600 border-sky-500/20"
  return "bg-muted text-muted-foreground border-border"
}

export function SdrOverviewPage() {
  return (
    <div className="animate-page-in space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1 bg-primary/10 text-primary border-primary/20">
              <Flame className="size-3" />
              Módulo SDR
            </Badge>
          </div>
          <h2 className="text-gradient mt-2 text-2xl font-bold tracking-tight">Visão Geral SDR</h2>
          <p className="text-muted-foreground">
            Monitore prospecção, qualificação e handoff de leads para closers.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/sdr/operacao">
              <ActivityIcon className="mr-1.5 size-4" />
              Operação
            </Link>
          </Button>
          <Button asChild size="sm" className="btn-lift bg-gradient-to-r from-primary to-orange-600 text-primary-foreground shadow-md shadow-primary/10">
            <Link to="/sdr/configuracao">
              Configurar SDR
              <ArrowRight className="ml-1.5 size-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, i) => {
          const Trend = kpi.trend === "up" ? TrendingUp : TrendingDown
          const trendColor = kpi.trend === "up" ? "text-emerald-600" : "text-rose-600"
          return (
            <Card key={kpi.id} className={`animate-card-in card-hover stagger-${i + 1}`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-orange-500/10">
                    <kpi.icon className="size-5 text-primary" />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
                    <Trend className="size-3" />
                    {kpi.delta}
                  </div>
                </div>
                <div className="mt-4 space-y-1">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
                    {kpi.label}
                  </p>
                  <p className="font-display text-2xl font-bold tracking-tight">{kpi.value}</p>
                  <p className="text-[11px] text-muted-foreground/60">{kpi.hint}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main grid: handoff + alerts */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Handoff queue */}
        <Card className="animate-card-in lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Fila de Handoff para Closer</CardTitle>
              <CardDescription>Leads prontos para repasse ao time de fechamento</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/sdr/operacao">
                Ver todos
                <ArrowRight className="ml-1 size-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {handoffQueue.map((h) => (
              <div
                key={h.id}
                className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2.5 transition-all duration-200 hover:bg-primary/[0.03]"
              >
                <div className={`inline-flex h-9 min-w-[44px] items-center justify-center rounded-md border px-2 text-sm font-bold ${scoreTone(h.score)}`}>
                  {h.score}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{h.lead}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {h.company} · SDR: {h.sdr}
                  </p>
                </div>
                <div className="hidden flex-col items-end sm:flex">
                  <Badge variant="secondary" className="text-[10px]">
                    {h.framework}
                  </Badge>
                  <span className="mt-1 text-[10px] text-muted-foreground/70">{h.readyIn}</span>
                </div>
                <Button size="sm" variant="ghost" className="shrink-0">
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card className="animate-card-in">
          <CardHeader>
            <CardTitle className="text-base">Alertas</CardTitle>
            <CardDescription>Sinais que requerem atenção</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((a) => (
              <div
                key={a.id}
                className={`rounded-lg border px-3 py-2.5 ${severityStyles[a.severity]}`}
              >
                <div className="flex items-start gap-2">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium leading-tight">{a.title}</p>
                    <p className="mt-1 text-[11px] opacity-80">{a.description}</p>
                    <p className="mt-1.5 text-[10px] uppercase tracking-wider opacity-60">
                      {a.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* SDR capacity */}
      <Card className="animate-card-in">
        <CardHeader>
          <CardTitle className="text-base">Carga da equipe SDR</CardTitle>
          <CardDescription>Ocupação atual vs. capacidade configurada por SDR</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sdrLoad.map((s, i) => {
            const pct = Math.round((s.active / s.capacity) * 100)
            const tone =
              pct >= 95 ? "text-rose-600" : pct >= 80 ? "text-amber-600" : "text-emerald-600"
            return (
              <div key={s.name} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{s.name}</span>
                  <span className={`text-xs font-semibold ${tone}`}>
                    {s.active}/{s.capacity} · {pct}%
                  </span>
                </div>
                <Progress value={pct} className="h-1.5" />
                {i < sdrLoad.length - 1 && <Separator className="opacity-0" />}
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
