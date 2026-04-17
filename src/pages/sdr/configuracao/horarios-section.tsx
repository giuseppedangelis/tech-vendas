import { useState } from "react"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Clock,
  CalendarCheck,
  Timer,
  Zap,
  Globe2,
  MoonStar,
  Bot,
  MessageSquare,
  AlertTriangle,
  Plus,
  Trash2,
} from "lucide-react"
import { cn } from "@/lib/utils"

type DayId = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun"

interface DaySchedule {
  id: DayId
  label: string
  shortLabel: string
  active: boolean
  start: string
  end: string
}

const initialSchedule: DaySchedule[] = [
  { id: "mon", label: "Segunda", shortLabel: "SEG", active: true, start: "08:00", end: "18:00" },
  { id: "tue", label: "Terça", shortLabel: "TER", active: true, start: "08:00", end: "18:00" },
  { id: "wed", label: "Quarta", shortLabel: "QUA", active: true, start: "08:00", end: "18:00" },
  { id: "thu", label: "Quinta", shortLabel: "QUI", active: true, start: "08:00", end: "18:00" },
  { id: "fri", label: "Sexta", shortLabel: "SEX", active: true, start: "08:00", end: "17:00" },
  { id: "sat", label: "Sábado", shortLabel: "SÁB", active: false, start: "09:00", end: "13:00" },
  { id: "sun", label: "Domingo", shortLabel: "DOM", active: false, start: "09:00", end: "13:00" },
]

interface Holiday {
  id: string
  date: string
  label: string
  operate: boolean
}

const initialHolidays: Holiday[] = [
  { id: "h1", date: "2026-04-21", label: "Tiradentes", operate: false },
  { id: "h2", date: "2026-05-01", label: "Dia do Trabalho", operate: false },
  { id: "h3", date: "2026-06-04", label: "Corpus Christi", operate: false },
  { id: "h4", date: "2026-09-07", label: "Independência", operate: false },
  { id: "h5", date: "2026-10-12", label: "N. Sra. Aparecida", operate: true },
]

type AfterHoursAction = "queue" | "autoresponder" | "ai_agent"

