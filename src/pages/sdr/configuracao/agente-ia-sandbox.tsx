import { useState, useRef, useEffect } from "react"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Bot,
  User,
  Send,
  RotateCcw,
  Sparkles,
  Activity,
  Target,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AgentConfig {
  name: string
  initialMessage: string
  destinationFunnel: string
}

interface ChatMessage {
  id: string
  from: "agent" | "lead" | "system"
  text: string
  timestamp: string
  meta?: {
    captured?: { field: string; value: string; confidence: number }
    scoreUpdate?: { from: number; to: number }
    action?: string
  }
}

interface BantState {
  budget: { captured: boolean; value?: string }
  authority: { captured: boolean; value?: string }
  need: { captured: boolean; value?: string }
  timeline: { captured: boolean; value?: string }
}

const seedConversation: ChatMessage[] = [
  {
    id: "m1",
    from: "agent",
    text: "Oi Marcos! 👋 Aqui é a Ana da Tech Vendas. Vi que você se interessou pela nossa solução. Topa um papo rápido pra eu entender melhor a Logibras?",
    timestamp: "10:42",
  },
]

const suggestedReplies = [
  "Topa sim, pode falar",
  "Quanto custa?",
  "Quem decide aqui sou eu mesmo",
  "Estamos com orçamento apertado esse mês",
  "Não tô interessado",
]

// Simple keyword-based response engine (mock)
function generateResponse(
  userText: string,
  _bant: BantState
): { text: string; meta?: ChatMessage["meta"]; bantUpdate?: Partial<BantState>; scoreUpdate?: number } {
  const lower = userText.toLowerCase()

  if (lower.includes("preço") || lower.includes("preco") || lower.includes("custa") || lower.includes("valor")) {
    return {
      text:
        "Entendo a curiosidade! O valor depende do tamanho da operação e dos módulos. Antes de falar de preço, me ajuda com 2 coisas: quantos vendedores vocês têm hoje e qual o principal desafio do comercial?",
      meta: { action: "Resposta padrão para pricing — pivota para qualificação" },
    }
  }

  if (lower.includes("decisor") || lower.includes("decido") || lower.includes("dono") || lower.includes("eu mesmo")) {
    return {
      text:
        "Perfeito Marcos, isso facilita bastante. E me conta: qual o principal desafio comercial que vocês querem resolver agora?",
      meta: {
        captured: {
          field: "lead.decisionMaker",
          value: "Sim — é decisor",
          confidence: 92,
        },
        scoreUpdate: { from: 45, to: 62 },
      },
      bantUpdate: { authority: { captured: true, value: "Decisor" } },
      scoreUpdate: 17,
    }
  }

  if (
    lower.includes("orçamento") ||
    lower.includes("orcamento") ||
    lower.includes("apertado") ||
    lower.includes("dinheiro")
  ) {
    return {
      text:
        "Entendo. Sem stress — temos clientes começando a partir de R$ 397/mês. Mais importante: vocês têm potencial de fechar leads suficiente que justificaria um sistema novo? Quantos leads chegam hoje por mês?",
      meta: {
        captured: {
          field: "lead.budgetSignal",
          value: "Cauteloso — investigar volume",
          confidence: 70,
        },
      },
      bantUpdate: { budget: { captured: true, value: "Sensível, investigar ROI" } },
      scoreUpdate: 8,
    }
  }

  if (lower.includes("topa") || lower.includes("pode falar") || lower.includes("ok") || lower.includes("vamos")) {
    return {
      text:
        "Show! Me conta rapidinho: qual o principal desafio hoje no comercial da Logibras? O que tira seu sono?",
      meta: { action: "Iniciando qualificação — Need" },
    }
  }

  if (
    lower.includes("não") &&
    (lower.includes("interess") || lower.includes("quero"))
  ) {
    return {
      text:
        "Sem problema, Marcos. Posso te perguntar só uma coisa: já tem outra ferramenta resolvendo isso ou hoje vocês tocam o comercial sem CRM mesmo?",
      meta: {
        action: "Tentativa de salvar a conversa — investigar concorrente",
      },
    }
  }

  if (lower.includes("vendedor") || lower.includes("vendedora") || /\d+/.test(lower)) {
    const match = lower.match(/(\d+)/)
    const num = match ? Number(match[1]) : null
    return {
      text:
        num && num >= 5
          ? `Perfeito, ${num} vendedores. Esse é exatamente o tamanho de operação que ganha mais com nossa plataforma. Posso agendar 15 min com nosso especialista pra te mostrar como funciona?`
          : "Entendido! E em quanto tempo vocês gostariam de implementar uma solução dessas?",
      meta: {
        captured: {
          field: "lead.teamSize",
          value: match ? `${match[1]} pessoas` : "—",
          confidence: 88,
        },
        scoreUpdate:
          num && num >= 5 ? { from: 70, to: 88 } : { from: 60, to: 68 },
      },
      bantUpdate:
        num && num >= 5
          ? {
              need: {
                captured: true,
                value: `Equipe de ${num} vendedores — fit ideal`,
              },
            }
          : {},
      scoreUpdate: num && num >= 5 ? 18 : 8,
    }
  }

  return {
    text:
      "Entendi. Só pra eu te ajudar melhor: qual seu principal desafio hoje no comercial?",
    meta: { action: "Pergunta aberta — explorar" },
  }
}

