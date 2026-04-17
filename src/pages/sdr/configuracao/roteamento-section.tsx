import { useState } from "react"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Plus,
  Route,
  Shuffle,
  BarChart2,
  Package,
  MapPin,
  Check,
  GripVertical,
  Trash2,
  Edit3,
  AlertTriangle,
  Users,
  Zap,
  UserX,
  Bot,
} from "lucide-react"
import { cn } from "@/lib/utils"

type Strategy = "round_robin" | "by_load" | "by_product" | "by_territory"

const strategyOptions: {
  id: Strategy
  label: string
  icon: typeof Shuffle
  description: string
}[] = [
  {
    id: "round_robin",
    label: "Round-robin",
    icon: Shuffle,
    description: "Distribuição sequencial e equilibrada entre agentes ativos.",
  },
  {
    id: "by_load",
    label: "Por carga",
    icon: BarChart2,
    description: "Novo lead vai sempre para o agente com menor carga no momento.",
  },
  {
    id: "by_product",
    label: "Por produto",
    icon: Package,
    description: "Agentes especializados em produtos específicos recebem leads compatíveis.",
  },
  {
    id: "by_territory",
    label: "Por território",
    icon: MapPin,
    description: "Distribuição baseada em estado, cidade ou segmento do lead.",
  },
]

interface Rule {
  id: string
  order: number
  name: string
  condition: string
  targetType: "agent_group" | "single_agent" | "fallback_queue"
  targetLabel: string
  assignees: Array<{ name: string; initials: string }>
  active: boolean
}

const initialRules: Rule[] = [
  {
    id: "r1",
    order: 1,
    name: "Leads enterprise",
    condition: "Empresa com 500+ funcionários",
    targetType: "single_agent",
    targetLabel: "Sofia Pré-Vendas",
    assignees: [{ name: "Sofia Pré-Vendas", initials: "SP" }],
    active: true,
  },
  {
    id: "r2",
    order: 2,
    name: "Reativações",
    condition: "Lead originado de cadência de reativação",
    targetType: "single_agent",
    targetLabel: "Roberto Recuperador",
    assignees: [{ name: "Roberto Recuperador", initials: "RR" }],
    active: true,
  },
  {
    id: "r3",
    order: 3,
    name: "Carrinho abandonado",
    condition: "Webhook de carrinho/checkout não-finalizado",
    targetType: "single_agent",
    targetLabel: "Bruno Carrinho",
    assignees: [{ name: "Bruno Carrinho", initials: "BC" }],
    active: false,
  },
  {
    id: "r4",
    order: 4,
    name: "Padrão",
    condition: "Qualquer outro lead que chegar",
    targetType: "single_agent",
    targetLabel: "Ana Prospectora",
    assignees: [{ name: "Ana Prospectora", initials: "AP" }],
    active: true,
  },
]

const targetTypeMeta: Record<
  Rule["targetType"],
  { label: string; tone: string }
> = {
  single_agent: {
    label: "Agente específico",
    tone: "bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/20",
  },
  agent_group: {
    label: "Grupo de agentes",
    tone: "bg-primary/10 text-primary border-primary/20",
  },
  fallback_queue: {
    label: "Fila fallback",
    tone: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
  },
}