export function HorariosSection() {
  const [schedule, setSchedule] = useState(initialSchedule)
  const [timezone, setTimezone] = useState("America/Sao_Paulo")
  const [firstResponseSla, setFirstResponseSla] = useState(5)
  const [nextActionSla, setNextActionSla] = useState(24)
  const [afterHoursAction, setAfterHoursAction] =
    useState<AfterHoursAction>("ai_agent")
  const [holidays, setHolidays] = useState(initialHolidays)

  function toggleDay(id: DayId) {
    setSchedule((prev) =>
      prev.map((d) => (d.id === id ? { ...d, active: !d.active } : d))
    )
  }

  function updateTime(id: DayId, key: "start" | "end", value: string) {
    setSchedule((prev) =>
      prev.map((d) => (d.id === id ? { ...d, [key]: value } : d))
    )
  }

  function toggleHoliday(id: string) {
    setHolidays((prev) =>
      prev.map((h) => (h.id === id ? { ...h, operate: !h.operate } : h))
    )
  }

  function totalHoursPerWeek() {
    return schedule
      .filter((d) => d.active)
      .reduce((acc, d) => {
        const [sh, sm] = d.start.split(":").map(Number)
        const [eh, em] = d.end.split(":").map(Number)
        const hours = eh + em / 60 - (sh + sm / 60)
        return acc + Math.max(0, hours)
      }, 0)
  }

  const slaTone =
    firstResponseSla <= 5
      ? "text-emerald-600 dark:text-emerald-400"
      : firstResponseSla <= 15
        ? "text-amber-600 dark:text-amber-400"
        : "text-rose-600 dark:text-rose-400"

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h3 className="font-display text-lg font-bold tracking-tight">
            Horários & SLA
          </h3>
          <p className="text-sm text-muted-foreground">
            Janela de operação, SLAs de resposta e comportamento fora do horário.
          </p>
        </div>
        <Button className="btn-lift bg-gradient-to-r from-primary to-orange-600 text-primary-foreground shadow-md shadow-primary/10">
          Salvar horários
        </Button>
      </header>

      {/* Summary strip */}
      <div className="grid gap-3 sm:grid-cols-3">
        <StatTile
          icon={CalendarCheck}
          label="Dias ativos"
          value={schedule.filter((d) => d.active).length.toString()}
          unit={`de 7`}
        />
        <StatTile
          icon={Clock}
          label="Horas / semana"
          value={totalHoursPerWeek().toFixed(0)}
          unit="horas"
        />
        <StatTile
          icon={Timer}
          label="SLA 1ª resposta"
          value={`${firstResponseSla}min`}
          unit={
            firstResponseSla <= 5
              ? "excelente"
              : firstResponseSla <= 15
                ? "aceitável"
                : "alto"
          }
          valueClass={slaTone}
        />
      </div>

      {/* Timezone + Weekly schedule */}
      <Card className="animate-card-in">
        <CardContent className="p-5 space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Clock className="size-4" />
              </div>
              <div>
                <p className="font-display text-sm font-semibold tracking-tight">
                  Janela semanal
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Agente IA e cadências respeitam esta janela.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Globe2 className="size-4 text-muted-foreground" />
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger className="w-[220px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/Sao_Paulo">
                    Brasília (GMT -3)
                  </SelectItem>
                  <SelectItem value="America/Manaus">
                    Manaus (GMT -4)
                  </SelectItem>
                  <SelectItem value="America/New_York">
                    New York (GMT -5)
                  </SelectItem>
                  <SelectItem value="Europe/Lisbon">
                    Lisboa (GMT +0)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Weekly bar */}
          <div className="space-y-2">
            {schedule.map((d) => (
              <div
                key={d.id}
                className={cn(
                  "grid grid-cols-[80px_minmax(0,1fr)_140px_140px] items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors",
                  d.active
                    ? "border-border/60 bg-card/50"
                    : "border-border/30 bg-muted/20 opacity-60"
                )}
              >
                <label className="flex cursor-pointer items-center gap-2">
                  <Switch
                    checked={d.active}
                    onCheckedChange={() => toggleDay(d.id)}
                    aria-label={`Ativar ${d.label}`}
                  />
                  <span
                    className={cn(
                      "text-[11px] font-bold uppercase tracking-wider",
                      d.active ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {d.shortLabel}
                  </span>
                </label>

                {/* Visual bar 00–24h */}
                <div className="relative h-7 overflow-hidden rounded-md bg-muted">
                  {d.active && (
                    <div
                      className="absolute inset-y-0 bg-gradient-to-r from-primary/30 via-primary/50 to-orange-500/40 transition-all"
                      style={{
                        left: `${timeToPct(d.start)}%`,
                        width: `${timeToPct(d.end) - timeToPct(d.start)}%`,
                      }}
                      aria-hidden
                    />
                  )}
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-2 text-[9px] text-muted-foreground/60">
                    <span>00h</span>
                    <span>06h</span>
                    <span>12h</span>
                    <span>18h</span>
                    <span>24h</span>
                  </div>
                </div>

                <Input
                  type="time"
                  value={d.start}
                  disabled={!d.active}
                  onChange={(e) => updateTime(d.id, "start", e.target.value)}
                  className="h-9 text-[12px]"
                  aria-label={`Início ${d.label}`}
                />
                <Input
                  type="time"
                  value={d.end}
                  disabled={!d.active}
                  onChange={(e) => updateTime(d.id, "end", e.target.value)}
                  className="h-9 text-[12px]"
                  aria-label={`Fim ${d.label}`}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* SLAs */}
      <Card className="animate-card-in stagger-1">
        <CardContent className="p-5 space-y-5">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Timer className="size-4" />
            </div>
            <div>
              <p className="font-display text-sm font-semibold tracking-tight">
                SLAs operacionais
              </p>
              <p className="text-[11px] text-muted-foreground">
                Alertas são disparados quando SLA é descumprido.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <SlaSlider
              icon={Zap}
              label="Primeira resposta"
              hint="Tempo entre chegada do lead e 1ª mensagem do SDR"
              value={firstResponseSla}
              onChange={setFirstResponseSla}
              min={1}
              max={60}
              unit="min"
              tone={slaTone}
              markers={[
                { at: 5, label: "Excelente" },
                { at: 15, label: "Aceitável" },
                { at: 30, label: "Alto" },
              ]}
            />
            <SlaSlider
              icon={Timer}
              label="Próxima ação"
              hint="Tempo máximo entre uma interação e a próxima"
              value={nextActionSla}
              onChange={setNextActionSla}
              min={1}
              max={72}
              unit="h"
              tone="text-foreground"
              markers={[
                { at: 12, label: "Rápido" },
                { at: 24, label: "Padrão" },
                { at: 48, label: "Lento" },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* After hours + Holidays */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="animate-card-in stagger-2">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <MoonStar className="size-4" />
              </div>
              <div>
                <p className="font-display text-sm font-semibold tracking-tight">
                  Fora do horário
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Ação quando lead chega fora da janela operacional.
                </p>
              </div>
            </div>

            <div
              className="space-y-2"
              role="radiogroup"
              aria-label="Ação fora do horário"
            >
              {[
                {
                  id: "queue" as AfterHoursAction,
                  label: "Enfileirar para o próximo expediente",
                  hint: "SDR responde no primeiro horário útil.",
                  icon: Clock,
                },
                {
                  id: "autoresponder" as AfterHoursAction,
                  label: "Autoresponder com template",
                  hint: "Envia mensagem automática e enfileira.",
                  icon: MessageSquare,
                },
                {
                  id: "ai_agent" as AfterHoursAction,
                  label: "Agente IA cobre a janela",
                  hint: "Qualificação segue 24/7 com IA.",
                  icon: Bot,
                },
              ].map((opt) => {
                const active = afterHoursAction === opt.id
                return (
                  <button
                    key={opt.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setAfterHoursAction(opt.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all",
                      active
                        ? "border-primary/40 bg-primary/[0.04]"
                        : "border-border/60 bg-card/50 hover:border-primary/20"
                    )}
                  >
                    <div
                      className={cn(
                        "flex size-8 items-center justify-center rounded-lg",
                        active
                          ? "bg-gradient-to-br from-primary to-orange-600 text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                      aria-hidden
                    >
                      <opt.icon className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-medium">{opt.label}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {opt.hint}
                      </p>
                    </div>
                    {active && (
                      <Badge
                        variant="secondary"
                        className="bg-primary/10 text-primary border-primary/20 text-[10px]"
                      >
                        Ativa
                      </Badge>
                    )}
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="animate-card-in stagger-3">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <CalendarCheck className="size-4" />
                </div>
                <div>
                  <p className="font-display text-sm font-semibold tracking-tight">
                    Feriados
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Decida se opera ou pausa em cada feriado.
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Plus className="mr-1.5 size-3.5" />
                Feriado
              </Button>
            </div>

            <div className="space-y-1.5">
              {holidays.map((h) => (
                <div
                  key={h.id}
                  className="group flex items-center gap-3 rounded-lg border border-border/40 px-3 py-2 transition-colors hover:border-border"
                >
                  <div className="flex size-8 flex-col items-center justify-center rounded-md bg-muted">
                    <span className="text-[9px] font-medium uppercase leading-none text-muted-foreground">
                      {new Date(h.date).toLocaleDateString("pt-BR", {
                        month: "short",
                      })}
                    </span>
                    <span className="font-display text-[11px] font-bold leading-none">
                      {new Date(h.date).getDate()}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-medium">
                      {h.label}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(h.date).toLocaleDateString("pt-BR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-[10px]",
                      h.operate
                        ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                        : "bg-muted text-muted-foreground border-border"
                    )}
                  >
                    {h.operate ? "Opera" : "Pausado"}
                  </Badge>
                  <Switch
                    checked={h.operate}
                    onCheckedChange={() => toggleHoliday(h.id)}
                    aria-label={`Operar em ${h.label}`}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
                    aria-label="Remover feriado"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tip */}
      <div className="flex items-start gap-3 rounded-xl bg-primary/[0.04] border border-primary/10 px-4 py-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <AlertTriangle className="size-4 text-primary" />
        </div>
        <p className="flex-1 text-[12px] leading-relaxed text-muted-foreground">
          <span className="font-medium text-foreground/80">
            Atenção ao fuso:
          </span>{" "}
          templates WhatsApp só podem ser enviados fora da janela de 24h como
          HSM aprovado pela Meta. Garante que a janela semanal cobre o horário
          que os leads costumam responder.
        </p>
      </div>
    </div>
  )
}

function timeToPct(time: string) {
  const [h, m] = time.split(":").map(Number)
  return ((h + m / 60) / 24) * 100
}

function StatTile({
  icon: Icon,
  label,
  value,
  unit,
  valueClass,
}: {
  icon: typeof Clock
  label: string
  value: string
  unit: string
  valueClass?: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/50 px-4 py-3 backdrop-blur-sm">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-orange-500/10">
        <Icon className="size-4 text-primary" />
      </div>
      <div>
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
          {label}
        </p>
        <p
          className={cn(
            "font-display text-lg font-bold tracking-tight tabular-nums",
            valueClass
          )}
        >
          {value}
          <span className="ml-1 text-[10px] font-normal text-muted-foreground">
            {unit}
          </span>
        </p>
      </div>
    </div>
  )
}

function SlaSlider({
  icon: Icon,
  label,
  hint,
  value,
  onChange,
  min,
  max,
  unit,
  tone,
  markers,
}: {
  icon: typeof Zap
  label: string
  hint: string
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  unit: string
  tone: string
  markers: Array<{ at: number; label: string }>
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/50 p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <Icon className="size-3.5" />
          </div>
          <div>
            <Label className="text-[13px] font-medium">{label}</Label>
            <p className="text-[11px] text-muted-foreground">{hint}</p>
          </div>
        </div>
        <Badge
          variant="secondary"
          className={cn("font-display font-bold tabular-nums", tone)}
        >
          {value}
          {unit}
        </Badge>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary"
        aria-label={label}
      />

      <Separator />

      <div className="flex justify-between text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
        {markers.map((m) => (
          <span key={m.at} className="flex flex-col items-center">
            <span className="tabular-nums">
              {m.at}
              {unit}
            </span>
            <span className="text-[9px]">{m.label}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
