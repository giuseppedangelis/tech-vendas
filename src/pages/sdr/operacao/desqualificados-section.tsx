import { useState, useMemo } from "react"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DollarSign,
  Shield,
  Zap,
  CalendarClock,
  Building2,
  Users2,
  RefreshCw,
  Lightbulb,
  TrendingUp,
} from "lucide-react"
import { cn } from "@/lib/utils"

type Reason =
  | "budget"
  | "authority"
  | "need"
  | "timeline"
  | "out_of_scope"
  | "competitor"

interface Disqualified {
  id: string
  name: string
  company: string
  initials: string
  reason: Reason
  note: string
  sdr: string
  sdrInitials: string
  disqualifiedAt: string
  scoreAtDisqualify: number
  reactivatable: boolean
}

const reasonMeta: Record<
  Reason,
  {
    label: string
    icon: typeof DollarSign
    tone: string
    badgeTone: string
  }
> = {
  budget: {
    label: "Budget",
    icon: DollarSign,
    tone: "text-emerald-600 dark:text-emerald-400",
    badgeTone:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  },
  authority: {
    label: "Autoridade",
    icon: Shield,
    tone: "text-violet-600 dark:text-violet-400",
    badgeTone:
      "bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/20",
  },
  need: {
    label: "Necessidade",
    icon: Zap,
    tone: "text-primary",
    badgeTone: "bg-primary/10 text-primary border-primary/20",
  },
  timeline: {
    label: "Timeline",
    icon: CalendarClock,
    tone: "text-sky-600 dark:text-sky-400",
    badgeTone:
      "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20",
  },
  out_of_scope: {
    label: "Fora do escopo",
    icon: Building2,
    tone: "text-slate-500",
    badgeTone:
      "bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/20",
  },
  competitor: {
    label: "Concorrente",
    icon: Users2,
    tone: "text-rose-600 dark:text-rose-400",
    badgeTone:
      "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20",
  },
}

const records: Disqualified[] = [
  {
    id: "d1",
    name: "Alice Ramos",
    company: "Growth Lab",
    initials: "AR",
    reason: "budget",
    note: "Disse que só recompõe orçamento em Q3.",
    sdr: "Pedro Henrique",
    sdrInitials: "PH",
    disqualifiedAt: "há 2 dias",
    scoreAtDisqualify: 34,
    reactivatable: true,
  },
  {
    id: "d2",
    name: "Eduardo Lima",
    company: "TechPar",
    initials: "EL",
    reason: "competitor",
    note: "Acabou de assinar 12 meses com concorrente (Pipedrive).",
    sdr: "Larissa Moura",
    sdrInitials: "LM",
    disqualifiedAt: "há 3 dias",
    scoreAtDisqualify: 22,
    reactivatable: false,
  },
  {
    id: "d3",
    name: "Isadora Freitas",
    company: "Moda Trend",
    initials: "IF",
    reason: "authority",
    note: "Não é decisora. Indicou o CEO, mas ele não respondeu.",
    sdr: "João Batista",
    sdrInitials: "JB",
    disqualifiedAt: "há 4 dias",
    scoreAtDisqualify: 18,
    reactivatable: true,
  },
  {
    id: "d4",
    name: "Gabriel Souza",
    company: "Autopeças GS",
    initials: "GS",
    reason: "out_of_scope",
    note: "ICP fora do target (empresa com 3 funcionários).",
    sdr: "Tatiana Vieira",
    sdrInitials: "TV",
    disqualifiedAt: "há 5 dias",
    scoreAtDisqualify: 12,
    reactivatable: false,
  },
  {
    id: "d5",
    name: "Mariana Prado",
    company: "Studio Prado",
    initials: "MP",
    reason: "need",
    note: "Não percebe problema atual, disse que tá tudo ok.",
    sdr: "Pedro Henrique",
    sdrInitials: "PH",
    disqualifiedAt: "há 6 dias",
    scoreAtDisqualify: 28,
    reactivatable: true,
  },
  {
    id: "d6",
    name: "Sérgio Guimarães",
    company: "Indústria SG",
    initials: "SG",
    reason: "timeline",
    note: "Só pretende avaliar solução em 2027.",
    sdr: "Larissa Moura",
    sdrInitials: "LM",
    disqualifiedAt: "há 7 dias",
    scoreAtDisqualify: 42,
    reactivatable: true,
  },
  {
    id: "d7",
    name: "Natália Costa",
    company: "Boutique NC",
    initials: "NC",
    reason: "budget",
    note: "Considera o valor alto, quer entender ROI melhor.",
    sdr: "João Batista",
    sdrInitials: "JB",
    disqualifiedAt: "há 8 dias",
    scoreAtDisqualify: 38,
    reactivatable: true,
  },
]

