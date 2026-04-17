import { useMemo, useState } from "react"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Target,
  Flame,
  Thermometer,
  Snowflake,
  SkullIcon,
  TrendingUp,
  Info,
  Gauge,
  DollarSign,
  MessageSquare,
  ClipboardCheck,
  RotateCcw,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"

type WeightKey = "value" | "engagement" | "qualification"

const componentMeta: Record<
  WeightKey,
  { label: string; icon: typeof DollarSign; tone: string; description: string }
> = {
  value: {
    label: "Valor",
    icon: DollarSign,
    tone: "text-emerald-600 dark:text-emerald-400",
    description:
      "Tamanho da empresa, receita estimada e potencial de ARR/ticket médio.",
  },
  engagement: {
    label: "Engajamento",
    icon: MessageSquare,
    tone: "text-sky-600 dark:text-sky-400",
    description:
      "Velocidade e frequência de resposta, cliques, visualizações e interações.",
  },
  qualification: {
    label: "Qualificação",
    icon: ClipboardCheck,
    tone: "text-primary",
    description:
      "Respostas ao framework BANT/SPIN capturadas com confiança suficiente.",
  },
}

type Tier = {
  id: "hot" | "warm" | "cold" | "luke" | "dead"
  label: string
  icon: typeof Flame
  tone: string
  badgeClass: string
  action: string
}

const baseTiers: Tier[] = [
  {
    id: "hot",
    label: "HOT",
    icon: Flame,
    tone: "text-rose-600 dark:text-rose-400",
    badgeClass:
      "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20",
    action: "Handoff imediato para closer · agenda reunião",
  },
  {
    id: "warm",
    label: "WARM",
    icon: TrendingUp,
    tone: "text-amber-600 dark:text-amber-400",
    badgeClass:
      "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
    action: "Continuar cadência · qualificar gaps restantes",
  },
  {
    id: "cold",
    label: "COLD",
    icon: Thermometer,
    tone: "text-sky-600 dark:text-sky-400",
    badgeClass:
      "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20",
    action: "Manter contato · próxima mensagem da cadência",
  },
  {
    id: "luke",
    label: "LUKE WARM",
    icon: Snowflake,
    tone: "text-slate-500",
    badgeClass: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
    action: "Avaliar reativação ou mover para desqualificação",
  },
  {
    id: "dead",
    label: "DEAD",
    icon: SkullIcon,
    tone: "text-muted-foreground",
    badgeClass: "bg-muted text-muted-foreground border-border",
    action: "Arquivar ou enviar para reativação futura",
  },
]

