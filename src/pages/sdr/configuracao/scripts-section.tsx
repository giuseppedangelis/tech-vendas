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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Plus,
  GripVertical,
  Edit3,
  Trash2,
  Bot,
  User,
  Target,
  DollarSign,
  Shield,
  Zap,
  CalendarClock,
  HelpCircle,
  Sparkles,
  CheckCircle2,
} from "lucide-react"
import { cn } from "@/lib/utils"

type Framework = "bant" | "spin" | "def"

const frameworks: {
  id: Framework
  name: string
  subtitle: string
  description: string
}[] = [
  {
    id: "bant",
    name: "BANT",
    subtitle: "Budget · Authority · Need · Timeline",
    description:
      "Qualificação clássica por 4 dimensões — ideal para vendas B2B estruturadas.",
  },
  {
    id: "spin",
    name: "SPIN",
    subtitle: "Situation · Problem · Implication · Need-Payoff",
    description:
      "Abordagem consultiva, guia o lead a descobrir o próprio problema.",
  },
  {
    id: "def",
    name: "DEF",
    subtitle: "Metodologia proprietária Tech Vendas",
    description:
      "Framework híbrido desenvolvido internamente para alta conversão.",
  },
]

interface QuestionDef {
  id: string
  order: number
  category: "budget" | "authority" | "need" | "timeline"
  question: string
  mappedField: string
  minConfidence: number
  required: boolean
}

const initialQuestions: QuestionDef[] = [
  {
    id: "q1",
    order: 1,
    category: "need",
    question:
      "Me conta rapidinho: qual o principal desafio hoje no comercial da {{empresa}}?",
    mappedField: "lead.painPoint",
    minConfidence: 70,
    required: true,
  },
  {
    id: "q2",
    order: 2,
    category: "authority",
    question:
      "Legal! E essa decisão de contratar uma solução nova, passa só por você ou envolve outras pessoas?",
    mappedField: "lead.decisionMaker",
    minConfidence: 60,
    required: true,
  },
  {
    id: "q3",
    order: 3,
    category: "budget",
    question:
      "Vocês já têm orçamento previsto para esse tipo de investimento nos próximos 90 dias?",
    mappedField: "lead.budgetRange",
    minConfidence: 60,
    required: true,
  },
  {
    id: "q4",
    order: 4,
    category: "timeline",
    question:
      "Se tudo fizer sentido na nossa conversa, em quanto tempo vocês gostariam de começar a usar?",
    mappedField: "lead.timelineToStart",
    minConfidence: 50,
    required: false,
  },
]

const categoryMeta: Record<
  QuestionDef["category"],
  { label: string; icon: typeof DollarSign; tone: string }
> = {
  budget: {
    label: "Budget",
    icon: DollarSign,
    tone: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  },
  authority: {
    label: "Authority",
    icon: Shield,
    tone: "bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/20",
  },
  need: {
    label: "Need",
    icon: Zap,
    tone: "bg-primary/10 text-primary border-primary/20",
  },
  timeline: {
    label: "Timeline",
    icon: CalendarClock,
    tone: "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20",
  },
}

const simulatedChat = [
  { from: "sdr", text: "Oi Marcos, tudo bem? Aqui é a Ana da Tech Vendas." },
  {
    from: "lead",
    text: "Opa, tudo. Tô sim, me conta o que vocês fazem?",
  },
  {
    from: "sdr",
    text:
      "Antes disso, me ajuda com uma coisa: qual o principal desafio hoje no comercial da Logibras?",
    highlight: "q1",
  },
  {
    from: "lead",
    text:
      "Tá difícil fechar. A equipe tá respondendo devagar e perdendo lead pra concorrente.",
  },
  {
    from: "ai",
    text:
      "✓ Need capturado: resposta lenta + perda para concorrente · confiança 86%",
  },
]

