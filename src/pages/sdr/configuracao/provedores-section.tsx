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
  KeyRound,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Sparkles,
  Wallet,
  Activity,
  ExternalLink,
  RefreshCw,
  Copy,
  Plus,
  Globe,
  Cpu,
  Lock,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Provider {
  id: string
  name: string
  description: string
  logo: string
  recommended?: boolean
  required?: boolean
  hasKey: boolean
  status: "connected" | "disconnected" | "error"
  keyMasked?: string
}

const initialProviders: Provider[] = [
  {
    id: "openrouter",
    name: "OpenRouter",
    description:
      "Gateway unificado para Anthropic, OpenAI, Google, Meta, Mistral e mais 100+ modelos. Recomendado.",
    logo: "OR",
    recommended: true,
    required: true,
    hasKey: true,
    status: "connected",
    keyMasked: "sk-or-v1-•••••••••••••••••••••••••••••••••••a4f9",
  },
  {
    id: "anthropic",
    name: "Anthropic Direct",
    description: "Acesso direto aos modelos Claude. Use se precisar de SLA dedicado.",
    logo: "AN",
    hasKey: false,
    status: "disconnected",
  },
  {
    id: "openai",
    name: "OpenAI Direct",
    description: "Acesso direto a GPT-4o e gpt-4o-mini. Útil para integrações específicas.",
    logo: "OA",
    hasKey: false,
    status: "disconnected",
  },
  {
    id: "google",
    name: "Google AI",
    description: "Gemini 2 Flash e Pro via Google AI Studio.",
    logo: "GO",
    hasKey: false,
    status: "disconnected",
  },
]

interface ModelCatalogItem {
  id: string
  provider: string
  name: string
  context: string
  costIn: string
  costOut: string
  speed: "fast" | "balanced" | "slow"
  enabled: boolean
}

const initialCatalog: ModelCatalogItem[] = [
  {
    id: "anthropic/claude-sonnet-4-6",
    provider: "Anthropic",
    name: "Claude Sonnet 4.6",
    context: "200K",
    costIn: "$3 / Mtok",
    costOut: "$15 / Mtok",
    speed: "balanced",
    enabled: true,
  },
  {
    id: "anthropic/claude-opus-4-7",
    provider: "Anthropic",
    name: "Claude Opus 4.7",
    context: "1M",
    costIn: "$15 / Mtok",
    costOut: "$75 / Mtok",
    speed: "slow",
    enabled: true,
  },
  {
    id: "anthropic/claude-haiku-4-5",
    provider: "Anthropic",
    name: "Claude Haiku 4.5",
    context: "200K",
    costIn: "$0.80 / Mtok",
    costOut: "$4 / Mtok",
    speed: "fast",
    enabled: true,
  },
  {
    id: "openai/gpt-4o",
    provider: "OpenAI",
    name: "GPT-4o",
    context: "128K",
    costIn: "$2.50 / Mtok",
    costOut: "$10 / Mtok",
    speed: "balanced",
    enabled: true,
  },
  {
    id: "openai/gpt-4o-mini",
    provider: "OpenAI",
    name: "GPT-4o mini",
    context: "128K",
    costIn: "$0.15 / Mtok",
    costOut: "$0.60 / Mtok",
    speed: "fast",
    enabled: false,
  },
  {
    id: "google/gemini-2-flash",
    provider: "Google",
    name: "Gemini 2 Flash",
    context: "1M",
    costIn: "$0.10 / Mtok",
    costOut: "$0.40 / Mtok",
    speed: "fast",
    enabled: false,
  },
]

const usageStats = {
  monthCost: 84.36,
  monthRequests: 18472,
  monthTokens: 12_640_000,
  budget: 200,
}

const speedTone: Record<ModelCatalogItem["speed"], string> = {
  fast: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  balanced: "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20",
  slow: "bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/20",
}

const speedLabel: Record<ModelCatalogItem["speed"], string> = {
  fast: "Rápido",
  balanced: "Balanceado",
  slow: "Detalhado",
}

