import { useState, useMemo } from "react"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Search,
  Filter,
  MoreHorizontal,
  ArrowRight,
  MessageSquare,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"

type Stage = "new" | "contacting" | "qualifying" | "ready" | "disqualified"

interface Lead {
  id: string
  name: string
  company: string
  initials: string
  score: number
  scoreDelta: number
  stage: Stage
  agent: { name: string; initials: string }
  cadence: string
  stepOf: string
  daysInStage: number
  lastInteraction: string
  bantProgress: number
}

const stageMeta: Record<Stage, { label: string; tone: string; order: number }> = {
  new: {
    label: "Novo",
    tone: "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20",
    order: 1,
  },
  contacting: {
    label: "Em Contato",
    tone: "bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/20",
    order: 2,
  },
  qualifying: {
    label: "Qualificando",
    tone: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
    order: 3,
  },
  ready: {
    label: "Pronto p/ Handoff",
    tone: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
    order: 4,
  },
  disqualified: {
    label: "Desqualificado",
    tone: "bg-muted text-muted-foreground border-border",
    order: 5,
  },
}

const leads: Lead[] = [
  {
    id: "l1",
    name: "Marcos Andrade",
    company: "Logibras Transportes",
    initials: "MA",
    score: 92,
    scoreDelta: 6,
    stage: "ready",
    agent: { name: "Ana Prospectora", initials: "AP" },
    cadence: "Prospecção B2B Inicial",
    stepOf: "4/4",
    daysInStage: 0,
    lastInteraction: "há 12 min",
    bantProgress: 100,
  },
  {
    id: "l2",
    name: "Fernanda Castro",
    company: "Nexa Digital",
    initials: "FC",
    score: 88,
    scoreDelta: 4,
    stage: "ready",
    agent: { name: "Ana Prospectora", initials: "AP" },
    cadence: "Prospecção B2B Inicial",
    stepOf: "3/4",
    daysInStage: 1,
    lastInteraction: "há 38 min",
    bantProgress: 100,
  },
  {
    id: "l3",
    name: "Renato Oliveira",
    company: "Hub Varejo",
    initials: "RO",
    score: 84,
    scoreDelta: 2,
    stage: "qualifying",
    agent: { name: "Ana Prospectora", initials: "AP" },
    cadence: "Prospecção B2B Inicial",
    stepOf: "3/4",
    daysInStage: 2,
    lastInteraction: "há 2h",
    bantProgress: 75,
  },
  {
    id: "l4",
    name: "Camila Dias",
    company: "Prático Contábil",
    initials: "CD",
    score: 72,
    scoreDelta: -3,
    stage: "qualifying",
    agent: { name: "Sofia Pré-Vendas", initials: "SP" },
    cadence: "Qualificação Enterprise",
    stepOf: "2/4",
    daysInStage: 3,
    lastInteraction: "há 4h",
    bantProgress: 50,
  },
  {
    id: "l5",
    name: "Bruno Tavares",
    company: "Clínica Vita",
    initials: "BT",
    score: 66,
    scoreDelta: 0,
    stage: "contacting",
    agent: { name: "Ana Prospectora", initials: "AP" },
    cadence: "Prospecção B2B Inicial",
    stepOf: "2/4",
    daysInStage: 1,
    lastInteraction: "há 5h",
    bantProgress: 25,
  },
  {
    id: "l6",
    name: "Patrícia Lemos",
    company: "Edtech Forma",
    initials: "PL",
    score: 58,
    scoreDelta: -5,
    stage: "contacting",
    agent: { name: "Roberto Recuperador", initials: "RR" },
    cadence: "Reativação 30 dias",
    stepOf: "1/5",
    daysInStage: 2,
    lastInteraction: "há 1d",
    bantProgress: 0,
  },
  {
    id: "l7",
    name: "Ricardo Monteiro",
    company: "Construtora Arco",
    initials: "RM",
    score: 48,
    scoreDelta: -2,
    stage: "contacting",
    agent: { name: "Sofia Pré-Vendas", initials: "SP" },
    cadence: "Qualificação Enterprise",
    stepOf: "1/5",
    daysInStage: 3,
    lastInteraction: "há 2d",
    bantProgress: 0,
  },
  {
    id: "l8",
    name: "Amanda Rezende",
    company: "Startup HealthOne",
    initials: "AR",
    score: 45,
    scoreDelta: 8,
    stage: "new",
    agent: { name: "Ana Prospectora", initials: "AP" },
    cadence: "Prospecção B2B Inicial",
    stepOf: "0/4",
    daysInStage: 0,
    lastInteraction: "agora",
    bantProgress: 0,
  },
  {
    id: "l9",
    name: "Thiago Ferraz",
    company: "Agro Nordeste",
    initials: "TF",
    score: 32,
    scoreDelta: -8,
    stage: "qualifying",
    agent: { name: "Roberto Recuperador", initials: "RR" },
    cadence: "Reativação 30 dias",
    stepOf: "3/4",
    daysInStage: 5,
    lastInteraction: "há 3d",
    bantProgress: 25,
  },
]