const initialBant: BantState = {
  budget: { captured: false },
  authority: { captured: false },
  need: { captured: false },
  timeline: { captured: false },
}

export function AgenteIaSandbox({ agent }: { agent: AgentConfig }) {
  const [messages, setMessages] = useState<ChatMessage[]>(seedConversation)
  const [bant, setBant] = useState<BantState>(initialBant)
  const [score, setScore] = useState(45)
  const [input, setInput] = useState("")
  const [isThinking, setIsThinking] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [messages, isThinking])

  function timeNow() {
    const d = new Date()
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
  }

  function send(textOverride?: string) {
    const text = textOverride ?? input.trim()
    if (!text || isThinking) return

    const leadMsg: ChatMessage = {
      id: `m${Date.now()}`,
      from: "lead",
      text,
      timestamp: timeNow(),
    }
    setMessages((prev) => [...prev, leadMsg])
    setInput("")
    setIsThinking(true)

    // Simulate AI delay
    window.setTimeout(() => {
      const result = generateResponse(text, bant)
      const agentMsg: ChatMessage = {
        id: `m${Date.now() + 1}`,
        from: "agent",
        text: result.text,
        timestamp: timeNow(),
        meta: result.meta,
      }
      setMessages((prev) => [...prev, agentMsg])

      if (result.bantUpdate) {
        setBant((prev) => ({ ...prev, ...result.bantUpdate }))
      }
      if (result.scoreUpdate) {
        setScore((prev) => Math.min(100, prev + result.scoreUpdate!))
      }
      setIsThinking(false)
    }, 900)
  }

  function reset() {
    setMessages(seedConversation)
    setBant(initialBant)
    setScore(45)
    setInput("")
  }

  const bantPct =
    (Object.values(bant).filter((b) => b.captured).length / 4) * 100

  const tier =
    score >= 80
      ? { label: "HOT", tone: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20" }
      : score >= 60
        ? { label: "WARM", tone: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20" }
        : score >= 40
          ? { label: "COLD", tone: "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20" }
          : { label: "DEAD", tone: "bg-muted text-muted-foreground border-border" }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 rounded-xl bg-primary/[0.04] border border-primary/10 px-4 py-3">
        <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
        <div className="flex-1">
          <p className="text-[13px] font-medium">Sandbox de teste</p>
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            Converse como se fosse um lead real. As respostas são simuladas com
            base na configuração atual do agente, sem custo de API. Use para
            validar tom, qualificação e gatilhos antes de ativar em produção.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={reset}>
          <RotateCcw className="mr-1.5 size-3.5" />
          Reiniciar
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Chat */}
        <Card className="animate-card-in overflow-hidden">
          <CardContent className="flex h-[560px] flex-col p-0">
            {/* Chat header */}
            <div className="flex items-center gap-3 border-b border-border/60 bg-card/50 px-4 py-3">
              <div className="relative flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-orange-600 shadow-sm shadow-primary/15">
                <Bot className="size-4 text-white" />
                <span
                  className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-500 ring-2 ring-card pulse-online"
                  aria-label="Online"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold">
                  {agent.name}
                </p>
                <div className="flex items-center gap-1.5">
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary border-primary/20 text-[9px]"
                  >
                    Modo teste
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">
                    Lead simulado: Marcos · Logibras
                  </span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 space-y-3 overflow-y-auto bg-[oklch(0.94_0.01_100)] dark:bg-[oklch(0.12_0.008_55)] p-4"
            >
              {messages.map((m) => {
                if (m.from === "system") {
                  return (
                    <div key={m.id} className="flex justify-center">
                      <Badge variant="secondary" className="text-[10px]">
                        {m.text}
                      </Badge>
                    </div>
                  )
                }
                const isAgent = m.from === "agent"
                return (
                  <div key={m.id} className="space-y-1.5">
                    <div
                      className={cn(
                        "flex gap-2",
                        isAgent ? "justify-start" : "justify-end"
                      )}
                    >
                      {isAgent && (
                        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-orange-600 text-primary-foreground">
                          <Bot className="size-3.5" />
                        </div>
                      )}
                      <div
                        className={cn(
                          "max-w-[80%] rounded-2xl px-3 py-2 text-[13px] leading-relaxed shadow-sm",
                          isAgent
                            ? "rounded-bl-md bg-card text-foreground/90"
                            : "rounded-br-md bg-[oklch(0.88_0.08_155)] dark:bg-[oklch(0.25_0.07_155)] text-foreground/90"
                        )}
                      >
                        {m.text}
                        <p className="mt-1 text-right text-[9px] text-muted-foreground/70">
                          {m.timestamp}
                        </p>
                      </div>
                      {!isAgent && (
                        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                          <User className="size-3.5" />
                        </div>
                      )}
                    </div>

                    {/* Meta annotations */}
                    {m.meta && (
                      <div
                        className={cn(
                          "flex flex-col gap-1",
                          isAgent ? "ml-9" : "mr-9 items-end"
                        )}
                      >
                        {m.meta.captured && (
                          <div className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/[0.08] border border-emerald-500/20 px-2 py-1 text-[10px]">
                            <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" />
                            <span className="text-muted-foreground">
                              Capturado:
                            </span>
                            <span className="font-mono font-medium text-foreground/80">
                              {m.meta.captured.field}
                            </span>
                            <span className="text-muted-foreground">→</span>
                            <span className="font-medium text-foreground/80">
                              "{m.meta.captured.value}"
                            </span>
                            <Badge
                              variant="secondary"
                              className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 text-[9px]"
                            >
                              {m.meta.captured.confidence}%
                            </Badge>
                          </div>
                        )}
                        {m.meta.scoreUpdate && (
                          <div className="inline-flex items-center gap-1.5 rounded-lg bg-primary/[0.08] border border-primary/20 px-2 py-1 text-[10px]">
                            <TrendingUp className="size-3 text-primary" />
                            <span className="text-muted-foreground">Score:</span>
                            <span className="font-mono tabular-nums text-muted-foreground/70">
                              {m.meta.scoreUpdate.from}
                            </span>
                            <span className="text-muted-foreground">→</span>
                            <span className="font-display font-bold tabular-nums text-primary">
                              {m.meta.scoreUpdate.to}
                            </span>
                          </div>
                        )}
                        {m.meta.action && (
                          <div className="inline-flex items-center gap-1.5 rounded-lg bg-muted/50 border border-border/40 px-2 py-1 text-[10px] text-muted-foreground italic">
                            <Activity className="size-3" />
                            {m.meta.action}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}

              {isThinking && (
                <div className="flex gap-2">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-orange-600 text-primary-foreground">
                    <Bot className="size-3.5" />
                  </div>
                  <div className="rounded-2xl rounded-bl-md bg-card px-3 py-2 shadow-sm">
                    <div className="flex gap-1">
                      <span
                        className="size-1.5 animate-pulse rounded-full bg-muted-foreground/60"
                        style={{ animationDelay: "0ms" }}
                      />
                      <span
                        className="size-1.5 animate-pulse rounded-full bg-muted-foreground/60"
                        style={{ animationDelay: "150ms" }}
                      />
                      <span
                        className="size-1.5 animate-pulse rounded-full bg-muted-foreground/60"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Suggested replies */}
            <div className="flex flex-wrap gap-1.5 border-t border-border/60 bg-card/30 px-3 py-2">
              {suggestedReplies.slice(0, 4).map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  disabled={isThinking}
                  className="rounded-full border border-border/60 bg-card px-2.5 py-1 text-[11px] text-muted-foreground transition-all hover:border-primary/30 hover:text-foreground disabled:opacity-50"
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Composer */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                send()
              }}
              className="flex gap-2 border-t border-border/60 bg-card/50 p-3"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Responda como se fosse o lead…"
                disabled={isThinking}
                className="flex-1"
                aria-label="Mensagem do lead simulado"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || isThinking}
                className="bg-gradient-to-r from-primary to-orange-600 text-primary-foreground"
                aria-label="Enviar"
              >
                <Send className="size-4" />
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* State panel */}
        <aside className="space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
            Estado do lead em tempo real
          </p>

          {/* Score card */}
          <Card className="animate-card-in stagger-1">
            <CardContent className="p-4 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Score atual
              </p>
              <p className="font-display text-4xl font-bold tracking-tight text-gradient tabular-nums mt-1">
                {score}
              </p>
              <Badge
                variant="secondary"
                className={cn("mt-2 text-[10px]", tier.tone)}
              >
                {tier.label}
              </Badge>
            </CardContent>
          </Card>

          {/* BANT progress */}
          <Card className="animate-card-in stagger-2">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="size-3.5 text-primary" />
                  <p className="text-[11px] font-semibold uppercase tracking-wider">
                    BANT capturado
                  </p>
                </div>
                <span className="font-display text-xs font-bold tabular-nums">
                  {Math.round(bantPct)}%
                </span>
              </div>
              <div className="space-y-1.5">
                {(
                  [
                    { key: "budget", label: "Budget" },
                    { key: "authority", label: "Authority" },
                    { key: "need", label: "Need" },
                    { key: "timeline", label: "Timeline" },
                  ] as const
                ).map((b) => {
                  const captured = bant[b.key].captured
                  return (
                    <div
                      key={b.key}
                      className={cn(
                        "flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-[11px]",
                        captured
                          ? "border-emerald-500/20 bg-emerald-500/[0.04]"
                          : "border-border/40 bg-muted/20"
                      )}
                    >
                      {captured ? (
                        <CheckCircle2 className="size-3 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <span className="size-3 shrink-0 rounded-full border border-dashed border-muted-foreground/40" />
                      )}
                      <span
                        className={cn(
                          "font-medium",
                          captured
                            ? "text-foreground/80"
                            : "text-muted-foreground"
                        )}
                      >
                        {b.label}
                      </span>
                      {captured && bant[b.key].value && (
                        <span className="ml-auto truncate text-[10px] italic text-muted-foreground">
                          {bant[b.key].value}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Next action */}
          <Card className="animate-card-in stagger-3">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Zap className="size-3.5 text-primary" />
                <p className="text-[11px] font-semibold uppercase tracking-wider">
                  Próxima ação automática
                </p>
              </div>
              <Separator />
              {score >= 80 ? (
                <div className="flex items-start gap-2 rounded-lg bg-emerald-500/[0.06] border border-emerald-500/20 px-2.5 py-2">
                  <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <p className="text-[11px] leading-relaxed text-foreground/80">
                    Score atingiu threshold de handoff. Lead seria enviado para
                    fila do{" "}
                    <span className="font-semibold">
                      {agent.destinationFunnel}
                    </span>
                    .
                  </p>
                </div>
              ) : score >= 60 ? (
                <div className="flex items-start gap-2 rounded-lg bg-amber-500/[0.06] border border-amber-500/20 px-2.5 py-2">
                  <Activity className="mt-0.5 size-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                  <p className="text-[11px] leading-relaxed text-foreground/80">
                    Continuar qualificando — faltam dados BANT para handoff.
                  </p>
                </div>
              ) : (
                <div className="flex items-start gap-2 rounded-lg bg-sky-500/[0.06] border border-sky-500/20 px-2.5 py-2">
                  <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-sky-600 dark:text-sky-400" />
                  <p className="text-[11px] leading-relaxed text-foreground/80">
                    Score baixo — agente vai investigar mais antes de decidir.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}
