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
} from "lucide-react"
import { cn } from "@/lib/utils"

type Tone = "formal" | "consultivo" | "casual" | "direto"

const toneOptions: { id: Tone; label: string; hint: string }[] = [
  { id: "formal", label: "Formal", hint: "Corporativo, 3ª pessoa" },
  { id: "consultivo", label: "Consultivo", hint: "Especialista próximo" },
  { id: "casual", label: "Casual", hint: "Descontraído, 1ª pessoa" },
  { id: "direto", label: "Direto", hint: "Objetivo, sem floreio" },
]

const models = [
  {
    provider: "Anthropic",
    id: "claude-sonnet-4-6",
    name: "Claude Sonnet 4.6",
    badge: "Recomendado",
    note: "Raciocínio + custo equilibrado",
  },
  {
    provider: "Anthropic",
    id: "claude-opus-4-7",
    name: "Claude Opus 4.7",
    note: "Máxima qualidade",
  },
  {
    provider: "OpenAI",
    id: "gpt-4o",
    name: "GPT-4o",
    note: "Multimodal rápido",
  },
  {
    provider: "Google",
    id: "gemini-2-flash",
    name: "Gemini 2 Flash",
    note: "Alta latência baixa",
  },
]

const tonePreview: Record<Tone, string> = {
  formal:
    "Prezado Marcos, identifiquei potencial de otimização no processo comercial da Logibras. Gostaria de agendar uma apresentação?",
  consultivo:
    "Marcos, olhando o perfil da Logibras, vejo que vocês podem estar perdendo deals por tempo de resposta. Posso te mostrar como resolver em 15 min?",
  casual:
    "Oi Marcos! Bati o olho aqui e acho que temos algo que vai encaixar bastante na Logibras. Topa um papo rápido?",
  direto:
    "Marcos, tenho uma solução que reduz tempo de resposta em 60%. Topa 15 min esta semana?",
}

export function AgenteIaSection() {
  const [enabled, setEnabled] = useState(true)
  const [name, setName] = useState("Ana · SDR Virtual")
  const [objective, setObjective] = useState(
    "Qualificar leads inbound B2B com foco em decisores de operações e vendas. Extrair BANT completo e agendar reunião com closer quando score ≥ 80."
  )
  const [tone, setTone] = useState<Tone>("consultivo")
  const [model, setModel] = useState("claude-sonnet-4-6")
  const [temperature, setTemperature] = useState(0.5)
  const [instructions, setInstructions] = useState(
    "- Fale sempre em português do Brasil\n- Nunca prometa descontos sem validar com gestor\n- Se o lead perguntar sobre preço, responda 'depende do escopo, quer que eu agende 15 min pra te mostrar?'\n- Evite jargão técnico com contatos não-técnicos"
  )

  const [escalateOnPrice, setEscalateOnPrice] = useState(true)
  const [escalateOnComplaint, setEscalateOnComplaint] = useState(true)
  const [escalateAfterFailedAttempts, setEscalateAfterFailedAttempts] = useState(false)
  const [maxAutonomousMessages, setMaxAutonomousMessages] = useState(8)

  return (
    <div className="space-y-6">
      {/* Section header */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h3 className="font-display text-lg font-bold tracking-tight">
            Agente IA SDR
          </h3>
          <p className="text-sm text-muted-foreground">
            Agente autônomo que conduz o primeiro contato e qualificação via WhatsApp.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-card/50 px-3 py-2 backdrop-blur-sm">
            <span
              className={cn(
                "size-2 rounded-full",
                enabled
                  ? "bg-emerald-500 pulse-online"
                  : "bg-muted-foreground/40"
              )}
              aria-hidden
            />
            <Label
              htmlFor="agent-enabled"
              className="text-xs font-medium cursor-pointer"
            >
              {enabled ? "Agente ativo" : "Agente pausado"}
            </Label>
            <Switch
              id="agent-enabled"
              checked={enabled}
              onCheckedChange={setEnabled}
            />
          </div>
          <Button className="btn-lift bg-gradient-to-r from-primary to-orange-600 text-primary-foreground shadow-md shadow-primary/10">
            Salvar configuração
          </Button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        {/* Left: Forms */}
        <div className="space-y-5">
          {/* Identity card */}
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

          {/* Tone card */}
          <Card className="animate-card-in stagger-1">
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

          {/* Model card */}
          <Card className="animate-card-in stagger-2">
            <CardContent className="p-5 space-y-4">
              <SectionTitle
                icon={Cpu}
                label="Modelo de linguagem"
                hint="Provider e modelo que alimentam o agente"
              />

              <div className="grid gap-2">
                {models.map((m) => {
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
                  <Label htmlFor="temperature" className="flex items-center gap-2">
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
          <Card className="animate-card-in stagger-3">
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
                Use listas (-) ou frases curtas. Quanto mais específico, melhor.
              </p>
            </CardContent>
          </Card>

          {/* Escalation */}
          <Card className="animate-card-in stagger-4">
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
                  description="Transfere automaticamente quando lead pergunta sobre preço, desconto ou proposta formal."
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

        {/* Right: Sticky preview */}
        <aside className="space-y-3 lg:sticky lg:top-6 lg:self-start">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
              Preview do agente
            </p>
          </div>

          <Card className="animate-card-in">
            <CardContent className="space-y-4 p-4">
              {/* Agent identity preview */}
              <div className="flex items-center gap-3 rounded-xl bg-gradient-to-br from-primary/5 to-orange-500/5 p-3">
                <div className="relative flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-orange-600 shadow-sm shadow-primary/15">
                  <Flame className="size-5 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold">
                    {name}
                  </p>
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

              <div>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                  Exemplo de primeira abordagem
                </p>
                <div className="chat-bubble-in px-3 py-2.5 text-[12px] leading-relaxed text-foreground/90">
                  {tonePreview[tone]}
                </div>
              </div>

              <Separator />

              <div className="space-y-1.5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                  Configuração atual
                </p>
                <PreviewRow
                  label="Modelo"
                  value={models.find((m) => m.id === model)?.name ?? model}
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
      <Switch
        checked={checked}
        onCheckedChange={onChange}
        aria-label={title}
      />
    </div>
  )
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-[12px]">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}