const stageFilterOrder: Array<{ id: "all" | Stage; label: string }> = [
  { id: "all", label: "Todas" },
  { id: "new", label: "Novas" },
  { id: "contacting", label: "Em contato" },
  { id: "qualifying", label: "Qualificando" },
  { id: "ready", label: "Prontas" },
]

function scoreTone(score: number) {
  if (score >= 80) return "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20"
  if (score >= 60) return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
  if (score >= 40) return "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20"
  return "bg-muted text-muted-foreground border-border"
}

export function LeadsSection() {
  const [stageFilter, setStageFilter] = useState<"all" | Stage>("all")
  const [search, setSearch] = useState("")
  const [agentFilter, setAgentFilter] = useState<string>("all")

  const agents = useMemo(() => {
    const map = new Map<string, string>()
    leads.forEach((l) => map.set(l.agent.name, l.agent.initials))
    return Array.from(map.entries()).map(([name, initials]) => ({
      name,
      initials,
    }))
  }, [])

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      if (stageFilter !== "all" && l.stage !== stageFilter) return false
      if (agentFilter !== "all" && l.agent.name !== agentFilter) return false
      if (
        search &&
        !l.name.toLowerCase().includes(search.toLowerCase()) &&
        !l.company.toLowerCase().includes(search.toLowerCase())
      )
        return false
      return true
    })
  }, [stageFilter, agentFilter, search])

  const counts = useMemo(() => {
    const c: Record<"all" | Stage, number> = {
      all: leads.length,
      new: 0,
      contacting: 0,
      qualifying: 0,
      ready: 0,
      disqualified: 0,
    }
    leads.forEach((l) => (c[l.stage] = (c[l.stage] ?? 0) + 1))
    return c
  }, [])

  return (
    <div className="space-y-5">
      {/* Section header */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h3 className="font-display text-lg font-bold tracking-tight">
            Leads em Qualificação
          </h3>
          <p className="text-sm text-muted-foreground">
            {filtered.length} de {leads.length} leads ativos na operação SDR.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-1.5 size-3.5" />
            Filtros avançados
          </Button>
          <Button
            size="sm"
            className="btn-lift bg-gradient-to-r from-primary to-orange-600 text-primary-foreground shadow-md shadow-primary/10"
          >
            Exportar CSV
          </Button>
        </div>
      </header>

      {/* Stage pills */}
      <div className="flex flex-wrap items-center gap-2">
        {stageFilterOrder.map((f) => {
          const active = stageFilter === f.id
          const count = counts[f.id]
          return (
            <button
              key={f.id}
              onClick={() => setStageFilter(f.id)}
              aria-pressed={active}
              className={cn(
                "group inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-all",
                active
                  ? "border-primary/40 bg-primary/[0.06] text-primary shadow-sm shadow-primary/10"
                  : "border-border/60 bg-card/50 text-muted-foreground hover:border-primary/20 hover:text-foreground"
              )}
            >
              {f.label}
              <span
                className={cn(
                  "inline-flex min-w-[18px] items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums",
                  active
                    ? "bg-primary/15 text-primary"
                    : "bg-muted text-muted-foreground/80"
                )}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Search + Agent filter */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/50" />
          <Input
            placeholder="Buscar por nome ou empresa…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            aria-label="Buscar leads"
          />
        </div>
        <Select value={agentFilter} onValueChange={setAgentFilter}>
          <SelectTrigger className="sm:w-[220px]">
            <Users className="mr-1 size-3.5 text-muted-foreground" />
            <SelectValue placeholder="Todos os agentes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os agentes</SelectItem>
            {agents.map((a) => (
              <SelectItem key={a.name} value={a.name}>
                {a.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card className="animate-card-in overflow-hidden p-0">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/60">
                  <TableHead className="w-[32%]">Lead</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Estágio</TableHead>
                  <TableHead>BANT</TableHead>
                  <TableHead>Agente</TableHead>
                  <TableHead>Cadência · Step</TableHead>
                  <TableHead>Última interação</TableHead>
                  <TableHead className="w-10" aria-label="Ações" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((l) => {
                  const TrendIcon =
                    l.scoreDelta > 0
                      ? TrendingUp
                      : l.scoreDelta < 0
                        ? TrendingDown
                        : Minus
                  const trendColor =
                    l.scoreDelta > 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : l.scoreDelta < 0
                        ? "text-rose-600 dark:text-rose-400"
                        : "text-muted-foreground"
                  return (
                    <TableRow key={l.id} className="group cursor-pointer">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8 ring-1 ring-border/60">
                            <AvatarFallback className="bg-gradient-to-br from-muted to-muted/60 text-[10px] font-semibold text-muted-foreground">
                              {l.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="truncate text-[13px] font-medium">
                              {l.name}
                            </p>
                            <p className="truncate text-[11px] text-muted-foreground">
                              {l.company}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "inline-flex h-8 min-w-[40px] items-center justify-center rounded-md border px-2 font-display text-[13px] font-bold tabular-nums",
                              scoreTone(l.score)
                            )}
                          >
                            {l.score}
                          </div>
                          <div
                            className={cn(
                              "flex items-center gap-0.5 text-[10px] font-medium",
                              trendColor
                            )}
                          >
                            <TrendIcon className="size-3" />
                            {l.scoreDelta > 0 ? "+" : ""}
                            {l.scoreDelta !== 0 ? l.scoreDelta : "—"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={cn("text-[10px]", stageMeta[l.stage].tone)}
                        >
                          {stageMeta[l.stage].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="relative h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                            <div
                              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-orange-500"
                              style={{ width: `${l.bantProgress}%` }}
                              aria-hidden
                            />
                          </div>
                          <span className="font-display text-[11px] font-bold tabular-nums">
                            {l.bantProgress}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className="flex size-6 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-orange-500/20 text-[9px] font-bold text-primary ring-1 ring-primary/20"
                            aria-label={`Agente IA: ${l.agent.name}`}
                          >
                            {l.agent.initials}
                          </div>
                          <span className="text-[12px] text-muted-foreground">
                            {l.agent.name.split(" ")[0]}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-0.5">
                          <p className="truncate text-[12px]">{l.cadence}</p>
                          <p className="text-[10px] text-muted-foreground">
                            Step {l.stepOf}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1 text-[12px] text-muted-foreground">
                          <Clock className="size-3" />
                          {l.lastInteraction}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                            aria-label="Ver conversa"
                          >
                            <MessageSquare className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                            aria-label="Mais ações"
                          >
                            <MoreHorizontal className="size-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="py-16 text-center">
                      <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-muted/50">
                        <Search className="size-5 text-muted-foreground/60" />
                      </div>
                      <p className="text-sm font-medium">
                        Nenhum lead com esses filtros
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Tente remover algum filtro ou ampliar a busca.
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* AI tip */}
      <div className="flex items-start gap-2 rounded-xl bg-primary/[0.04] border border-primary/10 px-3.5 py-2.5">
        <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
        <div className="flex-1 text-[12px] leading-relaxed text-muted-foreground">
          <span className="font-medium text-foreground/80">
            Dica da IA Gestora:
          </span>{" "}
          Thiago Ferraz (score 32, caindo) está há 5 dias com o agente Roberto
          Recuperador sem avanço. Considere desqualificar ou trocar para uma
          cadência mais direta.
        </div>
        <Button variant="ghost" size="sm" className="shrink-0">
          Ver lead
          <ArrowRight className="ml-1 size-3.5" />
        </Button>
      </div>
    </div>
  )
}