export function ScriptsSection() {
  const [framework, setFramework] = useState<Framework>("bant")
  const [questions, setQuestions] = useState(initialQuestions)

  function toggleRequired(id: string) {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, required: !q.required } : q))
    )
  }

  function completionThreshold() {
    const required = questions.filter((q) => q.required).length
    return Math.round((required / questions.length) * 100)
  }

  return (
    <div className="space-y-6">
      {/* Section header */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h3 className="font-display text-lg font-bold tracking-tight">
            Scripts de Qualificação
          </h3>
          <p className="text-sm text-muted-foreground">
            Defina perguntas e framework usado pela IA e pelo SDR durante a
            qualificação.
          </p>
        </div>
        <Button className="btn-lift bg-gradient-to-r from-primary to-orange-600 text-primary-foreground shadow-md shadow-primary/10">
          Salvar script
        </Button>
      </header>

      {/* Framework selector */}
      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
          Framework ativo
        </p>
        <div
          className="grid gap-3 sm:grid-cols-3"
          role="radiogroup"
          aria-label="Selecionar framework"
        >
          {frameworks.map((fw) => {
            const active = framework === fw.id
            return (
              <button
                key={fw.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setFramework(fw.id)}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border px-4 py-3.5 text-left transition-all duration-200",
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
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "font-display text-base font-bold tracking-tight",
                          active && "text-primary"
                        )}
                      >
                        {fw.name}
                      </span>
                      {active && (
                        <CheckCircle2 className="size-4 text-primary" />
                      )}
                    </div>
                    <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground/70">
                      {fw.subtitle}
                    </p>
                  </div>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {fw.description}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Two-column: questions + preview */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        {/* Questions list */}
        <Card className="animate-card-in">
          <CardContent className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h4 className="font-display text-sm font-semibold">
                  Perguntas da sequência
                </h4>
                <p className="text-xs text-muted-foreground">
                  A IA faz na ordem abaixo. Arraste para reordenar.
                </p>
              </div>
              <Button variant="outline" size="sm">
                <Plus className="mr-1.5 size-3.5" />
                Pergunta
              </Button>
            </div>

            <ol className="space-y-3">
              {questions.map((q) => {
                const meta = categoryMeta[q.category]
                return (
                  <li
                    key={q.id}
                    className="group flex gap-3 rounded-xl border border-border/60 bg-card/80 p-3.5 transition-colors hover:border-primary/20"
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
                        {q.order}
                      </div>
                    </div>

                    <div className="min-w-0 flex-1 space-y-2.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Badge
                          variant="secondary"
                          className={cn("gap-1 text-[10px]", meta.tone)}
                        >
                          <meta.icon className="size-2.5" />
                          {meta.label}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="gap-1 text-[10px] bg-muted/50"
                        >
                          <Target className="size-2.5" />
                          {q.mappedField}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="text-[10px] bg-muted/50"
                        >
                          Min confiança: {q.minConfidence}%
                        </Badge>
                      </div>

                      <p className="text-[13px] leading-relaxed text-foreground/90">
                        "{q.question}"
                      </p>

                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Switch
                            checked={q.required}
                            onCheckedChange={() => toggleRequired(q.id)}
                            aria-label={`Pergunta obrigatória: ${q.question.slice(0, 30)}`}
                          />
                          <span>Obrigatória para handoff</span>
                        </label>
                        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                            aria-label="Editar pergunta"
                          >
                            <Edit3 className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 hover:text-destructive"
                            aria-label="Remover pergunta"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ol>

            <Separator className="my-4" />

            {/* Completion rule */}
            <div className="flex flex-col gap-3 rounded-xl bg-muted/30 p-3.5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <HelpCircle className="size-4" />
                </div>
                <div>
                  <p className="text-[13px] font-medium">
                    Critério de conclusão
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Lead é considerado qualificado quando respostas obrigatórias
                    são capturadas com confiança mínima.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Select defaultValue="all-required">
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-required">
                      Todas obrigatórias
                    </SelectItem>
                    <SelectItem value="three-of-four">
                      3 de 4 respondidas
                    </SelectItem>
                    <SelectItem value="score-based">
                      Score {">="} threshold
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary border-primary/20 font-display"
                >
                  {completionThreshold()}% coberto
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preview — simulated conversation */}
        <aside className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
              Simulação em tempo real
            </p>
          </div>

          <Card className="animate-card-in stagger-2">
            <CardContent className="space-y-3 p-4">
              {simulatedChat.map((m, i) => {
                if (m.from === "ai") {
                  return (
                    <div
                      key={i}
                      className="flex items-start gap-2 rounded-lg bg-primary/[0.04] border border-primary/10 px-3 py-2"
                    >
                      <Bot className="mt-0.5 size-3.5 shrink-0 text-primary" />
                      <p className="text-[11px] leading-relaxed text-primary font-medium">
                        {m.text}
                      </p>
                    </div>
                  )
                }
                const isSdr = m.from === "sdr"
                return (
                  <div
                    key={i}
                    className={cn(
                      "flex gap-2",
                      isSdr ? "justify-end" : "justify-start"
                    )}
                  >
                    {!isSdr && (
                      <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-muted-foreground">
                        <User className="size-3" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "max-w-[82%] rounded-xl px-3 py-2 text-[12px] leading-relaxed",
                        isSdr
                          ? "chat-bubble-out"
                          : "chat-bubble-in text-foreground/85"
                      )}
                    >
                      {m.text}
                    </div>
                    {isSdr && (
                      <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-orange-600 text-primary-foreground">
                        <Bot className="size-3" />
                      </div>
                    )}
                  </div>
                )
              })}
            </CardContent>
          </Card>

          <p className="text-[11px] leading-relaxed text-muted-foreground/70">
            Dados capturados alimentam os campos do lead em tempo real e
            atualizam o score de qualificação.
          </p>
        </aside>
      </div>
    </div>
  )
}