export function RoteamentoSection() {
  const [strategy, setStrategy] = useState<Strategy>("by_load")
  const [rules, setRules] = useState(initialRules)
  const [overflowAction, setOverflowAction] = useState("queue")
  const [failoverEnabled, setFailoverEnabled] = useState(true)
  const [autoReassignAfterHours, setAutoReassignAfterHours] = useState(4)

  function toggleRule(id: string) {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r))
    )
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h3 className="font-display text-lg font-bold tracking-tight">
            Roteamento de Leads
          </h3>
          <p className="text-sm text-muted-foreground">
            Defina como novos leads são distribuídos entre os agentes IA SDR.
          </p>
        </div>
        <Button className="btn-lift bg-gradient-to-r from-primary to-orange-600 text-primary-foreground shadow-md shadow-primary/10">
          Salvar roteamento
        </Button>
      </header>

      {/* Strategy selection */}
      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
          Estratégia principal de distribuição
        </p>
        <div
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
          role="radiogroup"
          aria-label="Estratégia de roteamento"
        >
          {strategyOptions.map((s) => {
            const active = strategy === s.id
            return (
              <button
                key={s.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setStrategy(s.id)}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border px-4 py-3.5 text-left transition-all",
                  active
                    ? "border-primary/40 bg-primary/[0.04] shadow-sm shadow-primary/10"
                    : "border-border/60 bg-card/50 hover:border-primary/20 hover:bg-card"
                )}
              >
                {active && (
                  <div
                    className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary to-orange-500"
                    aria-hidden
                  />
                )}
                <div className="flex items-center justify-between">
                  <div
                    className={cn(
                      "flex size-9 items-center justify-center rounded-lg",
                      active
                        ? "bg-gradient-to-br from-primary to-orange-600 text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                    aria-hidden
                  >
                    <s.icon className="size-4" />
                  </div>
                  {active && <Check className="size-4 text-primary" />}
                </div>
                <p
                  className={cn(
                    "mt-3 font-display text-sm font-semibold tracking-tight",
                    active && "text-primary"
                  )}
                >
                  {s.label}
                </p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                  {s.description}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Rules */}
      <Card className="animate-card-in">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Route className="size-4" />
              </div>
              <div>
                <p className="font-display text-sm font-semibold tracking-tight">
                  Regras de roteamento
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Avaliadas em ordem · primeira regra que casar é aplicada.
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Plus className="mr-1.5 size-3.5" />
              Nova regra
            </Button>
          </div>

          <ol className="space-y-2">
            {rules.map((rule) => {
              const meta = targetTypeMeta[rule.targetType]
              return (
                <li
                  key={rule.id}
                  className={cn(
                    "group flex gap-3 rounded-xl border border-border/60 bg-card/60 p-3.5 transition-all hover:border-primary/20",
                    !rule.active && "opacity-60"
                  )}
                >
                  <div className="flex shrink-0 flex-col items-center gap-2 pt-0.5">
                    <button
                      type="button"
                      aria-label="Arrastar para reordenar"
                      className="cursor-grab text-muted-foreground/40 transition-colors hover:text-muted-foreground"
                    >
                      <GripVertical className="size-4" />
                    </button>
                    <div className="flex size-6 items-center justify-center rounded-full bg-muted font-display text-[11px] font-bold text-muted-foreground">
                      {rule.order}
                    </div>
                  </div>

                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[13px] font-medium">
                        {rule.name}
                      </span>
                      <Badge
                        variant="secondary"
                        className={cn("text-[10px]", meta.tone)}
                      >
                        {meta.label}
                      </Badge>
                    </div>
                    <p className="text-[12px] text-muted-foreground">
                      <span className="font-medium text-foreground/70">
                        Se
                      </span>{" "}
                      {rule.condition}{" "}
                      <span className="font-medium text-foreground/70">
                        →
                      </span>{" "}
                      {rule.targetLabel}
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5">
                      {rule.assignees.slice(0, 4).map((a, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 rounded-md border border-primary/20 bg-primary/[0.06] px-1.5 py-0.5 text-[10px] font-medium text-primary"
                          title={`Agente IA: ${a.name}`}
                        >
                          <Bot className="size-2.5" />
                          {a.name}
                        </span>
                      ))}
                      {rule.assignees.length > 4 && (
                        <span className="text-[11px] text-muted-foreground">
                          +{rule.assignees.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-1 self-start">
                    <div onClick={(e) => e.stopPropagation()} role="presentation">
                      <Switch
                        checked={rule.active}
                        onCheckedChange={() => toggleRule(rule.id)}
                        aria-label={
                          rule.active
                            ? `Desativar ${rule.name}`
                            : `Ativar ${rule.name}`
                        }
                      />
                    </div>
                    <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        aria-label="Editar regra"
                      >
                        <Edit3 className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 hover:text-destructive"
                        aria-label="Remover regra"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                </li>
              )
            })}
          </ol>
        </CardContent>
      </Card>

      {/* Overflow + Failover */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="animate-card-in stagger-1">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Users className="size-4" />
              </div>
              <div>
                <p className="font-display text-sm font-semibold tracking-tight">
                  Overflow — todos os agentes na capacidade
                </p>
                <p className="text-[11px] text-muted-foreground">
                  O que fazer quando nenhum agente tem espaço disponível.
                </p>
              </div>
            </div>

            <div
              className="space-y-2"
              role="radiogroup"
              aria-label="Ação de overflow"
            >
              {[
                {
                  id: "queue",
                  label: "Enfileirar e avisar o gestor",
                  hint: "Lead aguarda e gestor recebe notificação.",
                  icon: AlertTriangle,
                },
                {
                  id: "queue_only",
                  label: "Apenas enfileirar e esperar",
                  hint: "Lead aguarda em fila até abrir capacidade num agente.",
                  icon: Zap,
                },
                {
                  id: "assign_anyway",
                  label: "Atribuir mesmo assim (ignorar capacidade)",
                  hint: "Agente com menor carga recebe acima do limite configurado.",
                  icon: Shuffle,
                },
              ].map((opt) => {
                const active = overflowAction === opt.id
                return (
                  <button
                    key={opt.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setOverflowAction(opt.id)}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-xl border px-3 py-2.5 text-left transition-all",
                      active
                        ? "border-primary/40 bg-primary/[0.04]"
                        : "border-border/60 bg-card/50 hover:border-primary/20"
                    )}
                  >
                    <div
                      className={cn(
                        "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border",
                        active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border"
                      )}
                      aria-hidden
                    >
                      {active && <Check className="size-3" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-medium">{opt.label}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {opt.hint}
                      </p>
                    </div>
                    <opt.icon className="mt-0.5 size-4 shrink-0 text-muted-foreground/70" />
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="animate-card-in stagger-2">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <UserX className="size-4" />
                </div>
                <div>
                  <p className="font-display text-sm font-semibold tracking-tight">
                    Failover automático
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Reatribui leads quando agente fica indisponível ou em erro.
                  </p>
                </div>
              </div>
              <Switch
                checked={failoverEnabled}
                onCheckedChange={setFailoverEnabled}
                aria-label="Ativar failover"
              />
            </div>

            <div
              className={cn(
                "space-y-3 rounded-xl bg-muted/30 p-3.5 transition-opacity",
                !failoverEnabled && "pointer-events-none opacity-50"
              )}
            >
              <Label className="flex items-center justify-between">
                <span className="text-[13px]">
                  Reatribuir após sem resposta por
                </span>
                <Badge
                  variant="secondary"
                  className="font-display font-bold"
                >
                  {autoReassignAfterHours}h
                </Badge>
              </Label>
              <input
                type="range"
                min={1}
                max={24}
                step={1}
                value={autoReassignAfterHours}
                onChange={(e) =>
                  setAutoReassignAfterHours(Number(e.target.value))
                }
                disabled={!failoverEnabled}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary"
                aria-label="Horas até reatribuição"
              />
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="failover-target" className="text-[12px]">
                  Destino padrão para reatribuição
                </Label>
                <Select defaultValue="least_load">
                  <SelectTrigger id="failover-target">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="least_load">
                      Agente com menor carga
                    </SelectItem>
                    <SelectItem value="same_group">
                      Outro agente compatível com o funil
                    </SelectItem>
                    <SelectItem value="manager_queue">
                      Fila do gestor para revisão
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