export function ProvedoresSection() {
  const [providers, setProviders] = useState(initialProviders)
  const [catalog, setCatalog] = useState(initialCatalog)
  const [showKey, setShowKey] = useState<Record<string, boolean>>({})
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [draftKey, setDraftKey] = useState("")

  const usagePct = Math.round((usageStats.monthCost / usageStats.budget) * 100)

  function toggleKeyVisible(id: string) {
    setShowKey((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  function startEdit(id: string) {
    setEditingKey(id)
    setDraftKey("")
  }

  function saveKey(id: string) {
    setProviders((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              hasKey: true,
              status: "connected",
              keyMasked: `${draftKey.slice(0, 8)}•••••••••••••••••••••••••••${draftKey.slice(-4)}`,
            }
          : p
      )
    )
    setEditingKey(null)
    setDraftKey("")
  }

  function toggleModel(id: string) {
    setCatalog((prev) =>
      prev.map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m))
    )
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h3 className="font-display text-lg font-bold tracking-tight">
            Chaves & Modelos LLM
          </h3>
          <p className="text-sm text-muted-foreground">
            Configure providers de IA e habilite os modelos disponíveis para os agentes SDR.
          </p>
        </div>
        <Button className="btn-lift bg-gradient-to-r from-primary to-orange-600 text-primary-foreground shadow-md shadow-primary/10">
          Salvar configurações
        </Button>
      </header>

      {/* Usage strip */}
      <div className="grid gap-3 sm:grid-cols-4">
        <UsageTile
          icon={Wallet}
          label="Gasto este mês"
          value={`$ ${usageStats.monthCost.toFixed(2)}`}
          hint={`de $ ${usageStats.budget} limite`}
          progress={usagePct}
        />
        <UsageTile
          icon={Activity}
          label="Requests"
          value={usageStats.monthRequests.toLocaleString("pt-BR")}
          hint="últimos 30 dias"
        />
        <UsageTile
          icon={Sparkles}
          label="Tokens consumidos"
          value={`${(usageStats.monthTokens / 1_000_000).toFixed(2)}M`}
          hint="entrada + saída"
        />
        <UsageTile
          icon={Cpu}
          label="Modelos ativos"
          value={catalog.filter((m) => m.enabled).length.toString()}
          hint={`de ${catalog.length} no catálogo`}
        />
      </div>

      {/* Providers */}
      <div className="space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
          Providers de IA
        </p>
        {providers.map((p, i) => {
          const editing = editingKey === p.id
          const visible = showKey[p.id]
          return (
            <Card
              key={p.id}
              className={cn(
                "animate-card-in",
                `stagger-${Math.min(i + 1, 6)}`,
                p.recommended && !p.hasKey && "border-primary/30"
              )}
            >
              <CardContent className="p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
                  {/* Identity */}
                  <div className="flex items-start gap-3 lg:flex-1">
                    <div
                      className={cn(
                        "flex size-12 shrink-0 items-center justify-center rounded-xl font-display text-sm font-bold",
                        p.status === "connected"
                          ? "bg-gradient-to-br from-primary to-orange-600 text-primary-foreground shadow-sm shadow-primary/20"
                          : "bg-muted text-muted-foreground"
                      )}
                      aria-hidden
                    >
                      {p.logo}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-display text-[15px] font-semibold tracking-tight">
                          {p.name}
                        </h4>
                        {p.recommended && (
                          <Badge
                            variant="secondary"
                            className="bg-primary/10 text-primary border-primary/20 text-[10px]"
                          >
                            Recomendado
                          </Badge>
                        )}
                        {p.required && (
                          <Badge variant="secondary" className="text-[10px]">
                            Obrigatório
                          </Badge>
                        )}
                        {p.status === "connected" ? (
                          <Badge
                            variant="secondary"
                            className="gap-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 text-[10px]"
                          >
                            <span className="size-1.5 rounded-full bg-emerald-500 pulse-online" />
                            Conectado
                          </Badge>
                        ) : p.status === "error" ? (
                          <Badge
                            variant="secondary"
                            className="gap-1 bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20 text-[10px]"
                          >
                            <AlertCircle className="size-2.5" />
                            Erro
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-[10px]">
                            Desconectado
                          </Badge>
                        )}
                      </div>
                      <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
                        {p.description}
                      </p>
                    </div>
                  </div>

                  {/* Key field */}
                  <div className="lg:w-[420px] space-y-2">
                    <Label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                      <KeyRound className="size-3" />
                      API Key
                    </Label>
                    {editing ? (
                      <div className="space-y-2">
                        <div className="relative">
                          <Lock className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground/50" />
                          <Input
                            type={visible ? "text" : "password"}
                            value={draftKey}
                            onChange={(e) => setDraftKey(e.target.value)}
                            placeholder={
                              p.id === "openrouter"
                                ? "sk-or-v1-..."
                                : "Cole sua API key"
                            }
                            className="pl-9 pr-10 font-mono text-[12px]"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => toggleKeyVisible(p.id)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 transition-colors hover:text-foreground"
                            aria-label={
                              visible ? "Ocultar chave" : "Mostrar chave"
                            }
                          >
                            {visible ? (
                              <EyeOff className="size-3.5" />
                            ) : (
                              <Eye className="size-3.5" />
                            )}
                          </button>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            disabled={!draftKey}
                            onClick={() => saveKey(p.id)}
                            className="flex-1 bg-gradient-to-r from-primary to-orange-600 text-primary-foreground"
                          >
                            <Check className="mr-1.5 size-3.5" />
                            Validar e salvar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingKey(null)
                              setDraftKey("")
                            }}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : p.hasKey ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2">
                          <Lock className="size-3.5 shrink-0 text-muted-foreground/50" />
                          <code className="flex-1 truncate font-mono text-[11px] text-foreground/80">
                            {visible ? p.keyMasked : "••••••••••••••••••••••••••••••••••••"}
                          </code>
                          <button
                            type="button"
                            onClick={() => toggleKeyVisible(p.id)}
                            className="text-muted-foreground/40 transition-colors hover:text-foreground"
                            aria-label={
                              visible ? "Ocultar chave" : "Mostrar chave"
                            }
                          >
                            {visible ? (
                              <EyeOff className="size-3.5" />
                            ) : (
                              <Eye className="size-3.5" />
                            )}
                          </button>
                          <button
                            type="button"
                            className="text-muted-foreground/40 transition-colors hover:text-foreground"
                            aria-label="Copiar"
                          >
                            <Copy className="size-3.5" />
                          </button>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => startEdit(p.id)}
                          >
                            Substituir chave
                          </Button>
                          <Button size="sm" variant="ghost">
                            <RefreshCw className="size-3.5" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center justify-center rounded-lg border border-dashed border-border/60 px-3 py-3">
                          <span className="text-[11px] text-muted-foreground">
                            Nenhuma chave configurada
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="flex-1 bg-gradient-to-r from-primary to-orange-600 text-primary-foreground"
                            onClick={() => startEdit(p.id)}
                          >
                            <Plus className="mr-1.5 size-3.5" />
                            Adicionar chave
                          </Button>
                          <Button size="sm" variant="ghost" asChild>
                            <a href="#" aria-label="Abrir documentação">
                              <ExternalLink className="size-3.5" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* OpenRouter extra info */}
                {p.id === "openrouter" && p.hasKey && (
                  <div className="mt-4 grid gap-2 rounded-xl bg-primary/[0.03] border border-primary/10 p-3 sm:grid-cols-3">
                    <MicroStat
                      label="Saldo OpenRouter"
                      value="$ 116.42"
                      tone="text-emerald-600 dark:text-emerald-400"
                    />
                    <MicroStat
                      label="Limite mensal"
                      value="$ 200.00"
                    />
                    <MicroStat
                      label="Última request"
                      value="há 8s"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Model catalog */}
      <Card className="animate-card-in stagger-3">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Sparkles className="size-4" />
              </div>
              <div>
                <p className="font-display text-sm font-semibold tracking-tight">
                  Catálogo de modelos disponíveis
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Habilite os modelos que podem ser selecionados pelos agentes SDR.
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-1.5 size-3.5" />
              Sincronizar
            </Button>
          </div>

          <div className="space-y-1.5">
            {catalog.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors",
                  m.enabled
                    ? "border-border/60 bg-card/50"
                    : "border-border/30 bg-muted/20 opacity-60"
                )}
              >
                <Switch
                  checked={m.enabled}
                  onCheckedChange={() => toggleModel(m.id)}
                  aria-label={`Habilitar ${m.name}`}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[13px] font-medium">{m.name}</span>
                    <Badge variant="secondary" className="text-[10px]">
                      <Globe className="mr-1 size-2.5" />
                      {m.provider}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className={cn("text-[10px]", speedTone[m.speed])}
                    >
                      {speedLabel[m.speed]}
                    </Badge>
                  </div>
                  <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                    {m.id}
                  </p>
                </div>
                <div className="hidden gap-4 sm:flex">
                  <MicroStat label="Contexto" value={m.context} dense />
                  <MicroStat label="Input" value={m.costIn} dense />
                  <MicroStat label="Output" value={m.costOut} dense />
                </div>
              </div>
            ))}
          </div>

          <Separator />

          <div className="flex items-start gap-2 rounded-lg bg-primary/[0.04] border border-primary/10 px-3 py-2">
            <Sparkles className="mt-0.5 size-3.5 shrink-0 text-primary" />
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              <span className="font-medium text-foreground/80">
                Recomendação:
              </span>{" "}
              use Claude Haiku 4.5 ou GPT-4o mini para agentes de alto volume,
              e Claude Sonnet 4.6 quando precisar de raciocínio mais profundo
              em qualificação enterprise.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function UsageTile({
  icon: Icon,
  label,
  value,
  hint,
  progress,
}: {
  icon: typeof Wallet
  label: string
  value: string
  hint: string
  progress?: number
}) {
  const tone =
    progress != null
      ? progress >= 90
        ? "text-rose-600 dark:text-rose-400"
        : progress >= 70
          ? "text-amber-600 dark:text-amber-400"
          : "text-emerald-600 dark:text-emerald-400"
      : ""
  return (
    <div className="rounded-xl border border-border/60 bg-card/50 p-4 backdrop-blur-sm">
      <div className="flex items-start justify-between">
        <div className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-orange-500/10">
          <Icon className="size-4 text-primary" />
        </div>
        {progress != null && (
          <Badge
            variant="secondary"
            className={cn("font-display text-[10px]", tone)}
          >
            {progress}%
          </Badge>
        )}
      </div>
      <p className="mt-3 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
        {label}
      </p>
      <p className="font-display text-lg font-bold tracking-tight tabular-nums">
        {value}
      </p>
      <p className="text-[11px] text-muted-foreground/70">{hint}</p>
      {progress != null && (
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              "h-full transition-all",
              progress >= 90
                ? "bg-rose-500/70"
                : progress >= 70
                  ? "bg-amber-500/70"
                  : "bg-emerald-500/70"
            )}
            style={{ width: `${Math.min(progress, 100)}%` }}
            aria-hidden
          />
        </div>
      )}
    </div>
  )
}

function MicroStat({
  label,
  value,
  tone,
  dense,
}: {
  label: string
  value: string
  tone?: string
  dense?: boolean
}) {
  return (
    <div className={cn(dense ? "text-right" : "")}>
      <p className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground/70">
        {label}
      </p>
      <p
        className={cn(
          "font-display text-[12px] font-bold tabular-nums",
          tone
        )}
      >
        {value}
      </p>
    </div>
  )
}
