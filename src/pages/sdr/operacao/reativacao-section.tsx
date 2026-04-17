import { useState } from "react"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  RefreshCw,
  History,
  Archive,
  Sparkles,
  Flame,
  Snowflake,
  Trophy,
  AlertOctagon,
  Ghost,
  Check,
} from "lucide-react"
import { cn } from "@/lib/utils"

type SegmentId = "champions" | "at_risk" | "hibernating" | "lost" | "cant_lose"

const segments: {
  id: SegmentId
  label: string
  count: number
  description: string
  icon: typeof Flame
  tone: string
  gradient: string
}[] = [
  {
    id: "champions",
    label: "Champions",
    count: 18,
    description: "Alta freq · alto valor · recentes",
    icon: Trophy,
    tone: "text-emerald-600 dark:text-emerald-400",
    gradient:
      "from-emerald-500/10 to-emerald-500/5 border-emerald-500/20",
  },
  {
    id: "cant_lose",
    label: "Não podemos perder",
    count: 9,
    description: "Alto valor · inativos há 45d+",
    icon: AlertOctagon,
    tone: "text-rose-600 dark:text-rose-400",
    gradient: "from-rose-500/10 to-rose-500/5 border-rose-500/20",
  },
  {
    id: "at_risk",
    label: "Em risco",
    count: 24,
    description: "Valor médio · sem resposta 30d+",
    icon: Flame,
    tone: "text-amber-600 dark:text-amber-400",
    gradient: "from-amber-500/10 to-amber-500/5 border-amber-500/20",
  },
  {
    id: "hibernating",
    label: "Hibernando",
    count: 47,
    description: "Baixa freq · inativos 60d+",
    icon: Snowflake,
    tone: "text-sky-600 dark:text-sky-400",
    gradient: "from-sky-500/10 to-sky-500/5 border-sky-500/20",
  },
  {
    id: "lost",
    label: "Perdidos",
    count: 31,
    description: "Sem interação há 90d+",
    icon: Ghost,
    tone: "text-slate-500",
    gradient: "from-slate-500/10 to-slate-500/5 border-slate-500/20",
  },
]

interface InactiveLead {
  id: string
  name: string
  company: string
  initials: string
  segment: SegmentId
  daysSinceInteraction: number
  lastStage: string
  valueTier: "alto" | "médio" | "baixo"
  selected?: boolean
}

const inactiveLeads: InactiveLead[] = [
  {
    id: "r1",
    name: "Helena Barros",
    company: "Distribuidora HB",
    initials: "HB",
    segment: "cant_lose",
    daysSinceInteraction: 52,
    lastStage: "Proposta enviada",
    valueTier: "alto",
  },
  {
    id: "r2",
    name: "Lucas Amorim",
    company: "Edutech LA",
    initials: "LA",
    segment: "cant_lose",
    daysSinceInteraction: 48,
    lastStage: "Qualificado",
    valueTier: "alto",
  },
  {
    id: "r3",
    name: "Viviane Torres",
    company: "Agência VT",
    initials: "VT",
    segment: "at_risk",
    daysSinceInteraction: 34,
    lastStage: "Em qualificação",
    valueTier: "médio",
  },
  {
    id: "r4",
    name: "Ricardo Matos",
    company: "Construtora RM",
    initials: "RM",
    segment: "at_risk",
    daysSinceInteraction: 38,
    lastStage: "Em qualificação",
    valueTier: "médio",
  },
  {
    id: "r5",
    name: "Aline Ferreira",
    company: "Estúdio AF",
    initials: "AF",
    segment: "hibernating",
    daysSinceInteraction: 72,
    lastStage: "Contatado",
    valueTier: "baixo",
  },
  {
    id: "r6",
    name: "Paulo Veras",
    company: "Tech PV",
    initials: "PV",
    segment: "hibernating",
    daysSinceInteraction: 88,
    lastStage: "Contatado",
    valueTier: "médio",
  },
  {
    id: "r7",
    name: "Sofia Albuquerque",
    company: "Varejo SA",
    initials: "SA",
    segment: "lost",
    daysSinceInteraction: 124,
    lastStage: "Desqualificado",
    valueTier: "baixo",
  },
]

const cadenceOptions = [
  { id: "winback_high", label: "Winback · Alto valor" },
  { id: "winback_mid", label: "Winback · Valor médio" },
  { id: "reactivation_30", label: "Reativação 30 dias" },
  { id: "cold_revive", label: "Cold Revive · 90d+" },
]

const valueTierTone: Record<InactiveLead["valueTier"], string> = {
  alto: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  médio: "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20",
  baixo: "bg-muted text-muted-foreground border-border",
}

