import { useState } from "react"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  GitBranch,
  Plus,
  MessageSquare,
  Webhook,
  Globe,
  ShoppingCart,
  Camera,
  Gauge,
  Route,
  Bot,
  Flame,
  CheckCircle2,
  Settings2,
  Copy,
  Eye,
  Pause,
  Play,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ArrowRight,
  Sparkles,
  Phone,
  Heart,
  Trophy,
} from "lucide-react"
import { cn } from "@/lib/utils"

type NodeType = "trigger" | "score" | "router" | "agent" | "handoff"

interface FlowNode {
  id: string
  type: NodeType
  title: string
  subtitle?: string
  icon: typeof MessageSquare
  accent: string
  branchLabel?: string
  configHint?: string
}

interface Flow {
  id: string
  name: string
  description: string
  active: boolean
  triggerLabel: string
  metrics: { leadsToday: number; conversionPct: number }
  // 5 colunas: trigger → score → router → agent(s) → handoff(s)
  columns: FlowNode[][]
}

const flows: Flow[] = [
  {
    id: "fl1",
    name: "Inbound WhatsApp B2B",
    description: "Lead chega via WhatsApp, é classificado e roteado para agente especializado.",
    active: true,
    triggerLabel: "WhatsApp",
    metrics: { leadsToday: 38, conversionPct: 32 },
    columns: [
      [
        {
          id: "t1",
          type: "trigger",
          title: "WhatsApp",
          subtitle: "Mensagem nova recebida",
          icon: MessageSquare,
          accent:
            "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
          configHint: "2 números conectados",
        },
      ],
      [
        {
          id: "s1",
          type: "score",
          title: "Score Inicial",
          subtitle: "Calcular Valor + Engajamento",
          icon: Gauge,
          accent:
            "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/30",
          configHint: "Modelo padrão",
        },
      ],
      [
        {
          id: "r1",
          type: "router",
          title: "Roteamento",
          subtitle: "Por segmento + tamanho",
          icon: Route,
          accent:
            "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30",
          configHint: "3 regras ativas",
        },
      ],
      [
        {
          id: "a1",
          type: "agent",
          title: "Sofia Pré-Vendas",
          subtitle: "Enterprise (500+ funcionários)",
          icon: Trophy,
          accent:
            "bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/30",
          branchLabel: "Se enterprise",
        },
        {
          id: "a2",
          type: "agent",
          title: "Ana Prospectora",
          subtitle: "B2B padrão",
          icon: Phone,
          accent: "bg-primary/10 text-primary border-primary/30",
          branchLabel: "Se PME",
        },
      ],
      [
        {
          id: "h1",
          type: "handoff",
          title: "Vendas Enterprise",
          subtitle: "Closer responsável: Pedro",
          icon: Flame,
          accent:
            "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30",
        },
        {
          id: "h2",
          type: "handoff",
          title: "Vendas Principal",
          subtitle: "Distribuição round-robin",
          icon: Flame,
          accent:
            "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30",
        },
      ],
    ],
  },
  {
    id: "fl2",
    name: "Hotmart · Compra realizada",
    description: "Webhook de compra dispara onboarding via agente IA específico.",
    active: true,
    triggerLabel: "Hotmart Webhook",
    metrics: { leadsToday: 12, conversionPct: 88 },
    columns: [
      [
        {
          id: "t2",
          type: "trigger",
          title: "Hotmart",
          subtitle: "Webhook PURCHASE_APPROVED",
          icon: Webhook,
          accent:
            "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
          configHint: "1 produto monitorado",
        },
      ],
      [
        {
          id: "s2",
          type: "score",
          title: "Score Inicial",
          subtitle: "Cliente confirmado: +50 base",
          icon: Gauge,
          accent:
            "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/30",
        },
      ],
      [
        {
          id: "r2",
          type: "router",
          title: "Direto",
          subtitle: "Sem ramificação",
          icon: Route,
          accent:
            "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30",
        },
      ],
      [
        {
          id: "a3",
          type: "agent",
          title: "Bruno Onboarding",
          subtitle: "Boas-vindas + ativação",
          icon: ShoppingCart,
          accent:
            "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30",
        },
      ],
      [
        {
          id: "h3",
          type: "handoff",
          title: "Pós-venda",
          subtitle: "CS team",
          icon: Flame,
          accent:
            "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30",
        },
      ],
    ],
  },
  {
    id: "fl3",
    name: "Reativação 30 dias",
    description: "Leads inativos há 30+ dias entram automaticamente em fluxo de winback.",
    active: false,
    triggerLabel: "Cron diário",
    metrics: { leadsToday: 0, conversionPct: 22 },
    columns: [
      [
        {
          id: "t3",
          type: "trigger",
          title: "Cron",
          subtitle: "Diário 09:00",
          icon: Globe,
          accent:
            "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
        },
      ],
      [
        {
          id: "s3",
          type: "score",
          title: "Score com Decay",
          subtitle: "Aplicar -5% / dia inativo",
          icon: Gauge,
          accent:
            "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/30",
        },
      ],
      [
        {
          id: "r3",
          type: "router",
          title: "Por segmento RFM",
          subtitle: "Champions vs Em risco",
          icon: Route,
          accent:
            "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30",
        },
      ],
      [
        {
          id: "a4",
          type: "agent",
          title: "Roberto Recuperador",
          subtitle: "Tom casual",
          icon: Heart,
          accent:
            "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/30",
        },
      ],
      [
        {
          id: "h4",
          type: "handoff",
          title: "Reativação",
          subtitle: "Pipeline dedicado",
          icon: Flame,
          accent:
            "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30",
        },
      ],
    ],
  },
]

