import { useState } from "react"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Bot,
  Sparkles,
  Cpu,
  Shield,
  Volume2,
  Target,
  AlertTriangle,
  Flame,
  MessageCircle,
  Zap,
  User,
  Check,
  ArrowLeft,
  Trash2,
  Settings2,
  TestTube2,
  GitBranch,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { AgenteIaSandbox } from "./agente-ia-sandbox"
import type { AgentSummary } from "./agente-ia-section"

type Tone = "formal" | "consultivo" | "casual" | "direto"

const toneOptions: { id: Tone; label: string; hint: string }[] = [
  { id: "formal", label: "Formal", hint: "Corporativo, 3ª pessoa" },
  { id: "consultivo", label: "Consultivo", hint: "Especialista próximo" },
  { id: "casual", label: "Casual", hint: "Descontraído, 1ª pessoa" },
  { id: "direto", label: "Direto", hint: "Objetivo, sem floreio" },
]

const enabledModels = [
  {
    id: "anthropic/claude-sonnet-4-6",
    name: "Claude Sonnet 4.6",
    provider: "Anthropic via OpenRouter",
    badge: "Recomendado",
    note: "Equilíbrio raciocínio/custo",
  },
  {
    id: "anthropic/claude-haiku-4-5",
    name: "Claude Haiku 4.5",
    provider: "Anthropic via OpenRouter",
    note: "Mais rápido e econômico",
  },
  {
    id: "anthropic/claude-opus-4-7",
    name: "Claude Opus 4.7",
    provider: "Anthropic via OpenRouter",
    note: "Máxima qualidade · maior custo",
  },
  {
    id: "openai/gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI via OpenRouter",
    note: "Multimodal rápido",
  },
]

const destinationFunnels = [
  { id: "vendas-principal", label: "Vendas Principal" },
  { id: "vendas-enterprise", label: "Vendas Enterprise" },
  { id: "reativacao", label: "Reativação" },
  { id: "ecommerce", label: "E-commerce / Carrinho" },
  { id: "pos-venda", label: "Pós-venda / Onboarding" },
]

