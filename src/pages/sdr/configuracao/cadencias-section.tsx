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
  Plus,
  MessageSquare,
  Clock,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Copy,
  Trash2,
  ChevronDown,
  GripVertical,
  Repeat,
  Zap,
  Edit3,
  Users,
  Pause,
} from "lucide-react"
import { cn } from "@/lib/utils"

type CadenceType = "outreach" | "reactivation" | "outbound"

interface CadenceStep {
  id: string
  channel: "whatsapp" | "email"
  delayLabel: string
  template: string
  onReply: string
  onNoReply: string
}

interface Cadence {
  id: string
  name: string
  type: CadenceType
  description: string
  steps: CadenceStep[]
  durationDays: number
  active: boolean
  stats: {
    replyRate: number
    handoffRate: number
    activeLeads: number
  }
}

const cadences: Cadence[] = [
  {
    id: "c1",
    name: "Prospecção B2B Inicial",
    type: "outreach",
    description: "Fluxo padrão para leads inbound de site e formulários.",
    durationDays: 7,
    active: true,
    stats: { replyRate: 34, handoffRate: 18, activeLeads: 82 },
    steps: [
      {
        id: "s1",
        channel: "whatsapp",
        delayLabel: "Dia 0 · imediato",
        template:
          "Oi {{nome}}, aqui é a Ana da Tech Vendas. Vi que você demonstrou interesse em otimizar o comercial da {{empresa}}. Topa uma conversa de 15 min esta semana?",
        onReply: "Mover para qualificação",
        onNoReply: "Aguardar Step 2",
      },
      {
        id: "s2",
        channel: "whatsapp",
        delayLabel: "Dia +2 · 10h",
        template:
          "{{nome}}, tudo bem? Passando só pra garantir que minha mensagem chegou. Vou te mandar um case de 2 min de uma empresa parecida com a {{empresa}} — vale olhar?",
        onReply: "Enviar case + qualificar",
        onNoReply: "Aguardar Step 3",
      },
      {
        id: "s3",
        channel: "whatsapp",
        delayLabel: "Dia +4 · 14h",
        template:
          "{{nome}}, última tentativa por aqui antes de te deixar em paz 😄 Me conta: faz sentido continuar ou prefere que eu retome daqui 30 dias?",
        onReply: "Qualificar ou agendar retomada",
        onNoReply: "Aguardar Step 4",
      },
      {
        id: "s4",
        channel: "whatsapp",
        delayLabel: "Dia +7 · 11h",
        template:
          "{{nome}}, vou encerrar o follow-up por aqui. Se mudar de ideia, é só me chamar. Obrigada!",
        onReply: "Reabrir qualificação",
        onNoReply: "Marcar desqualificado",
      },
    ],
  },
  {
    id: "c2",
    name: "Reativação 30 dias",
    type: "reactivation",
    description:
      "Recupera leads sem interação há 30+ dias com abordagem consultiva.",
    durationDays: 10,
    active: true,
    stats: { replyRate: 22, handoffRate: 11, activeLeads: 41 },
    steps: [],
  },
  {
    id: "c3",
    name: "Outbound LinkedIn → WhatsApp",
    type: "outbound",
    description:
      "Primeira abordagem para leads captados via LinkedIn Sales Navigator.",
    durationDays: 12,
    active: false,
    stats: { replyRate: 18, handoffRate: 6, activeLeads: 0 },
    steps: [],
  },
]

const typeLabel: Record<CadenceType, string> = {
  outreach: "Prospecção",
  reactivation: "Reativação",
  outbound: "Outbound",
}

const typeTone: Record<CadenceType, string> = {
  outreach: "bg-primary/10 text-primary border-primary/20",
  reactivation: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
  outbound:
    "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
}