export function ScoringSection() {
  // Weights — always sum to 100
  const [weights, setWeights] = useState<Record<WeightKey, number>>({
    value: 30,
    engagement: 40,
    qualification: 30,
  })

  // Thresholds — sorted ascending
  const [thresholds, setThresholds] = useState({
    dead: 20,
    luke: 40,
    cold: 60,
    warm: 80,
  })

  // Simulator inputs
  const [sim, setSim] = useState({ value: 75, engagement: 65, qualification: 80 })

  const finalScore = useMemo(() => {
    return Math.round(
      (sim.value * weights.value) / 100 +
        (sim.engagement * weights.engagement) / 100 +
        (sim.qualification * weights.qualification) / 100
    )
  }, [sim, weights])

  const currentTier = useMemo<Tier>(() => {
    if (finalScore >= thresholds.warm) return baseTiers[0]
    if (finalScore >= thresholds.cold) return baseTiers[1]
    if (finalScore >= thresholds.luke) return baseTiers[2]
    if (finalScore >= thresholds.dead) return baseTiers[3]
    return baseTiers[4]
  }, [finalScore, thresholds])

  function changeWeight(key: WeightKey, next: number) {
    // Constrain sum to 100 by redistributing proportionally across the other keys
    const clamped = Math.max(0, Math.min(100, Math.round(next)))
    const others = (Object.keys(weights) as WeightKey[]).filter((k) => k !== key)
    const remaining = 100 - clamped
    const otherSum = others.reduce((acc, k) => acc + weights[k], 0)

    const updated = { ...weights, [key]: clamped }
    if (otherSum === 0) {
      const equal = Math.floor(remaining / others.length)
      others.forEach((k, i) => {
        updated[k] = i === others.length - 1 ? remaining - equal * (others.length - 1) : equal
      })
    } else {
      others.forEach((k, i) => {
        const proportion = weights[k] / otherSum
        if (i === others.length - 1) {
          updated[k] =
            remaining -
            others
              .slice(0, -1)
              .reduce((acc, kk) => acc + updated[kk], 0)
        } else {
          updated[k] = Math.max(0, Math.round(remaining * proportion))
        }
      })
    }
    setWeights(updated)
  }

  function resetWeights() {
    setWeights({ value: 30, engagement: 40, qualification: 30 })
  }

  const total =
    weights.value + weights.engagement + weights.qualification

  return (
    <div className="space-y-6">
      {/* Section header */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h3 className="font-display text-lg font-bold tracking-tight">
            Lead Scoring
          </h3>
          <p className="text-sm text-muted-foreground">
            Configure a fórmula de score e os gatilhos automáticos de handoff e
            desqualificação.
          </p>
        </div>
        <Button className="btn-lift bg-gradient-to-r from-primary to-orange-600 text-primary-foreground shadow-md shadow-primary/10">
          Salvar fórmula
        </Button>
      </header>

      {/* Formula card */}
      <Card className="animate-card-in">
        <CardContent className="p-5 space-y-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Gauge className="size-4" />
              </div>
              <div>
                <p className="font-display text-sm font-semibold tracking-tight">
                  Fórmula de cálculo
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Pesos devem somar 100% — ajuste um e os outros redistribuem.
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={resetWeights}>
              <RotateCcw className="mr-1.5 size-3.5" />
              Restaurar padrão
            </Button>
          </div>

          {/* Formula visualization */}
          <div className="rounded-xl bg-muted/30 p-4">
            <div className="mb-3 flex flex-wrap items-center justify-center gap-2 font-display text-sm font-medium">
              <span className="text-muted-foreground">Score =</span>
              {(Object.keys(weights) as WeightKey[]).map((k, i) => {
                const meta = componentMeta[k]
                return (
                  <span key={k} className="flex items-center gap-2">
                    {i > 0 && <span className="text-muted-foreground">+</span>}
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-lg bg-card px-2.5 py-1 shadow-sm",
                        meta.tone
                      )}
                    >
                      <meta.icon className="size-3.5" />
                      {meta.label}
                      <span className="ml-1 rounded-md bg-current/10 px-1.5 py-0.5 text-xs tabular-nums">
                        × {weights[k]}%
                      </span>
                    </span>
                  </span>
                )
              })}
            </div>

            {/* Composition bar */}
            <div className="relative h-3 overflow-hidden rounded-full bg-muted">
              <div
                className="absolute inset-y-0 left-0 bg-emerald-500/70 transition-all duration-300"
                style={{ width: `${weights.value}%` }}
                aria-hidden
              />
              <div
                className="absolute inset-y-0 bg-sky-500/70 transition-all duration-300"
                style={{
                  left: `${weights.value}%`,
                  width: `${weights.engagement}%`,
                }}
                aria-hidden
              />
              <div
                className="absolute inset-y-0 bg-primary/80 transition-all duration-300"
                style={{
                  left: `${weights.value + weights.engagement}%`,
                  width: `${weights.qualification}%`,
                }}
                aria-hidden
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-[10px] font-medium uppercase tracking-wider">
              <span className="text-emerald-600 dark:text-emerald-400">
                {weights.value}% Valor
              </span>
              <span className="text-sky-600 dark:text-sky-400">
                {weights.engagement}% Engajamento
              </span>
              <span className="text-primary">
                {weights.qualification}% Qualificação
              </span>
            </div>
            {total !== 100 && (
              <p className="mt-2 text-center text-[10px] text-amber-600 dark:text-amber-400">
                Soma atual: {total}% · ajustando…
              </p>
            )}
          </div>

          {/* Weight sliders */}
          <div className="grid gap-4 sm:grid-cols-3">
            {(Object.keys(weights) as WeightKey[]).map((k) => {
              const meta = componentMeta[k]
              return (
                <div
                  key={k}
                  className="space-y-2 rounded-xl border border-border/60 bg-card/50 p-3.5"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "flex size-7 items-center justify-center rounded-md bg-current/10",
                          meta.tone
                        )}
                        aria-hidden
                      >
                        <meta.icon className="size-3.5" />
                      </div>
                      <span className="text-[13px] font-medium">
                        {meta.label}
                      </span>
                    </div>
                    <Badge
                      variant="secondary"
                      className="font-display font-bold tabular-nums"
                    >
                      {weights[k]}%
                    </Badge>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={weights[k]}
                    onChange={(e) => changeWeight(k, Number(e.target.value))}
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary"
                    aria-label={`Peso ${meta.label}`}
                  />
                  <p className="text-[11px] leading-snug text-muted-foreground">
                    {meta.description}
                  </p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Thresholds + Simulator */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* Thresholds */}
        <Card className="animate-card-in stagger-1">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Target className="size-4" />
              </div>
              <div>
                <p className="font-display text-sm font-semibold tracking-tight">
                  Faixas e gatilhos
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Cada faixa define a próxima ação automática para o lead.
                </p>
              </div>
            </div>

            {/* Visual scale */}
            <div className="rounded-xl bg-muted/30 p-4">
              <div className="relative h-10 overflow-hidden rounded-lg bg-muted">
                <Segment left={0} right={thresholds.dead} color="bg-muted-foreground/30" />
                <Segment
                  left={thresholds.dead}
                  right={thresholds.luke}
                  color="bg-slate-400/50"
                />
                <Segment
                  left={thresholds.luke}
                  right={thresholds.cold}
                  color="bg-sky-500/50"
                />
                <Segment
                  left={thresholds.cold}
                  right={thresholds.warm}
                  color="bg-amber-500/60"
                />
                <Segment
                  left={thresholds.warm}
                  right={100}
                  color="bg-rose-500/70"
                />

                {/* Markers */}
                {(["dead", "luke", "cold", "warm"] as const).map((k) => (
                  <div
                    key={k}
                    className="absolute inset-y-0 w-px bg-background/80"
                    style={{ left: `${thresholds[k]}%` }}
                    aria-hidden
                  />
                ))}
              </div>
              <div className="mt-1 flex justify-between px-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70 tabular-nums">
                <span>0</span>
                <span>25</span>
                <span>50</span>
                <span>75</span>
                <span>100</span>
              </div>
            </div>

            {/* Threshold sliders */}
            <div className="space-y-3">
              {baseTiers.map((tier) => {
                const lower = thresholdLower(tier.id, thresholds)
                const upper = thresholdUpper(tier.id, thresholds)
                return (
                  <div
                    key={tier.id}
                    className="grid gap-2 rounded-xl border border-border/60 bg-card/50 p-3 sm:grid-cols-[140px_minmax(0,1fr)_minmax(0,1.2fr)] sm:items-center"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "flex size-8 items-center justify-center rounded-lg",
                          tier.badgeClass
                        )}
                        aria-hidden
                      >
                        <tier.icon className="size-4" />
                      </div>
                      <div>
                        <p className={cn("text-[13px] font-bold", tier.tone)}>
                          {tier.label}
                        </p>
                        <p className="text-[10px] text-muted-foreground tabular-nums">
                          {lower}–{upper}
                        </p>
                      </div>
                    </div>

                    <p className="text-[11px] leading-snug text-muted-foreground">
                      {tier.action}
                    </p>

                    <ThresholdControl
                      tier={tier.id}
                      thresholds={thresholds}
                      setThresholds={setThresholds}
                    />
                  </div>
                )
              })}
            </div>

            <div className="flex items-start gap-2 rounded-lg bg-primary/[0.04] border border-primary/10 px-3 py-2">
              <Info className="mt-0.5 size-3.5 shrink-0 text-primary" />
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                <span className="font-medium text-foreground/80">
                  Decay automático:
                </span>{" "}
                score cai 5% por dia sem interação para simular esquecimento do
                lead. Ajustável em Configurações Avançadas.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Simulator */}
        <aside className="space-y-3 lg:sticky lg:top-6 lg:self-start">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
              Simulador
            </p>
          </div>

          <Card className="animate-card-in stagger-2">
            <CardContent className="p-5 space-y-5">
              {/* Result */}
              <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-orange-500/5 to-transparent p-5 text-center">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Score final calculado
                </p>
                <p className="font-display text-5xl font-bold tracking-tight text-gradient tabular-nums mt-1">
                  {finalScore}
                </p>
                <Badge
                  variant="secondary"
                  className={cn(
                    "mt-3 gap-1 px-3 py-1 text-[11px]",
                    currentTier.badgeClass
                  )}
                >
                  <currentTier.icon className="size-3" />
                  {currentTier.label}
                </Badge>
                <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                  {currentTier.action}
                </p>
              </div>

              <Separator />

              {/* Inputs */}
              <div className="space-y-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                  Ajuste os sub-scores
                </p>
                {(Object.keys(sim) as WeightKey[]).map((k) => {
                  const meta = componentMeta[k]
                  return (
                    <div key={k} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label
                          className={cn(
                            "flex items-center gap-1.5 text-[12px]",
                            meta.tone
                          )}
                        >
                          <meta.icon className="size-3" />
                          {meta.label}
                        </Label>
                        <span className="font-display text-xs font-bold tabular-nums">
                          {sim[k]}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={sim[k]}
                        onChange={(e) =>
                          setSim({ ...sim, [k]: Number(e.target.value) })
                        }
                        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary"
                        aria-label={meta.label}
                      />
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}

function Segment({
  left,
  right,
  color,
}: {
  left: number
  right: number
  color: string
}) {
  return (
    <div
      className={cn("absolute inset-y-0 transition-all duration-300", color)}
      style={{ left: `${left}%`, width: `${right - left}%` }}
      aria-hidden
    />
  )
}

function thresholdLower(
  id: Tier["id"],
  t: { dead: number; luke: number; cold: number; warm: number }
): number {
  switch (id) {
    case "dead":
      return 0
    case "luke":
      return t.dead
    case "cold":
      return t.luke
    case "warm":
      return t.cold
    case "hot":
      return t.warm
  }
}

function thresholdUpper(
  id: Tier["id"],
  t: { dead: number; luke: number; cold: number; warm: number }
): number {
  switch (id) {
    case "dead":
      return t.dead
    case "luke":
      return t.luke
    case "cold":
      return t.cold
    case "warm":
      return t.warm
    case "hot":
      return 100
  }
}

function ThresholdControl({
  tier,
  thresholds,
  setThresholds,
}: {
  tier: Tier["id"]
  thresholds: { dead: number; luke: number; cold: number; warm: number }
  setThresholds: (
    t: { dead: number; luke: number; cold: number; warm: number }
  ) => void
}) {
  // HOT has no upper adjustable; use warm as the handle it depends on
  if (tier === "hot") {
    return (
      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
        <span>Handoff quando ≥</span>
        <Badge
          variant="secondary"
          className="font-display font-bold tabular-nums"
        >
          {thresholds.warm}
        </Badge>
      </div>
    )
  }
  if (tier === "dead") {
    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
          <span>Desqualifica abaixo de</span>
          <span className="font-display text-[11px] text-foreground tabular-nums">
            {thresholds.dead}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={thresholds.luke - 5}
          value={thresholds.dead}
          onChange={(e) =>
            setThresholds({ ...thresholds, dead: Number(e.target.value) })
          }
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary"
          aria-label="Threshold DEAD"
        />
      </div>
    )
  }
  const key = tier as "luke" | "cold" | "warm"
  const minByTier: Record<typeof key, number> = {
    luke: thresholds.dead + 5,
    cold: thresholds.luke + 5,
    warm: thresholds.cold + 5,
  }
  const maxByTier: Record<typeof key, number> = {
    luke: thresholds.cold - 5,
    cold: thresholds.warm - 5,
    warm: 100,
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
        <span>Boundary superior</span>
        <span className="font-display text-[11px] text-foreground tabular-nums">
          {thresholds[key]}
        </span>
      </div>
      <input
        type="range"
        min={minByTier[key]}
        max={maxByTier[key]}
        value={thresholds[key]}
        onChange={(e) =>
          setThresholds({ ...thresholds, [key]: Number(e.target.value) })
        }
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary"
        aria-label={`Threshold ${tier}`}
      />
    </div>
  )
}
