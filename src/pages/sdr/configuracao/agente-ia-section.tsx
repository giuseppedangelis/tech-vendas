import { useState } from "react"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Bot,
  Plus,
  Search,
  Sparkles,
  Flame,
  TestTube2,
  Edit3,
  Copy,
  Pause,
  Play,
  GitBranch,
  TrendingUp,
  Users,
  MoreVertical,
  Heart,
  Phone,
  ShoppingCart,
  Trophy,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { AgenteIaEditor } from "./agente-ia-editor"

export interface AgentSummary {
  id: string
  name: string
  objective: string
  tone: string
  model: string
  destinationFunnelId: string
  destinationFunnelLabel: string
  active: boolean
  instructions: string
  icon: typeof Bot
  accent: string
  metrics: {
    leadsProcessed: number
    handoffRate: number
    activeNow: number
    avgScore: number
  }
}

const initialAgents: AgentSummary[] = [
  {
    id: "ag1",
    name: "Ana Prospectora",
    objective:
      "Qualificar leads inbound B2B com foco em decisores de operações e vendas. Extrair BANT completo e agendar reunião com closer quando score ≥ 80.",
    tone: "consultivo",
    model: "anthropic/claude-sonnet-4-6",
    destinationFunnelId: "vendas-principal",
    destinationFunnelLabel: "Vendas Principal",
    active: true,
    instructions:
      "- Fale sempre em português do Brasil\n- Nunca prometa descontos sem validar com gestor\n- Se lead perguntar sobre preço, pivote para qualificação primeiro\n- Evite jargão técnico com contatos não-técnicos",
    icon: Phone,
    accent:
      "from-primary/15 to-orange-500/10 text-primary border-primary/20",
    metrics: {
      leadsProcessed: 1842,
      handoffRate: 38,
      activeNow: 64,
      avgScore: 72,
    },
  },
  {
    id: "ag2",
    name: "Roberto Recuperador",
    objective:
      "Reativar leads inativos há 30+ dias com abordagem consultiva e leve. Re-qualificar e devolver ao funil de vendas se houver fit.",
    tone: "casual",
    model: "anthropic/claude-haiku-4-5",
    destinationFunnelId: "reativacao",
    destinationFunnelLabel: "Reativação",
    active: true,
    instructions:
      "- Comece reconhecendo o tempo sem contato\n- Não pressione, ofereça valor primeiro\n- Se lead disser 'agora não', pergunte quando faz sentido retomar",
    icon: Heart,
    accent:
      "from-sky-500/15 to-sky-500/5 text-sky-700 dark:text-sky-400 border-sky-500/20",
    metrics: {
      leadsProcessed: 612,
      handoffRate: 22,
      activeNow: 41,
      avgScore: 54,
    },
  },
  {
    id: "ag3",
    name: "Sofia Pré-Vendas",
    objective:
      "Qualificação avançada de contas enterprise (500+ funcionários). Investigar stakeholders, processo de compra e timeline com profundidade antes do handoff.",
    tone: "formal",
    model: "anthropic/claude-opus-4-7",
    destinationFunnelId: "vendas-enterprise",
    destinationFunnelLabel: "Vendas Enterprise",
    active: true,
    instructions:
      "- Use linguagem corporativa, evite informalidade\n- Investigue múltiplos decisores\n- Capture objeções estratégicas, não só operacionais\n- Sempre confirme nome e cargo do interlocutor",
    icon: Trophy,
    accent:
      "from-violet-500/15 to-violet-500/5 text-violet-700 dark:text-violet-400 border-violet-500/20",
    metrics: {
      leadsProcessed: 184,
      handoffRate: 52,
      activeNow: 18,
      avgScore: 81,
    },
  },
  {
    id: "ag4",
    name: "Bruno Carrinho",
    objective:
      "Recuperar leads de carrinho abandonado de e-commerce em até 30 minutos. Identificar objeção de compra e oferecer suporte ou condição especial autorizada.",
    tone: "direto",
    model: "openai/gpt-4o",
    destinationFunnelId: "ecommerce",
    destinationFunnelLabel: "E-commerce / Carrinho",
    active: false,
    instructions:
      "- Velocidade > educação na primeira mensagem\n- Pergunte sobre dúvida ou hesitação direto\n- Pode oferecer cupom autorizado se lead mencionar preço",
    icon: ShoppingCart,
    accent:
      "from-amber-500/15 to-amber-500/5 text-amber-700 dark:text-amber-400 border-amber-500/20",
    metrics: {
      leadsProcessed: 0,
      handoffRate: 0,
      activeNow: 0,
      avgScore: 0,
    },
  },
]