export function DesqualificadosSection() {
  const [filter, setFilter] = useState<"all" | Reason>("all")

  const distribution = useMemo(() => {
    const map = new Map<Reason, number>()
    records.forEach((r) =>
      map.set(r.reason, (map.get(r.reason) ?? 0) + 1)
    )
    return (Object.keys(reasonMeta) as Reason[]).map((r) => ({
      reason: r,
      count: map.get(r) ?? 0,
      pct: Math.round(((map.get(r) ?? 0) / records.length) * 100),
    }))
  }, [])

  const filtered = useMemo(() => {
    return filter === "all"
      ? records
      : records.filter((r) => r.reason === filter)
  }, [filter])

  const reactivatableCount = records.filter((r) => r.reactivatable).length

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h3 className="font-display text-lg font-bold tracking-tight">
            Leads Desqualificados
          </h3>
          <p className="text-sm text-muted-foreground">
            {records.length} desqualificados nos últimos 30 dias · {reactivatableCount} com potencial de reativação.
          </p>
        </div>
        <Button
          size="sm"
          className="btn-lift bg-gradient-to-r from-primary to-orange-600 text-primary-foreground shadow-md shadow-primary/10"
        >
          <RefreshCw className="mr-1.5 size-3.5" />
          Reativar selecionados
        </Button>
      </header>

      {/* Reason distribution */}
      <Card className="animate-card-in">
        <CardContent className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="font-display text-sm font-semibold tracking-tight">
                Distribuição por motivo
              </p>
              <p className="text-[11px] text-muted-foreground">
                Identifique o principal ofensor e ajuste qualificação ou ICP.
              </p>
            </div>
          </div>

          {/* Stacked bar */}
          <div className="relative mb-3 h-3 overflow-hidden rounded-full bg-muted">
            {distribution.reduce<React.ReactNode[]>((acc, d, i) => {
              if (d.count === 0) return acc
              const prevSum = distribution
                .slice(0, i)
                .reduce((a, b) => a + b.pct, 0)
              acc.push(
                <div
                  key={d.reason}
                  className={cn(
                    "absolute inset-y-0 transition-all duration-500",
                    d.reason === "budget" && "bg-emerald-500/60",
                    d.reason === "authority" && "bg-violet-500/60",
                    d.reason === "need" && "bg-primary/70",
                    d.reason === "timeline" && "bg-sky-500/60",
                    d.reason === "out_of_scope" && "bg-slate-500/60",
                    d.reason === "competitor" && "bg-rose-500/60"
                  )}
                  style={{
                    left: `${prevSum}%`,
                    width: `${d.pct}%`,
                  }}
                  aria-label={`${reasonMeta[d.reason].label}: ${d.count}`}
                />
              )
              return acc
            }, [])}
          </div>

          {/* Chips */}
          <div
            className="flex flex-wrap gap-2"
            role="radiogroup"
            aria-label="Filtrar por motivo"
          >
            <button
              onClick={() => setFilter("all")}
              role="radio"
              aria-checked={filter === "all"}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-all",
                filter === "all"
                  ? "border-primary/40 bg-primary/[0.06] text-primary shadow-sm shadow-primary/10"
                  : "border-border/60 bg-card/50 text-muted-foreground hover:border-primary/20 hover:text-foreground"
              )}
            >
              Todos
              <span
                className={cn(
                  "inline-flex min-w-[18px] items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums",
                  filter === "all"
                    ? "bg-primary/15 text-primary"
                    : "bg-muted text-muted-foreground/80"
                )}
              >
                {records.length}
              </span>
            </button>
            {distribution.map((d) => {
              const meta = reasonMeta[d.reason]
              const active = filter === d.reason
              return (
                <button
                  key={d.reason}
                  onClick={() => setFilter(d.reason)}
                  role="radio"
                  aria-checked={active}
                  disabled={d.count === 0}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed",
                    active
                      ? meta.badgeTone
                      : "border-border/60 bg-card/50 text-muted-foreground hover:border-primary/20 hover:text-foreground"
                  )}
                >
                  <meta.icon className="size-3" />
                  {meta.label}
                  <span className="inline-flex min-w-[18px] items-center justify-center rounded-full bg-current/10 px-1.5 py-0.5 text-[10px] font-bold tabular-nums">
                    {d.count}
                  </span>
                  <span className="text-[10px] text-current/70 tabular-nums">
                    {d.pct}%
                  </span>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="animate-card-in stagger-1 overflow-hidden p-0">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lead</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead className="w-[30%]">Nota do SDR</TableHead>
                  <TableHead>SDR</TableHead>
                  <TableHead>Quando</TableHead>
                  <TableHead>Score final</TableHead>
                  <TableHead>Potencial</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => {
                  const meta = reasonMeta[r.reason]
                  return (
                    <TableRow key={r.id} className="group">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8 ring-1 ring-border/60">
                            <AvatarFallback className="bg-gradient-to-br from-muted to-muted/60 text-[10px] font-semibold text-muted-foreground">
                              {r.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="truncate text-[13px] font-medium">
                              {r.name}
                            </p>
                            <p className="truncate text-[11px] text-muted-foreground">
                              {r.company}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={cn("gap-1 text-[10px]", meta.badgeTone)}
                        >
                          <meta.icon className="size-2.5" />
                          {meta.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <p className="text-[12px] italic text-muted-foreground">
                          "{r.note}"
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="size-6">
                            <AvatarFallback className="bg-muted text-[9px] font-bold">
                              {r.sdrInitials}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-[12px] text-muted-foreground">
                            {r.sdr.split(" ")[0]}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-[12px] text-muted-foreground">
                          {r.disqualifiedAt}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="font-display text-[13px] font-bold tabular-nums text-muted-foreground">
                          {r.scoreAtDisqualify}
                        </span>
                      </TableCell>
                      <TableCell>
                        {r.reactivatable ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 gap-1 text-[11px] text-primary hover:bg-primary/10"
                          >
                            <RefreshCw className="size-3" />
                            Reativar
                          </Button>
                        ) : (
                          <Badge variant="secondary" className="text-[10px]">
                            Arquivar
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Insight */}
      <div className="flex items-start gap-3 rounded-xl bg-primary/[0.04] border border-primary/10 px-4 py-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Lightbulb className="size-4 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-[13px] font-medium">Padrão detectado pela IA</p>
          <p className="mt-0.5 text-[12px] leading-relaxed text-muted-foreground">
            Budget e Autoridade somam{" "}
            <span className="font-semibold text-foreground/80">43%</span> dos
            descartes. Recomendação: incluir pergunta de{" "}
            <span className="font-semibold text-foreground/80">
              orçamento
            </span>{" "}
            logo no Step 1 da cadência de Prospecção B2B para desqualificar
            cedo e reduzir desgaste do SDR.
          </p>
        </div>
        <Button variant="ghost" size="sm" className="shrink-0">
          <TrendingUp className="mr-1 size-3.5" />
          Aplicar
        </Button>
      </div>
    </div>
  )
}