export function AgenteIaEditor({
  agent,
  onBack,
  onDelete,
}: {
  agent: AgentSummary
  onBack: () => void
  onDelete: (id: string) => void
}) {
  const [activeTab, setActiveTab] = useState<"config" | "sandbox">("config")
  const [enabled, setEnabled] = useState(agent.active)
  const [name, setName] = useState(agent.name)
  const [objective, setObjective] = useState(agent.objective)
  const [tone, setTone] = useState<Tone>(agent.tone as Tone)
  const [model, setModel] = useState(agent.model)
  const [destination, setDestination] = useState(agent.destinationFunnelId)
  const [temperature, setTemperature] = useState(0.5)
  const [instructions, setInstructions] = useState(agent.instructions)
  const [escalateOnPrice, setEscalateOnPrice] = useState(true)
  const [escalateOnComplaint, setEscalateOnComplaint] = useState(true)
  const [escalateAfterFailedAttempts, setEscalateAfterFailedAttempts] =
    useState(false)
  const [maxAutonomousMessages, setMaxAutonomousMessages] = useState(8)

  const destinationLabel =
    destinationFunnels.find((f) => f.id === destination)?.label ?? destination

  return (
    <div className="space-y-5">
      {/* Editor header */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            aria-label="Voltar para lista"
            className="mt-0.5 shrink-0"
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div className="relative flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-orange-600 shadow-lg shadow-primary/20">
            <Flame className="size-6 text-white" />
            <div
              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/15 to-transparent"
              aria-hidden
            />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-display text-lg font-bold tracking-tight">
                {name}
              </h3>
              <Badge
                variant="secondary"
                className={cn(
                  "gap-1 text-[10px]",
                  enabled
                    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                    : ""
                )}
              >
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    enabled
                      ? "bg-emerald-500 pulse-online"
                      : "bg-muted-foreground/40"
                  )}
                />
                {enabled ? "Ativo" : "Pausado"}
              </Badge>
              <Badge variant="secondary" className="gap-1 text-[10px]">
                <GitBranch className="size-2.5" />
                {destinationLabel}
              </Badge>
            </div>
            <p className="mt-0.5 truncate text-sm text-muted-foreground">
              {objective.split(".")[0]}.
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-card/50 px-3 py-1.5 backdrop-blur-sm">
            <Label
              htmlFor="agent-enabled"
              className="text-xs font-medium cursor-pointer"
            >
              {enabled ? "Ativo" : "Pausado"}
            </Label>
            <Switch
              id="agent-enabled"
              checked={enabled}
              onCheckedChange={setEnabled}
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onDelete(agent.id)}
            aria-label="Excluir agente"
            className="hover:text-destructive hover:border-destructive/30"
          >
            <Trash2 className="size-4" />
          </Button>
          <Button className="btn-lift bg-gradient-to-r from-primary to-orange-600 text-primary-foreground shadow-md shadow-primary/10">
            Salvar
          </Button>
        </div>
      </header>

      {/* Sub-tabs */}
      <div
        className="inline-flex rounded-xl border border-border/60 bg-muted/30 p-1"
        role="tablist"
        aria-label="Modo do agente"
      >
        {(
          [
            { id: "config", label: "Configuração", icon: Settings2 },
            { id: "sandbox", label: "Sandbox de teste", icon: TestTube2 },
          ] as const
        ).map((t) => {
          const active = activeTab === t.id
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={active}
              onClick={() => setActiveTab(t.id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-4 py-1.5 text-[12px] font-medium transition-all",
                active
                  ? "bg-card text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <t.icon className="size-3.5" />
              {t.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      {activeTab === "sandbox" ? (
        <AgenteIaSandbox
          agent={{
            name,
            initialMessage: "Oi! 👋",
            destinationFunnel: destinationLabel,
          }}
        />
      ) : (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          {/* Forms */}
          <div className="space-y-5">
            {/* Identity */}
            <Card className="animate-card-in">
              <CardContent className="p-5 space-y-4">
                <SectionTitle
                  icon={User}
                  label="Identidade"
                  hint="Como o agente se apresenta ao lead"
                />

                <div className="grid gap-4 sm:grid-cols-[120px_minmax(0,1fr)]">
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-orange-600 shadow-lg shadow-primary/20">
                      <Flame className="size-9 text-white" />
                      <div
                        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/15 to-transparent"
                        aria-hidden
                      />
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      Alterar avatar
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="agent-name">Nome do agente</Label>
                      <Input
                        id="agent-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="agent-objective">Objetivo</Label>
                      <textarea
                        id="agent-objective"
                        value={objective}
                        onChange={(e) => setObjective(e.target.value)}
                        rows={3}
                        className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary resize-none"
                      />
                      <p className="text-[11px] text-muted-foreground/70">
                        Descreva o job-to-be-done do agente em 2–3 frases.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Destination funnel */}
            <Card className="animate-card-in stagger-1">
              <CardContent className="p-5 space-y-4">
                <SectionTitle
                  icon={GitBranch}
                  label="Funil de destino"
                  hint="Para onde o lead vai quando o agente concluir o handoff"
                />
                <div className="space-y-2">
                  <Select value={destination} onValueChange={setDestination}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {destinationFunnels.map((f) => (
                        <SelectItem key={f.id} value={f.id}>
                          {f.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-[11px] text-muted-foreground/70">
                    Quando score do lead atingir threshold + BANT estiver
                    completo, ele entra direto neste funil para o closer.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Tone */}
            <Card className="animate-card-in stagger-2">
              <CardContent className="p-5 space-y-4">
                <SectionTitle
                  icon={Volume2}
                  label="Tom de voz"
                  hint="Define a personalidade nas mensagens"
                />
                <div
                  className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4"
                  role="radiogroup"
                  aria-label="Selecionar tom"
                >
                  {toneOptions.map((t) => {
                    const active = tone === t.id
                    return (
                      <button
                        key={t.id}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => setTone(t.id)}
                        className={cn(
                          "group rounded-xl border px-3 py-2.5 text-left transition-all",
                          active
                            ? "border-primary/40 bg-primary/[0.04] shadow-sm shadow-primary/10"
                            : "border-border/60 bg-card/50 hover:border-primary/20"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={cn(
                              "text-sm font-medium",
                              active && "text-primary"
                            )}
                          >
                            {t.label}
                          </span>
                          {active && (
                            <Check className="size-3.5 text-primary" />
                          )}
                        </div>
                        <span className="text-[11px] text-muted-foreground">
                          {t.hint}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Model */}
            <Card className="animate-card-in stagger-3">
              <CardContent className="p-5 space-y-4">
                <SectionTitle
                  icon={Cpu}
                  label="Modelo de linguagem"
                  hint="Selecionado entre os modelos habilitados em Chaves & Modelos"
                />

                <div className="grid gap-2">
                  {enabledModels.map((m) => {
                    const active = model === m.id
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setModel(m.id)}
                        aria-pressed={active}
                        className={cn(
                          "group flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all",
                          active
                            ? "border-primary/40 bg-primary/[0.04] shadow-sm shadow-primary/10"
                            : "border-border/60 bg-card/50 hover:border-primary/20"
                        )}
                      >
                        <div
                          className={cn(
                            "flex size-9 items-center justify-center rounded-lg",
                            active
                              ? "bg-gradient-to-br from-primary to-orange-600 text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          )}
                          aria-hidden
                        >
                          <Sparkles className="size-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[13px] font-medium">
                              {m.name}
                            </span>
                            {m.badge && (
                              <Badge
                                variant="secondary"
                                className="bg-primary/10 text-primary border-primary/20 text-[10px]"
                              >
                                {m.badge}
                              </Badge>
                            )}
                          </div>
                          <p className="text-[11px] text-muted-foreground">
                            {m.provider} · {m.note}
                          </p>
                        </div>
                        <div
                          className={cn(
                            "flex size-5 items-center justify-center rounded-full border",
                            active
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border"
                          )}
                          aria-hidden
                        >
                          {active && <Check className="size-3" />}
                        </div>
                      </button>
                    )
                  })}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="temperature"
                      className="flex items-center gap-2"
                    >
                      Temperatura
                      <span className="text-xs text-muted-foreground">
                        criatividade vs. consistência
                      </span>
                    </Label>
                    <Badge
                      variant="secondary"
                      className="font-display font-bold"
                    >
                      {temperature.toFixed(1)}
                    </Badge>
                  </div>
                  <input
                    id="temperature"
                    type="range"
                    min={0}
                    max={1}
                    step={0.1}
                    value={temperature}
                    onChange={(e) => setTemperature(Number(e.target.value))}
                    className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gradient-to-r from-sky-500/40 via-primary/40 to-rose-500/40 accent-primary"
                    aria-label="Temperatura"
                  />
                  <div className="flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground/70">
                    <span>Previsível</span>
                    <span>Balanceado</span>
                    <span>Criativo</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="animate-card-in stagger-4">
              <CardContent className="p-5 space-y-4">
                <SectionTitle
                  icon={Target}
                  label="Instruções customizadas"
                  hint="Regras específicas que o agente deve respeitar"
                />
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  rows={6}
                  className="flex w-full rounded-lg border border-input bg-background px-3 py-2.5 font-mono text-[12px] leading-relaxed shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary resize-y"
                  aria-label="Instruções customizadas"
                />
                <p className="text-[11px] text-muted-foreground/70">
                  Use listas (-) ou frases curtas. Quanto mais específico,
                  melhor.
                </p>
              </CardContent>
            </Card>

            {/* Escalation */}
            <Card className="animate-card-in stagger-5">
              <CardContent className="p-5 space-y-4">
                <SectionTitle
                  icon={Shield}
                  label="Regras de escalonamento"
                  hint="Quando transferir para SDR humano"
                />

                <div className="space-y-1">
                  <EscalationRow
                    icon={AlertTriangle}
                    title="Pedido de desconto ou proposta comercial"
                    description="Transfere quando lead pergunta sobre preço, desconto ou proposta formal."
                    checked={escalateOnPrice}
                    onChange={setEscalateOnPrice}
                  />
                  <Separator className="my-1" />
                  <EscalationRow
                    icon={MessageCircle}
                    title="Reclamação ou sentimento negativo"
                    description="Detecta hostilidade e transfere para um humano."
                    checked={escalateOnComplaint}
                    onChange={setEscalateOnComplaint}
                  />
                  <Separator className="my-1" />
                  <EscalationRow
                    icon={Zap}
                    title="Após N tentativas sem qualificar"
                    description={`Entrega o lead ao SDR humano após ${maxAutonomousMessages} mensagens sem avanço.`}
                    checked={escalateAfterFailedAttempts}
                    onChange={setEscalateAfterFailedAttempts}
                  />
                </div>

                <div className="rounded-xl bg-muted/30 p-3.5">
                  <Label
                    htmlFor="max-attempts"
                    className="flex items-center justify-between"
                  >
                    <span className="text-[13px]">
                      Máximo de mensagens autônomas por lead
                    </span>
                    <Badge
                      variant="secondary"
                      className="font-display font-bold"
                    >
                      {maxAutonomousMessages}
                    </Badge>
                  </Label>
                  <input
                    id="max-attempts"
                    type="range"
                    min={3}
                    max={15}
                    step={1}
                    value={maxAutonomousMessages}
                    onChange={(e) =>
                      setMaxAutonomousMessages(Number(e.target.value))
                    }
                    className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sticky preview */}
          <aside className="space-y-3 lg:sticky lg:top-6 lg:self-start">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                Preview do agente
              </p>
            </div>

            <Card className="animate-card-in">
              <CardContent className="space-y-4 p-4">
                <div className="flex items-center gap-3 rounded-xl bg-gradient-to-br from-primary/5 to-orange-500/5 p-3">
                  <div className="relative flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-orange-600 shadow-sm shadow-primary/15">
                    <Flame className="size-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold">{name}</p>
                    <div className="flex items-center gap-1.5">
                      <Badge
                        variant="secondary"
                        className="bg-primary/10 text-primary border-primary/20 text-[9px]"
                      >
                        <Bot className="mr-0.5 size-2.5" />
                        IA
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">
                        {toneOptions.find((t) => t.id === tone)?.label}
                      </span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-1.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                    Configuração atual
                  </p>
                  <PreviewRow
                    label="Funil destino"
                    value={destinationLabel}
                  />
                  <PreviewRow
                    label="Modelo"
                    value={enabledModels.find((m) => m.id === model)?.name ?? model}
                  />
                  <PreviewRow
                    label="Temperatura"
                    value={temperature.toFixed(1)}
                  />
                  <PreviewRow
                    label="Máx mensagens"
                    value={String(maxAutonomousMessages)}
                  />
                  <PreviewRow
                    label="Escalonamentos"
                    value={`${
                      [
                        escalateOnPrice,
                        escalateOnComplaint,
                        escalateAfterFailedAttempts,
                      ].filter(Boolean).length
                    } ativos`}
                  />
                </div>
              </CardContent>
            </Card>

            <p className="text-[11px] leading-relaxed text-muted-foreground/70">
              Mudanças aplicam imediatamente em novas conversas. Conversas em
              andamento mantêm a configuração original.
            </p>
          </aside>
        </div>
      )}
    </div>
  )
}

function SectionTitle({
  icon: Icon,
  label,
  hint,
}: {
  icon: typeof Bot
  label: string
  hint: string
}) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-4" />
      </div>
      <div>
        <p className="font-display text-sm font-semibold tracking-tight">
          {label}
        </p>
        <p className="text-[11px] text-muted-foreground">{hint}</p>
      </div>
    </div>
  )
}

function EscalationRow({
  icon: Icon,
  title,
  description,
  checked,
  onChange,
}: {
  icon: typeof AlertTriangle
  title: string
  description: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-start gap-3 py-2">
      <div
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-lg",
          checked
            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
            : "bg-muted text-muted-foreground/50"
        )}
        aria-hidden
      >
        <Icon className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-medium">{title}</p>
        <p className="text-[11px] text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} aria-label={title} />
    </div>
  )
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-[12px]">
      <span className="text-muted-foreground">{label}</span>
      <span className="truncate font-medium ml-2">{value}</span>
    </div>
  )
}