const triggerCatalog = [
  { id: "whatsapp", label: "WhatsApp", icon: MessageSquare },
  { id: "instagram", label: "Instagram Direct", icon: Camera },
  { id: "form", label: "Formulário web", icon: Globe },
  { id: "hotmart", label: "Hotmart Webhook", icon: Webhook },
  { id: "ecommerce", label: "Carrinho abandonado", icon: ShoppingCart },
]

const columnLabels: Record<NodeType, string> = {
  trigger: "1. Gatilho",
  score: "2. Score",
  router: "3. Roteamento",
  agent: "4. Agente IA",
  handoff: "5. Handoff",
}

export function WorkflowSection() {
  const [activeFlowId, setActiveFlowId] = useState(flows[0].id)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)

  const activeFlow = flows.find((f) => f.id === activeFlowId)!
  const selectedNode = activeFlow.columns
    .flat()
    .find((n) => n.id === selectedNodeId)

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h3 className="font-display text-lg font-bold tracking-tight">
            Workflow de Entrada
          </h3>
          <p className="text-sm text-muted-foreground">
            Desenhe o caminho do lead — do canal de entrada até o handoff final.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Eye className="mr-1.5 size-3.5" />
            Pré-visualizar
          </Button>
          <Button className="btn-lift bg-gradient-to-r from-primary to-orange-600 text-primary-foreground shadow-md shadow-primary/10">
            Salvar workflow
          </Button>
        </div>
      </header>

      {/* Flow tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {flows.map((f) => {
          const active = activeFlowId === f.id
          return (
            <button
              key={f.id}
              onClick={() => {
                setActiveFlowId(f.id)
                setSelectedNodeId(null)
              }}
              aria-pressed={active}
              className={cn(
                "group inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-left transition-all",
                active
                  ? "border-primary/40 bg-primary/[0.06] shadow-sm shadow-primary/10"
                  : "border-border/60 bg-card/50 hover:border-primary/20"
              )}
            >
              {f.active ? (
                <span
                  className="size-1.5 rounded-full bg-emerald-500 pulse-online"
                  aria-label="Ativo"
                />
              ) : (
                <Pause className="size-3 text-muted-foreground" aria-hidden />
              )}
              <div className="text-left">
                <p
                  className={cn(
                    "text-[12px] font-semibold leading-tight",
                    active && "text-primary"
                  )}
                >
                  {f.name}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {f.triggerLabel} · {f.metrics.leadsToday} hoje
                </p>
              </div>
            </button>
          )
        })}
        <button className="inline-flex items-center gap-1.5 rounded-xl border-2 border-dashed border-border/60 px-3.5 py-2 text-[12px] font-medium text-muted-foreground transition-all hover:border-primary/40 hover:text-foreground">
          <Plus className="size-3.5" />
          Novo workflow
        </button>
      </div>

      {/* Flow header strip */}
      <Card className="animate-card-in">
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-orange-500/10 text-primary">
              <GitBranch className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-display text-[15px] font-semibold">
                  {activeFlow.name}
                </h4>
                {activeFlow.active ? (
                  <Badge
                    variant="secondary"
                    className="gap-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 text-[10px]"
                  >
                    <span className="size-1.5 rounded-full bg-emerald-500 pulse-online" />
                    Ativo
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-[10px]">
                    <Pause className="mr-1 size-2.5" />
                    Pausado
                  </Badge>
                )}
              </div>
              <p className="text-[12px] text-muted-foreground">
                {activeFlow.description}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Stat
              label="Leads hoje"
              value={activeFlow.metrics.leadsToday.toString()}
            />
            <Stat
              label="Conversão"
              value={`${activeFlow.metrics.conversionPct}%`}
            />
            <Separator orientation="vertical" className="hidden h-8 sm:block" />
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" aria-label="Diminuir zoom">
                <ZoomOut className="size-3.5" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Aumentar zoom">
                <ZoomIn className="size-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Tela cheia"
              >
                <Maximize2 className="size-3.5" />
              </Button>
            </div>
            <Switch
              checked={activeFlow.active}
              onCheckedChange={() => {}}
              aria-label="Ativar workflow"
            />
          </div>
        </CardContent>
      </Card>

      {/* Canvas */}
      <Card className="animate-card-in stagger-1 overflow-hidden">
        <CardContent className="p-0">
          <div
            className="relative overflow-x-auto bg-[radial-gradient(circle_at_1px_1px,_oklch(0_0_0/0.06)_1px,_transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,_oklch(1_0_0/0.04)_1px,_transparent_0)]"
            style={{ backgroundSize: "16px 16px" }}
          >
            <div className="relative min-w-[1100px] p-6">
              {/* Column headers */}
              <div className="grid grid-cols-5 gap-6 mb-4">
                {(
                  ["trigger", "score", "router", "agent", "handoff"] as NodeType[]
                ).map((type) => (
                  <div
                    key={type}
                    className="flex items-center justify-center"
                  >
                    <Badge
                      variant="secondary"
                      className="text-[10px] font-bold uppercase tracking-wider"
                    >
                      {columnLabels[type]}
                    </Badge>
                  </div>
                ))}
              </div>

              {/* Connector lines (SVG) */}
              <svg
                className="pointer-events-none absolute inset-x-6 top-[60px] h-[calc(100%-80px)] w-[calc(100%-48px)]"
                aria-hidden
              >
                {activeFlow.columns.map((col, colIdx) => {
                  if (colIdx === activeFlow.columns.length - 1) return null
                  const nextCol = activeFlow.columns[colIdx + 1]
                  return col.flatMap((srcNode, srcIdx) =>
                    nextCol.map((dstNode, dstIdx) => {
                      const x1Pct = (colIdx + 1) * 20
                      const x2Pct = (colIdx + 1) * 20
                      const yStart =
                        col.length === 1
                          ? 50
                          : srcIdx === 0
                            ? 30
                            : 70
                      const yEnd =
                        nextCol.length === 1
                          ? 50
                          : dstIdx === 0
                            ? 30
                            : 70
                      return (
                        <path
                          key={`${srcNode.id}-${dstNode.id}`}
                          d={`M ${x1Pct - 2}% ${yStart}% C ${x1Pct + 5}% ${yStart}%, ${x2Pct - 5}% ${yEnd}%, ${x2Pct + 2}% ${yEnd}%`}
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeDasharray="3,3"
                          fill="none"
                          className="text-primary/40"
                        />
                      )
                    })
                  )
                })}
              </svg>

              {/* Nodes grid */}
              <div className="relative grid grid-cols-5 gap-6">
                {activeFlow.columns.map((col, colIdx) => (
                  <div
                    key={colIdx}
                    className="flex flex-col gap-3"
                  >
                    {col.map((node) => {
                      const selected = selectedNodeId === node.id
                      return (
                        <div key={node.id} className="space-y-1">
                          {node.branchLabel && (
                            <p className="text-center text-[9px] font-bold uppercase tracking-wider text-muted-foreground/70">
                              {node.branchLabel}
                            </p>
                          )}
                          <button
                            onClick={() =>
                              setSelectedNodeId(
                                selected ? null : node.id
                              )
                            }
                            aria-pressed={selected}
                            className={cn(
                              "group w-full rounded-2xl border-2 bg-card p-3.5 text-left transition-all backdrop-blur-sm",
                              node.accent,
                              selected
                                ? "ring-2 ring-primary/40 shadow-md shadow-primary/10"
                                : "hover:shadow-sm"
                            )}
                          >
                            <div className="flex items-start gap-2.5">
                              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-card shadow-sm">
                                <node.icon className="size-4" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate font-display text-[13px] font-semibold leading-tight">
                                  {node.title}
                                </p>
                                {node.subtitle && (
                                  <p className="mt-0.5 line-clamp-2 text-[10px] leading-snug opacity-75">
                                    {node.subtitle}
                                  </p>
                                )}
                              </div>
                            </div>
                            {node.configHint && (
                              <div className="mt-2.5 flex items-center gap-1 border-t border-current/15 pt-2 text-[10px] opacity-70">
                                <Settings2 className="size-2.5" />
                                {node.configHint}
                              </div>
                            )}
                          </button>
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>

              {/* Add column hint */}
              <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-muted-foreground/60">
                <ArrowRight className="size-3" />
                Workflow flui da esquerda para a direita
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected node config + trigger catalog */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Selected node detail */}
        {selectedNode ? (
          <Card className="animate-card-in">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-xl border-2",
                      selectedNode.accent
                    )}
                  >
                    <selectedNode.icon className="size-5" />
                  </div>
                  <div>
                    <Badge variant="secondary" className="text-[10px]">
                      {columnLabels[selectedNode.type]}
                    </Badge>
                    <h4 className="mt-1 font-display text-base font-semibold">
                      {selectedNode.title}
                    </h4>
                    <p className="text-[12px] text-muted-foreground">
                      {selectedNode.subtitle}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" aria-label="Duplicar">
                    <Copy className="size-3.5" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings2 className="mr-1.5 size-3.5" />
                    Configurar
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                  Configuração rápida
                </p>
                <p className="text-[12px] leading-relaxed text-muted-foreground">
                  Clique em <span className="font-medium text-foreground/80">"Configurar"</span> para
                  editar parâmetros detalhados deste nó
                  {selectedNode.type === "agent" &&
                    " — incluindo persona, modelo LLM e instruções."}
                  {selectedNode.type === "router" &&
                    " — incluindo regras condicionais e ordem de avaliação."}
                  {selectedNode.type === "score" &&
                    " — incluindo pesos da fórmula e ajustes finos."}
                  {selectedNode.type === "trigger" &&
                    " — incluindo filtros de entrada e validações."}
                  {selectedNode.type === "handoff" &&
                    " — incluindo destino, notificação e enriquecimento."}
                </p>
              </div>

              <div className="flex items-start gap-2 rounded-lg bg-primary/[0.04] border border-primary/10 px-3 py-2">
                <Sparkles className="mt-0.5 size-3.5 shrink-0 text-primary" />
                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  <span className="font-medium text-foreground/80">
                    Dica:
                  </span>{" "}
                  você pode reusar esse nó em outros workflows. Mudanças aqui
                  refletem em todos os fluxos que o referenciam.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="animate-card-in border-dashed">
            <CardContent className="flex h-full items-center justify-center py-10">
              <div className="text-center">
                <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-muted/40">
                  <CheckCircle2 className="size-5 text-muted-foreground/50" />
                </div>
                <p className="text-sm font-medium">
                  Clique em um nó para ver detalhes
                </p>
                <p className="text-xs text-muted-foreground">
                  Cada nó pode ser reconfigurado, duplicado ou removido.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Trigger catalog */}
        <aside className="space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
            Gatilhos disponíveis
          </p>
          <Card className="animate-card-in stagger-1">
            <CardContent className="p-3 space-y-1.5">
              {triggerCatalog.map((t) => (
                <button
                  key={t.id}
                  className="group flex w-full cursor-grab items-center gap-2.5 rounded-lg border border-border/40 bg-card/50 px-3 py-2 text-left transition-colors hover:border-primary/30 hover:bg-card"
                  draggable
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                    <t.icon className="size-4" />
                  </div>
                  <span className="flex-1 text-[12px] font-medium">
                    {t.label}
                  </span>
                  <Plus className="size-3.5 text-muted-foreground/40 transition-colors group-hover:text-primary" />
                </button>
              ))}
            </CardContent>
          </Card>
          <p className="text-[11px] leading-relaxed text-muted-foreground/70">
            Arraste um gatilho para criar um novo workflow ou clique para
            adicionar à seleção atual.
          </p>
        </aside>
      </div>

      {/* Legend */}
      <div className="flex items-start gap-3 rounded-xl bg-primary/[0.04] border border-primary/10 px-4 py-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Bot className="size-4" />
        </div>
        <p className="flex-1 text-[12px] leading-relaxed text-muted-foreground">
          <span className="font-medium text-foreground/80">
            Como funciona:
          </span>{" "}
          o workflow define como cada lead é processado pelo motor SDR. Quando
          o gatilho dispara, o lead percorre score → roteamento → agente IA →
          handoff. Múltiplas ramificações no roteamento permitem fluxos
          condicionais (ex: enterprise vai para Sofia, PME vai para Ana).
        </p>
        <Button variant="ghost" size="sm" className="shrink-0">
          <Play className="mr-1 size-3.5" />
          Ver exemplo
        </Button>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-end">
      <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
        {label}
      </span>
      <span className="font-display text-sm font-bold tabular-nums">
        {value}
      </span>
    </div>
  )
}