export function AgenteIaSection() {
  const [agents, setAgents] = useState(initialAgents)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  function toggleActive(id: string) {
    setAgents((prev) =>
      prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
    )
  }

  function deleteAgent(id: string) {
    setAgents((prev) => prev.filter((a) => a.id !== id))
    setEditingId(null)
  }

  const editingAgent = editingId
    ? agents.find((a) => a.id === editingId)
    : null

  if (editingAgent) {
    return (
      <AgenteIaEditor
        agent={editingAgent}
        onBack={() => setEditingId(null)}
        onDelete={deleteAgent}
      />
    )
  }

  const filtered = search
    ? agents.filter(
        (a) =>
          a.name.toLowerCase().includes(search.toLowerCase()) ||
          a.objective.toLowerCase().includes(search.toLowerCase())
      )
    : agents

  const activeCount = agents.filter((a) => a.active).length
  const totalActiveLeads = agents.reduce(
    (acc, a) => acc + a.metrics.activeNow,
    0
  )
  const avgHandoff = Math.round(
    agents
      .filter((a) => a.metrics.leadsProcessed > 0)
      .reduce((acc, a, _, arr) => acc + a.metrics.handoffRate / arr.length, 0)
  )

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h3 className="font-display text-lg font-bold tracking-tight">
            Agentes IA SDR
          </h3>
          <p className="text-sm text-muted-foreground">
            Cada agente atua sobre um funil específico — prospecção, reativação,
            enterprise, recuperação de carrinho.
          </p>
        </div>
        <Button className="btn-lift bg-gradient-to-r from-primary to-orange-600 text-primary-foreground shadow-md shadow-primary/10">
          <Plus className="mr-1.5 size-4" />
          Novo agente
        </Button>
      </header>

      {/* Summary tiles */}
      <div className="grid gap-3 sm:grid-cols-3">
        <SummaryTile
          icon={Bot}
          label="Agentes ativos"
          value={`${activeCount}/${agents.length}`}
        />
        <SummaryTile
          icon={Users}
          label="Leads em atendimento"
          value={totalActiveLeads.toString()}
          hint="agora mesmo"
        />
        <SummaryTile
          icon={TrendingUp}
          label="Handoff médio"
          value={`${avgHandoff}%`}
          hint="entre agentes ativos"
        />
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/50" />
        <Input
          placeholder="Buscar por nome ou objetivo…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
          aria-label="Buscar agente"
        />
      </div>

      {/* Agent grid */}
      <div className="grid gap-3 lg:grid-cols-2">
        {filtered.map((agent, i) => (
          <Card
            key={agent.id}
            className={cn(
              "animate-card-in card-hover overflow-hidden",
              `stagger-${Math.min(i + 1, 6)}`,
              !agent.active && "opacity-75"
            )}
          >
            <CardContent className="p-0">
              {/* Top accent strip */}
              <div
                className={cn(
                  "flex items-center justify-between bg-gradient-to-r px-5 py-3 border-b",
                  agent.accent
                )}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-lg bg-card/60 backdrop-blur-sm"
                    )}
                  >
                    <agent.icon className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="truncate font-display text-[14px] font-semibold tracking-tight">
                        {agent.name}
                      </h4>
                      {agent.active ? (
                        <span
                          className="size-1.5 rounded-full bg-emerald-500 pulse-online"
                          aria-label="Ativo"
                        />
                      ) : (
                        <Pause
                          className="size-3 text-muted-foreground"
                          aria-label="Pausado"
                        />
                      )}
                    </div>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <GitBranch className="size-2.5 opacity-60" />
                      <span className="text-[10px] font-medium opacity-80">
                        → {agent.destinationFunnelLabel}
                      </span>
                    </div>
                  </div>
                </div>
                <div onClick={(e) => e.stopPropagation()} role="presentation">
                  <Switch
                    checked={agent.active}
                    onCheckedChange={() => toggleActive(agent.id)}
                    aria-label={
                      agent.active
                        ? `Pausar ${agent.name}`
                        : `Ativar ${agent.name}`
                    }
                  />
                </div>
              </div>

              {/* Body */}
              <div className="space-y-4 p-5">
                <p className="line-clamp-2 text-[12px] leading-relaxed text-muted-foreground">
                  {agent.objective}
                </p>

                {/* Metrics */}
                {agent.metrics.leadsProcessed > 0 ? (
                  <div className="grid grid-cols-4 gap-3 rounded-xl bg-muted/30 p-3">
                    <Metric
                      label="Processados"
                      value={agent.metrics.leadsProcessed.toLocaleString(
                        "pt-BR"
                      )}
                    />
                    <Metric
                      label="Atendendo"
                      value={agent.metrics.activeNow.toString()}
                      tone={agent.metrics.activeNow > 0 ? "good" : undefined}
                    />
                    <Metric
                      label="Handoff"
                      value={`${agent.metrics.handoffRate}%`}
                      tone={
                        agent.metrics.handoffRate >= 30 ? "good" : "warn"
                      }
                    />
                    <Metric
                      label="Score médio"
                      value={agent.metrics.avgScore.toString()}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/20 px-3 py-4">
                    <span className="text-[11px] text-muted-foreground italic">
                      Agente nunca executado em produção
                    </span>
                  </div>
                )}

                {/* Tech badges */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge variant="secondary" className="text-[10px]">
                    <Sparkles className="mr-1 size-2.5" />
                    {agent.model.split("/")[1]}
                  </Badge>
                  <Badge variant="secondary" className="text-[10px]">
                    {toneLabel(agent.tone)}
                  </Badge>
                </div>

                <Separator />

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setEditingId(agent.id)}
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-primary to-orange-600 text-primary-foreground"
                  >
                    <Edit3 className="mr-1.5 size-3.5" />
                    Editar
                  </Button>
                  <Button
                    onClick={() => setEditingId(agent.id)}
                    size="sm"
                    variant="outline"
                  >
                    <TestTube2 className="mr-1.5 size-3.5" />
                    Sandbox
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Duplicar"
                    className="size-9"
                  >
                    <Copy className="size-3.5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Mais ações"
                    className="size-9"
                  >
                    <MoreVertical className="size-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Empty / new agent card */}
        <button
          onClick={() => {
            // Placeholder: in real flow would create a draft agent
          }}
          className="group flex min-h-[260px] flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border/60 bg-card/30 p-6 text-center transition-all hover:border-primary/40 hover:bg-primary/[0.02]"
        >
          <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-orange-500/10 text-primary transition-transform group-hover:scale-110">
            <Plus className="size-6" />
          </div>
          <div>
            <p className="font-display text-sm font-semibold">
              Criar novo agente
            </p>
            <p className="text-[11px] text-muted-foreground">
              Para um novo funil ou caso de uso
            </p>
          </div>
        </button>
      </div>

      {filtered.length === 0 && search && (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-muted/50">
              <Search className="size-5 text-muted-foreground/60" />
            </div>
            <p className="text-sm font-medium">Nenhum agente encontrado</p>
            <p className="text-xs text-muted-foreground">
              Tente outro termo de busca.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Footer help */}
      <div className="flex items-start gap-2 rounded-xl bg-primary/[0.04] border border-primary/10 px-3.5 py-2.5">
        <Flame className="mt-0.5 size-4 shrink-0 text-primary" />
        <p className="flex-1 text-[12px] leading-relaxed text-muted-foreground">
          <span className="font-medium text-foreground/80">Boas práticas:</span>{" "}
          mantenha agentes especializados por funil — um agente para
          prospecção, outro para reativação, outro para enterprise. Isso
          permite iterar prompts sem afetar todos os fluxos ao mesmo tempo.
        </p>
      </div>
    </div>
  )
}

function toneLabel(tone: string) {
  const map: Record<string, string> = {
    formal: "Formal",
    consultivo: "Consultivo",
    casual: "Casual",
    direto: "Direto",
  }
  return map[tone] ?? tone
}

function SummaryTile({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Bot
  label: string
  value: string
  hint?: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/50 px-4 py-3 backdrop-blur-sm">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-orange-500/10">
        <Icon className="size-4 text-primary" />
      </div>
      <div>
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
          {label}
        </p>
        <p className="font-display text-lg font-bold tracking-tight tabular-nums">
          {value}
        </p>
        {hint && (
          <p className="text-[10px] text-muted-foreground/60">{hint}</p>
        )}
      </div>
    </div>
  )
}

function Metric({
  label,
  value,
  tone,
}: {
  label: string
  value: string
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
      <p className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground/70">
        {label}
      </p>
      <p
        className={cn(
          "font-display text-[13px] font-bold tracking-tight tabular-nums",
          toneCls
        )}
      >
        {value}
      </p>
    </div>
  )
}

// Re-export Play icon to avoid unused import lint when toggling
export { Play }