export function ReativacaoSection() {
  const [segmentFilter, setSegmentFilter] = useState<"all" | SegmentId>("all")
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [selectedCadence, setSelectedCadence] = useState(cadenceOptions[0].id)

  const filtered =
    segmentFilter === "all"
      ? inactiveLeads
      : inactiveLeads.filter((l) => l.segment === segmentFilter)

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleAll() {
    if (selected.size === filtered.length) setSelected(new Set())
    else setSelected(new Set(filtered.map((l) => l.id)))
  }

  const totalInactive = inactiveLeads.length

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h3 className="font-display text-lg font-bold tracking-tight">
            Matriz de Reativação
          </h3>
          <p className="text-sm text-muted-foreground">
            Leads inativos segmentados por RFM (Recência · Frequência · Valor).
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <History className="mr-1.5 size-3.5" />
            Histórico de reativações
          </Button>
        </div>
      </header>

      {/* Segment tiles */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <button
          onClick={() => setSegmentFilter("all")}
          aria-pressed={segmentFilter === "all"}
          className={cn(
            "group flex flex-col items-start gap-2 rounded-2xl border px-4 py-3 text-left transition-all",
            segmentFilter === "all"
              ? "border-primary/40 bg-primary/[0.04] shadow-sm shadow-primary/10"
              : "border-border/60 bg-card/50 hover:border-primary/20"
          )}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Todos
            </span>
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary border-primary/20 text-[10px]"
            >
              {totalInactive}
            </Badge>
          </div>
          <p className="font-display text-xl font-bold tracking-tight">
            {totalInactive}
          </p>
          <p className="text-[11px] text-muted-foreground">
            inativos 30d+
          </p>
        </button>

        {segments.map((s) => {
          const active = segmentFilter === s.id
          return (
            <button
              key={s.id}
              onClick={() => setSegmentFilter(s.id)}
              aria-pressed={active}
              className={cn(
                "group relative flex flex-col items-start gap-2 rounded-2xl border bg-gradient-to-br px-4 py-3 text-left transition-all",
                s.gradient,
                active ? "shadow-sm ring-1 ring-primary/30" : "hover:shadow-sm"
              )}
            >
              <div className="flex w-full items-center justify-between">
                <s.icon className={cn("size-4", s.tone)} />
                <Badge
                  variant="secondary"
                  className={cn("text-[10px]", s.tone)}
                >
                  {s.count}
                </Badge>
              </div>
              <div>
                <p className={cn("font-display text-sm font-bold", s.tone)}>
                  {s.label}
                </p>
                <p className="text-[11px] leading-tight text-muted-foreground">
                  {s.description}
                </p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Action bar + Cadence launcher */}
      <Card className="animate-card-in">
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={
                  filtered.length > 0 && selected.size === filtered.length
                }
                onChange={toggleAll}
                className="size-4 cursor-pointer rounded border-border accent-primary"
                aria-label="Selecionar todos"
              />
              <span className="text-[12px] font-medium">
                {selected.size === 0
                  ? "Selecionar todos"
                  : `${selected.size} selecionado(s)`}
              </span>
            </label>
            {selected.size > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelected(new Set())}
              >
                Limpar
              </Button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select value={selectedCadence} onValueChange={setSelectedCadence}>
              <SelectTrigger className="w-[220px]">
                <RefreshCw className="mr-1 size-3.5 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {cadenceOptions.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              size="sm"
              disabled={selected.size === 0}
              className="btn-lift bg-gradient-to-r from-primary to-orange-600 text-primary-foreground shadow-md shadow-primary/10"
            >
              <Sparkles className="mr-1.5 size-3.5" />
              Iniciar reativação ({selected.size})
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={selected.size === 0}
            >
              <Archive className="mr-1.5 size-3.5" />
              Arquivar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lead list */}
      <Card className="animate-card-in stagger-1 overflow-hidden p-0">
        <CardContent className="p-0 divide-y divide-border/60">
          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-muted/50">
                <Check className="size-5 text-muted-foreground/60" />
              </div>
              <p className="text-sm font-medium">Nenhum lead neste segmento</p>
              <p className="text-xs text-muted-foreground">
                Ajuste o filtro acima para ver outros segmentos.
              </p>
            </div>
          )}
          {filtered.map((lead) => {
            const seg = segments.find((s) => s.id === lead.segment)!
            const isSel = selected.has(lead.id)
            return (
              <label
                key={lead.id}
                className={cn(
                  "flex cursor-pointer items-center gap-4 p-4 transition-colors",
                  isSel ? "bg-primary/[0.03]" : "hover:bg-muted/20"
                )}
              >
                <input
                  type="checkbox"
                  checked={isSel}
                  onChange={() => toggle(lead.id)}
                  className="size-4 cursor-pointer rounded border-border accent-primary"
                  aria-label={`Selecionar ${lead.name}`}
                />

                <Avatar className="size-10 ring-1 ring-border/60">
                  <AvatarFallback className="bg-gradient-to-br from-muted to-muted/60 text-[11px] font-semibold text-muted-foreground">
                    {lead.initials}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-[13px] font-medium">
                      {lead.name}
                    </p>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "gap-1 text-[10px]",
                        valueTierTone[lead.valueTier]
                      )}
                    >
                      Valor {lead.valueTier}
                    </Badge>
                  </div>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {lead.company} · Último estágio: {lead.lastStage}
                  </p>
                </div>

                <div className="hidden min-w-[120px] text-right sm:block">
                  <p className="font-display text-[13px] font-bold tabular-nums">
                    {lead.daysSinceInteraction}d
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
                    sem contato
                  </p>
                </div>

                <Badge
                  variant="secondary"
                  className={cn("gap-1 text-[10px]", seg.tone)}
                >
                  <seg.icon className="size-2.5" />
                  {seg.label}
                </Badge>
              </label>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