export function CadenciasSection() {
  const [expandedId, setExpandedId] = useState<string | null>("c1")
  const [cadenceList, setCadenceList] = useState(cadences)

  function toggleActive(id: string) {
    setCadenceList((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    )
  }

  return (
    <div className="space-y-6">
      {/* Section header */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h3 className="font-display text-lg font-bold tracking-tight">
            Cadências de Outreach
          </h3>
          <p className="text-sm text-muted-foreground">
            Sequências de mensagens automáticas executadas pelo SDR ou pelo agente IA.
          </p>
        </div>
        <Button className="btn-lift bg-gradient-to-r from-primary to-orange-600 text-primary-foreground shadow-md shadow-primary/10">
          <Plus className="mr-1.5 size-4" />
          Nova cadência
        </Button>
      </header>

      {/* Summary row */}
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          {
            label: "Cadências ativas",
            value: cadenceList.filter((c) => c.active).length,
            total: cadenceList.length,
            icon: Repeat,
          },
          {
            label: "Leads em cadência",
            value: cadenceList.reduce((acc, c) => acc + c.stats.activeLeads, 0),
            suffix: "ativos",
            icon: Users,
          },
          {
            label: "Taxa média de handoff",
            value:
              Math.round(
                cadenceList.reduce((acc, c) => acc + c.stats.handoffRate, 0) /
                  cadenceList.length
              ) + "%",
            icon: Zap,
          },
        ].map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/50 px-4 py-3 backdrop-blur-sm"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-orange-500/10">
              <s.icon className="size-4 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
                {s.label}
              </p>
              <p className="font-display text-lg font-bold tracking-tight">
                {s.value}
                {"total" in s && (
                  <span className="text-sm font-normal text-muted-foreground/70">
                    {" "}
                    / {s.total}
                  </span>
                )}
                {"suffix" in s && (
                  <span className="ml-1 text-xs font-normal text-muted-foreground/70">
                    {s.suffix}
                  </span>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Cadence list */}
      <div className="space-y-3">
        {cadenceList.map((cadence, idx) => {
          const expanded = expandedId === cadence.id
          return (
            <Card
              key={cadence.id}
              className={cn(
                "animate-card-in overflow-hidden transition-all",
                `stagger-${Math.min(idx + 1, 6)}`,
                !cadence.active && "opacity-70"
              )}
            >
              <CardContent className="p-0">
                {/* Row header (clickable) */}
                <button
                  type="button"
                  onClick={() =>
                    setExpandedId(expanded ? null : cadence.id)
                  }
                  aria-expanded={expanded}
                  aria-controls={`cadence-${cadence.id}-panel`}
                  className="group flex w-full items-center gap-4 p-5 text-left transition-colors hover:bg-primary/[0.02]"
                >
                  {/* Left: name + type */}
                  <div className="flex min-w-0 flex-1 items-center gap-4">
                    <div
                      className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-xl border",
                        typeTone[cadence.type]
                      )}
                      aria-hidden
                    >
                      <Repeat className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="truncate font-display text-[15px] font-semibold tracking-tight">
                          {cadence.name}
                        </h4>
                        <Badge
                          variant="secondary"
                          className={cn("text-[10px]", typeTone[cadence.type])}
                        >
                          {typeLabel[cadence.type]}
                        </Badge>
                        {cadence.active ? (
                          <Badge
                            variant="secondary"
                            className="gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px]"
                          >
                            <span className="size-1.5 rounded-full bg-emerald-500 pulse-online" />
                            Ativa
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-[10px]">
                            <Pause className="mr-1 size-2.5" />
                            Pausada
                          </Badge>
                        )}
                      </div>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {cadence.description}
                      </p>
                    </div>
                  </div>

                  {/* Center: stats */}
                  <div className="hidden items-center gap-6 md:flex">
                    <Stat label="Duração" value={`${cadence.durationDays}d`} />
                    <Stat
                      label="Steps"
                      value={cadence.steps.length || "—"}
                    />
                    <Stat
                      label="Resposta"
                      value={`${cadence.stats.replyRate}%`}
                      tone={cadence.stats.replyRate >= 25 ? "good" : "warn"}
                    />
                    <Stat
                      label="Handoff"
                      value={`${cadence.stats.handoffRate}%`}
                      tone={cadence.stats.handoffRate >= 15 ? "good" : "warn"}
                    />
                  </div>

                  {/* Right: toggle + chevron */}
                  <div className="flex items-center gap-3">
                    <div
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                      role="presentation"
                    >
                      <Switch
                        checked={cadence.active}
                        onCheckedChange={() => toggleActive(cadence.id)}
                        aria-label={
                          cadence.active
                            ? `Pausar ${cadence.name}`
                            : `Ativar ${cadence.name}`
                        }
                      />
                    </div>
                    <ChevronDown
                      className={cn(
                        "size-4 text-muted-foreground transition-transform duration-200",
                        expanded && "rotate-180"
                      )}
                      aria-hidden
                    />
                  </div>
                </button>

                {/* Expanded: steps timeline */}
                {expanded && cadence.steps.length > 0 && (
                  <div
                    id={`cadence-${cadence.id}-panel`}
                    className="border-t border-border/60 bg-muted/20 px-5 py-5"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <h5 className="text-[13px] font-semibold">
                          Timeline da cadência
                        </h5>
                        <p className="text-xs text-muted-foreground">
                          {cadence.steps.length} mensagens ao longo de{" "}
                          {cadence.durationDays} dias
                        </p>
                      </div>
                      <div className="flex gap-1.5">
                        <Button variant="outline" size="sm">
                          <Copy className="mr-1.5 size-3.5" />
                          Duplicar
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit3 className="mr-1.5 size-3.5" />
                          Editar
                        </Button>
                      </div>
                    </div>

                    <ol className="relative space-y-3" aria-label="Steps">
                      {cadence.steps.map((step, i) => (
                        <li
                          key={step.id}
                          className="relative flex gap-4 rounded-xl border border-border/60 bg-card px-4 py-3.5"
                        >
                          {/* Step number */}
                          <div className="flex shrink-0 flex-col items-center gap-1.5">
                            <div className="flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-primary to-orange-600 text-[11px] font-bold text-primary-foreground shadow-sm shadow-primary/20">
                              {i + 1}
                            </div>
                            {i < cadence.steps.length - 1 && (
                              <div className="h-full min-h-[40px] w-px flex-1 bg-gradient-to-b from-primary/30 to-transparent" />
                            )}
                          </div>

                          {/* Step body */}
                          <div className="min-w-0 flex-1 space-y-2.5">
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge
                                variant="secondary"
                                className="gap-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 text-[10px]"
                              >
                                <MessageSquare className="size-2.5" />
                                WhatsApp
                              </Badge>
                              <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                                <Clock className="size-3" />
                                {step.delayLabel}
                              </span>
                              <div className="ml-auto flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="size-7"
                                  aria-label="Arrastar para reordenar"
                                >
                                  <GripVertical className="size-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="size-7"
                                  aria-label="Editar step"
                                >
                                  <Edit3 className="size-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="size-7 hover:text-destructive"
                                  aria-label="Remover step"
                                >
                                  <Trash2 className="size-3.5" />
                                </Button>
                              </div>
                            </div>

                            {/* Message preview */}
                            <div className="rounded-lg bg-emerald-500/[0.04] border border-emerald-500/10 px-3 py-2.5">
                              <p className="text-[13px] leading-relaxed text-foreground/85">
                                {step.template}
                              </p>
                            </div>

                            {/* Conditional actions */}
                            <div className="flex flex-col gap-1.5 sm:flex-row sm:gap-3">
                              <div className="flex flex-1 items-center gap-2 rounded-md bg-emerald-500/[0.06] px-2.5 py-1.5 text-[11px]">
                                <CheckCircle2 className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                                <span className="text-muted-foreground">
                                  Se responder:
                                </span>
                                <span className="font-medium text-foreground/80">
                                  {step.onReply}
                                </span>
                                <ArrowRight className="ml-auto size-3 text-muted-foreground/60" />
                              </div>
                              <div className="flex flex-1 items-center gap-2 rounded-md bg-amber-500/[0.06] px-2.5 py-1.5 text-[11px]">
                                <XCircle className="size-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                                <span className="text-muted-foreground">
                                  Se não responder:
                                </span>
                                <span className="font-medium text-foreground/80">
                                  {step.onNoReply}
                                </span>
                                <ArrowRight className="ml-auto size-3 text-muted-foreground/60" />
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ol>

                    <Separator className="my-4" />

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-dashed"
                    >
                      <Plus className="mr-1.5 size-3.5" />
                      Adicionar step
                    </Button>
                  </div>
                )}

                {/* Expanded but empty */}
                {expanded && cadence.steps.length === 0 && (
                  <div
                    id={`cadence-${cadence.id}-panel`}
                    className="border-t border-border/60 bg-muted/20 px-5 py-10 text-center"
                  >
                    <p className="text-sm text-muted-foreground">
                      Esta cadência ainda não tem steps configurados.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3 border-dashed"
                    >
                      <Plus className="mr-1.5 size-3.5" />
                      Adicionar primeiro step
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

function Stat({
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
    <div className="flex flex-col items-end">
      <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
        {label}
      </span>
      <span
        className={cn("font-display text-sm font-bold tracking-tight", toneCls)}
      >
        {value}
      </span>
    </div>
  )
}
