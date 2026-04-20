import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  CalendarPlus,
  Clock,
  Video,
  PhoneCall,
  Monitor,
  RotateCcw,
  AlertTriangle,
  Check,
  X,
  RefreshCw,
  Eye,
  User,
  Sparkles,
  Link as LinkIcon,
  Copy,
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit3,
  TrendingUp,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

type AppointmentType = "Reunião" | "Ligação" | "Demo" | "Follow-up"
type AppointmentStatus = "Agendado" | "Confirmado" | "Concluído" | "No-show"

interface Appointment {
  id: string
  timeStart: string
  timeEnd: string
  leadName: string
  leadCompany: string
  type: AppointmentType
  status: AppointmentStatus
  closerName: string
  date: string
  dayLabel: string
}

const today = "2026-04-06"

const appointments: Appointment[] = [
  {
    id: "ap1",
    timeStart: "09:00",
    timeEnd: "09:30",
    leadName: "Ana Carolina Silva",
    leadCompany: "Silva & Associados",
    type: "Ligação",
    status: "Concluído",
    closerName: "Ricardo Mendes",
    date: today,
    dayLabel: "Hoje",
  },
  {
    id: "ap2",
    timeStart: "10:00",
    timeEnd: "10:45",
    leadName: "Bruno Oliveira Santos",
    leadCompany: "Oliveira Digital",
    type: "Reunião",
    status: "No-show",
    closerName: "Juliana Martins",
    date: today,
    dayLabel: "Hoje",
  },
  {
    id: "ap3",
    timeStart: "11:30",
    timeEnd: "12:00",
    leadName: "Camila Rodrigues Ferreira",
    leadCompany: "Tech Solutions Ltda",
    type: "Demo",
    status: "Confirmado",
    closerName: "Ricardo Mendes",
    date: today,
    dayLabel: "Hoje",
  },
  {
    id: "ap4",
    timeStart: "14:00",
    timeEnd: "14:30",
    leadName: "Diego Almeida Costa",
    leadCompany: "Costa Startup",
    type: "Follow-up",
    status: "Agendado",
    closerName: "Fernanda Lima",
    date: today,
    dayLabel: "Hoje",
  },
  {
    id: "ap5",
    timeStart: "15:30",
    timeEnd: "16:00",
    leadName: "Gustavo Pereira Souza",
    leadCompany: "GP Marketing",
    type: "Reunião",
    status: "No-show",
    closerName: "Juliana Martins",
    date: today,
    dayLabel: "Hoje",
  },
  {
    id: "ap6",
    timeStart: "09:00",
    timeEnd: "09:45",
    leadName: "Helena Martins Rocha",
    leadCompany: "Agência Rocha",
    type: "Demo",
    status: "Agendado",
    closerName: "Ricardo Mendes",
    date: "2026-04-07",
    dayLabel: "Amanhã",
  },
  {
    id: "ap7",
    timeStart: "11:00",
    timeEnd: "11:30",
    leadName: "Igor Nascimento Dias",
    leadCompany: "Dias Consultoria",
    type: "Ligação",
    status: "Confirmado",
    closerName: "Fernanda Lima",
    date: "2026-04-07",
    dayLabel: "Amanhã",
  },
  {
    id: "ap8",
    timeStart: "14:00",
    timeEnd: "15:00",
    leadName: "Juliana Teixeira Gomes",
    leadCompany: "Varejo Gomes",
    type: "Reunião",
    status: "Agendado",
    closerName: "Juliana Martins",
    date: "2026-04-08",
    dayLabel: "Quarta-feira",
  },
  {
    id: "ap9",
    timeStart: "10:00",
    timeEnd: "10:30",
    leadName: "Kaio Rezende Pinto",
    leadCompany: "Fintech Pinto",
    type: "Follow-up",
    status: "Agendado",
    closerName: "Ricardo Mendes",
    date: "2026-04-09",
    dayLabel: "Quinta-feira",
  },
  {
    id: "ap10",
    timeStart: "16:00",
    timeEnd: "16:45",
    leadName: "Larissa Moreira Cunha",
    leadCompany: "Saúde Cunha",
    type: "Demo",
    status: "Confirmado",
    closerName: "Fernanda Lima",
    date: "2026-04-10",
    dayLabel: "Sexta-feira",
  },
]

const typeConfig: Record<
  AppointmentType,
  { icon: typeof Video; color: string; bgColor: string }
> = {
  Reunião: {
    icon: Video,
    color: "text-blue-700 dark:text-blue-300",
    bgColor: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  },
  Ligação: {
    icon: PhoneCall,
    color: "text-green-700 dark:text-green-300",
    bgColor:
      "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  },
  Demo: {
    icon: Monitor,
    color: "text-primary dark:text-primary",
    bgColor:
      "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary",
  },
  "Follow-up": {
    icon: RotateCcw,
    color: "text-amber-700 dark:text-amber-300",
    bgColor:
      "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  },
}

const statusConfig: Record<AppointmentStatus, { color: string; icon: typeof Check }> = {
  Agendado: {
    color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    icon: Clock,
  },
  Confirmado: {
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    icon: Check,
  },
  Concluído: {
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
    icon: Check,
  },
  "No-show": {
    color: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
    icon: X,
  },
}

function getInitials(name: string): string {
  const parts = name.split(" ")
  return (parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "")
}

function AppointmentCard({ appointment }: { appointment: Appointment }) {
  const typeConf = typeConfig[appointment.type]
  const statusConf = statusConfig[appointment.status]
  const TypeIcon = typeConf.icon

  return (
    <Card className="card-hover animate-card-in glass border-border/50 rounded-xl">
      <CardContent className="pt-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-3">
            <div className="flex flex-col items-center gap-1">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/5 to-orange-500/5">
                <TypeIcon className={`size-5 ${typeConf.color}`} />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Clock className="size-3.5 text-muted-foreground" />
                <span className="text-sm font-semibold">
                  {appointment.timeStart} - {appointment.timeEnd}
                </span>
                {appointment.dayLabel !== "Hoje" && (
                  <span className="text-xs text-muted-foreground">
                    ({appointment.dayLabel})
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Avatar size="sm">
                  <AvatarFallback className="bg-gradient-to-br from-primary/10 to-orange-500/10 text-primary text-[10px]">
                    {getInitials(appointment.leadName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{appointment.leadName}</p>
                  <p className="text-xs text-muted-foreground">
                    {appointment.leadCompany}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-0.5">
                <Badge variant="secondary" className={typeConf.bgColor}>
                  {appointment.type}
                </Badge>
                <Badge variant="secondary" className={statusConf.color}>
                  {appointment.status}
                </Badge>
              </div>
              <div className="flex items-center gap-1.5 pt-0.5">
                <User className="size-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Closer: {appointment.closerName}
                </span>
              </div>
              {/* AI Prediction */}
              {appointment.status !== "Concluído" && appointment.status !== "No-show" && (
                <div className="flex items-center gap-1.5 pt-2 mt-2 border-t border-dashed border-primary/20 dark:border-primary/30">
                  <Sparkles className="size-3 text-primary shrink-0" />
                  <span className="text-[10px] text-primary dark:text-primary">
                    {appointment.status === "Confirmado"
                      ? "IA: 95% chance de comparecimento — lead engajado"
                      : appointment.type === "Demo"
                        ? "IA: 78% chance de comparecimento — envie lembrete 1h antes"
                        : "IA: 65% chance — considere confirmar por WhatsApp"
                    }
                  </span>
                </div>
              )}
              {appointment.status === "No-show" && (
                <div className="flex items-center gap-1.5 pt-2 mt-2 border-t border-dashed border-red-200 dark:border-red-800">
                  <Sparkles className="size-3 text-red-500 shrink-0" />
                  <span className="text-[10px] text-red-600 dark:text-red-400">
                    IA: Reagendar automaticamente em 48h? Lead ainda tem score alto
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 sm:flex-col">
            {appointment.status === "Agendado" && (
              <Button variant="outline" size="sm" className="gap-1.5 transition-all duration-200">
                <Check className="size-3.5" />
                Confirmar
              </Button>
            )}
            {(appointment.status === "Agendado" ||
              appointment.status === "Confirmado") && (
              <Button variant="outline" size="sm" className="gap-1.5 transition-all duration-200">
                <RefreshCw className="size-3.5" />
                Remarcar
              </Button>
            )}
            {appointment.status !== "Concluído" &&
              appointment.status !== "No-show" && (
                <Button variant="destructive" size="sm" className="gap-1.5 transition-all duration-200">
                  <X className="size-3.5" />
                  Cancelar
                </Button>
              )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function GestorSchedulePage() {
  const [viewTab, setViewTab] = useState("today")

  const todayAppointments = appointments.filter((a) => a.date === today)
  const weekAppointments = appointments
  const noShowCount = todayAppointments.filter(
    (a) => a.status === "No-show"
  ).length

  // Group week appointments by day
  const groupedByDay = weekAppointments.reduce(
    (acc, appointment) => {
      const label = appointment.dayLabel
      if (!acc[label]) acc[label] = []
      acc[label].push(appointment)
      return acc
    },
    {} as Record<string, Appointment[]>
  )

  const displayedAppointments =
    viewTab === "today" ? todayAppointments : weekAppointments

  return (
    <div className="animate-page-in space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-gradient">Agenda</h2>
          <p className="text-muted-foreground/60">
            Gerencie seus agendamentos
          </p>
        </div>
        <Button variant="gradient" className="btn-lift shadow-md shadow-primary/10">
          <CalendarPlus className="size-4" />
          Novo Agendamento
        </Button>
      </div>

      {/* No-Show Alert */}
      {noShowCount > 0 && (
        <div className="animate-card-in flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 shadow-md shadow-red-500/10 dark:border-red-900 dark:bg-red-950/50">
          <div className="flex items-center gap-3">
            <AlertTriangle className="size-5 text-red-600 dark:text-red-400" />
            <span className="text-sm font-medium text-red-800 dark:text-red-300">
              {noShowCount} agendamento{noShowCount > 1 ? "s" : ""} marcado
              {noShowCount > 1 ? "s" : ""} como no-show hoje
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-700 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
          >
            <Eye className="size-4" />
            Ver detalhes
          </Button>
        </div>
      )}

      {/* AI Summary Banner */}
      <div className="ai-shimmer flex items-center gap-3 rounded-xl px-4 py-3 shadow-sm animate-card-in glass border border-border/50">
        <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-orange-500 text-white shadow-sm">
          <Sparkles className="size-4 animate-spin" style={{ animationDuration: "3s" }} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold ai-text-shimmer">Análise da IA</span>
            <span className="relative flex size-1.5"><span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" /></span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Hoje: 5 agendamentos · 2 no-shows detectados · Próxima reunião em 45min (Camila - Demo confirmada) · Recomendação: envie briefing para a reunião das 14h
          </p>
        </div>
      </div>

      {/* View Tabs */}
      <Tabs value={viewTab} onValueChange={setViewTab}>
        <TabsList>
          <TabsTrigger value="today">Hoje</TabsTrigger>
          <TabsTrigger value="week">Semana</TabsTrigger>
          <TabsTrigger value="month">Mês</TabsTrigger>
        </TabsList>

        {/* Hoje Tab */}
        <TabsContent value="today" className="space-y-4 pt-4">
          {todayAppointments.length === 0 ? (
            <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
              <p className="text-muted-foreground">
                Nenhum agendamento para hoje.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {todayAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Semana Tab */}
        <TabsContent value="week" className="space-y-6 pt-4">
          {Object.entries(groupedByDay).map(([dayLabel, dayAppointments], index) => (
            <div key={dayLabel} className="space-y-3">
              {index > 0 && (
                <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
              )}
              <div className="flex items-center gap-2">
                <h3 className="font-display text-sm font-semibold">{dayLabel}</h3>
                <Badge variant="secondary" className="text-xs">
                  {dayAppointments.length} agendamento
                  {dayAppointments.length > 1 ? "s" : ""}
                </Badge>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                {dayAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                  />
                ))}
              </div>
            </div>
          ))}
        </TabsContent>

        {/* Mês Tab */}
        <TabsContent value="month" className="pt-4">
          <Card className="glass border-border/50 rounded-xl">
            <CardContent className="flex h-64 items-center justify-center pt-4">
              <div className="text-center">
                <CalendarPlus className="mx-auto mb-3 size-10 text-muted-foreground/50" />
                <p className="text-sm font-medium text-muted-foreground/60">
                  Visualização mensal
                </p>
                <p className="text-xs text-muted-foreground/60">
                  {displayedAppointments.length} agendamentos neste mês
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Summary Footer */}
      <div className="flex flex-wrap gap-4 rounded-xl glass border border-border/50 px-4 py-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full bg-slate-500" />
          <span className="text-xs text-muted-foreground">
            Agendados:{" "}
            {displayedAppointments.filter((a) => a.status === "Agendado").length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full bg-blue-500" />
          <span className="text-xs text-muted-foreground">
            Confirmados:{" "}
            {
              displayedAppointments.filter((a) => a.status === "Confirmado")
                .length
            }
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full bg-emerald-500" />
          <span className="text-xs text-muted-foreground">
            Concluídos:{" "}
            {
              displayedAppointments.filter((a) => a.status === "Concluído")
                .length
            }
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full bg-red-500" />
          <span className="text-xs text-muted-foreground">
            No-show:{" "}
            {
              displayedAppointments.filter((a) => a.status === "No-show")
                .length
            }
          </span>
        </div>
      </div>
    </div>
  )
}

// ===========================================================================
// CLOSER SCHEDULE PAGE (Reference-style: weekly grid + link público + action inbox)
// ===========================================================================

interface CalEvent {
  d: number
  s: number
  h: number
  t: string
  sub?: string
  c?: "blue" | "green" | "amber"
}

const CLOSER_WEEK_DAYS = [
  { day: "SEG", date: 13 },
  { day: "TER", date: 14, today: true },
  { day: "QUA", date: 15 },
  { day: "QUI", date: 16 },
  { day: "SEX", date: 17 },
  { day: "SÁB", date: 18 },
  { day: "DOM", date: 19 },
]

const CLOSER_CAL_HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]

const CLOSER_EVENTS: CalEvent[] = [
  { d: 0, s: 9, h: 0.5, t: "Sync time comercial", sub: "Google Meet", c: "blue" },
  { d: 0, s: 11, h: 1, t: "Pepsico · Descoberta", sub: "Mariana Teixeira" },
  { d: 0, s: 14, h: 0.5, t: "Prep proposta Klabin" },
  { d: 0, s: 16, h: 1, t: "Call Natura", sub: "Juliana Prates", c: "green" },
  { d: 1, s: 9, h: 0.5, t: "Daily squad", c: "blue" },
  { d: 1, s: 10, h: 1.25, t: "Klabin · Negociação", sub: "Ricardo A. · R$ 120k" },
  { d: 1, s: 13, h: 0.75, t: "Almoço com Fábio", sub: "Raia Drogasil", c: "amber" },
  { d: 1, s: 15, h: 1, t: "Pepsico · Fechamento", sub: "Mariana + Rodrigo (CTO)" },
  { d: 1, s: 17, h: 0.5, t: "Retro semanal", c: "blue" },
  { d: 2, s: 10, h: 1, t: "Nubank · Descoberta", sub: "Ana Beatriz · POC", c: "green" },
  { d: 2, s: 14, h: 1.5, t: "Roadmap com produto", c: "amber" },
  { d: 3, s: 9, h: 1, t: "iFood · Follow-up", sub: "Camila Herrera" },
  { d: 3, s: 11, h: 0.5, t: "Prep Ambev" },
  { d: 3, s: 14, h: 1.25, t: "Ambev · Revisão jurídica", sub: "Leonardo B. · R$ 210k" },
  { d: 3, s: 16, h: 1, t: "Raia · Kickoff", sub: "Fábio Guedes", c: "green" },
  { d: 4, s: 9, h: 0.5, t: "Standup", c: "blue" },
  { d: 4, s: 10, h: 1, t: "Stone · Add-on", sub: "Bernardo Mello" },
  { d: 4, s: 15, h: 2, t: "Workshop enterprise", sub: "Cliente potencial Magalu", c: "amber" },
]

interface MeetingAction {
  id: string
  company: string
  when: string
  intro: string
  tasks: string[]
}

const CLOSER_MEETING_ACTIONS: MeetingAction[] = [
  {
    id: "pep",
    company: "Pepsico",
    when: "ontem · 38min",
    intro: "Transcrevemos a reunião com a Pepsico. Aqui estão 3 tarefas que você prometeu lá:",
    tasks: [
      "Enviar contrato v3 com cláusula de SLA e homologação SAP (prazo: sexta)",
      "Agendar call técnica com Rodrigo e time de TI para 22/04",
      "Compartilhar case do cliente Movida como referência de integração",
    ],
  },
  {
    id: "klab",
    company: "Klabin",
    when: "2 dias atrás · 52min",
    intro: "Identificamos 2 compromissos pendentes da call com Klabin:",
    tasks: [
      "Enviar comparativo de preços com volume (5 e 10 squads)",
      "Conectar Ricardo com o André (customer success) para referência",
    ],
  },
]

const CLOSER_WEEK_MINI_STATS = [
  { label: "Reuniões", value: "11", sub: "4 discovery" },
  { label: "Tempo em call", value: "8h 42m", sub: "-1h vs média" },
  { label: "Taxa comparecimento", value: "91%", sub: "+4pp" },
  { label: "Follow-ups criados", value: "7", sub: "via Copiloto" },
]

function eventToneClasses(c?: CalEvent["c"]) {
  if (c === "blue") return "bg-sky-500/15 border-l-sky-500 text-sky-700 dark:text-sky-300"
  if (c === "green") return "bg-emerald-500/15 border-l-emerald-500 text-emerald-700 dark:text-emerald-300"
  if (c === "amber") return "bg-amber-500/15 border-l-amber-500 text-amber-700 dark:text-amber-300"
  return "bg-primary/10 border-l-primary text-foreground"
}

function CloserSchedulePage() {
  const [copied, setCopied] = useState(false)
  const [actionsState, setActionsState] = useState<Record<string, "created" | "ignored">>({})
  const slotH = 48
  const hourStart = CLOSER_CAL_HOURS[0]

  const copy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const setAction = (id: string, val: "created" | "ignored") =>
    setActionsState((prev) => ({ ...prev, [id]: val }))

  const pendingCount = CLOSER_MEETING_ACTIONS.filter((m) => !actionsState[m.id]).length
  const allHandled = CLOSER_MEETING_ACTIONS.every((m) => actionsState[m.id])

  return (
    <div className="animate-page-in grid gap-6 lg:grid-cols-[1fr_360px]">
      {/* ── LEFT: Week calendar ── */}
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" size="sm" className="size-8 p-0">
            <ChevronLeft className="size-4" />
          </Button>
          <Button variant="ghost" size="sm" className="size-8 p-0">
            <ChevronRight className="size-4" />
          </Button>
          <Button variant="outline" size="sm" className="h-8">
            Hoje
          </Button>
          <h2 className="font-display text-[15px] font-semibold tracking-tight ml-1">Abril 2026</h2>
          <Badge variant="secondary" className="ml-1 text-[10px]">
            Semana 15 · 13 – 19 abril
          </Badge>
          <div className="flex-1" />
          <div className="inline-flex rounded-lg border border-border/60 p-0.5 text-xs">
            <button className="rounded-md px-2.5 py-1 text-muted-foreground hover:text-foreground">Dia</button>
            <button className="rounded-md bg-muted px-2.5 py-1 font-medium shadow-sm">Semana</button>
            <button className="rounded-md px-2.5 py-1 text-muted-foreground hover:text-foreground">Mês</button>
          </div>
          <Button variant="outline" size="sm" className="h-8 text-xs">
            <span className="size-2 rounded-sm bg-emerald-500" />
            Google Calendar sincronizado
          </Button>
          <Button
            variant="gradient"
            size="sm"
            className="btn-lift h-8"
          >
            <Plus className="size-3.5" />
            Novo evento
          </Button>
        </div>

        {/* Calendar grid */}
        <Card className="overflow-hidden">
          <div
            className="grid border-b border-border/60 text-[11px] font-semibold uppercase tracking-wide bg-muted/30"
            style={{ gridTemplateColumns: "54px repeat(7, 1fr)" }}
          >
            <div />
            {CLOSER_WEEK_DAYS.map((d) => (
              <div
                key={d.day}
                className={`flex items-center justify-center gap-1.5 py-2 border-l border-border/60 ${
                  d.today ? "text-primary" : "text-muted-foreground/70"
                }`}
              >
                <span>{d.day}</span>
                <span
                  className={`font-mono text-[13px] font-bold ${
                    d.today
                      ? "bg-primary text-primary-foreground rounded-md px-1.5"
                      : "text-foreground"
                  }`}
                >
                  {d.date}
                </span>
              </div>
            ))}
          </div>

          <div
            className="relative grid"
            style={{ gridTemplateColumns: "54px repeat(7, 1fr)" }}
          >
            {CLOSER_CAL_HOURS.map((h) => (
              <div
                key={`row-${h}`}
                className="contents"
              >
                <div
                  className="border-t border-border/50 py-1 pr-2 text-right text-[10px] font-mono text-muted-foreground/60"
                  style={{ height: slotH }}
                >
                  {String(h).padStart(2, "0")}:00
                </div>
                {CLOSER_WEEK_DAYS.map((_, di) => (
                  <div
                    key={`slot-${h}-${di}`}
                    className="border-t border-l border-border/50"
                    style={{ height: slotH }}
                  />
                ))}
              </div>
            ))}

            {/* Events overlay: use absolute positioning within day columns */}
            {CLOSER_EVENTS.map((e, i) => {
              const top = (e.s - hourStart) * slotH
              const height = e.h * slotH - 4
              const dayColStart = e.d + 2
              return (
                <div
                  key={i}
                  className={`absolute rounded-md border-l-[3px] px-2 py-1 shadow-sm overflow-hidden cursor-pointer transition-all hover:shadow-md ${eventToneClasses(e.c)}`}
                  style={{
                    gridColumn: dayColStart,
                    left: `calc(54px + ((100% - 54px) / 7) * ${e.d} + 3px)`,
                    width: `calc((100% - 54px) / 7 - 6px)`,
                    top: top + 2,
                    height,
                  }}
                >
                  <div className="text-[11px] font-semibold leading-tight truncate">{e.t}</div>
                  {e.sub && <div className="text-[10px] opacity-70 truncate">{e.sub}</div>}
                </div>
              )
            })}

            {/* Now line (Tuesday ~14:28) */}
            <div
              className="absolute h-px bg-red-500 z-10 pointer-events-none"
              style={{
                top: (14.5 - hourStart) * slotH,
                left: `calc(54px + ((100% - 54px) / 7) * 1)`,
                width: `calc((100% - 54px) / 7)`,
              }}
            >
              <div className="absolute -left-1 -top-1 size-2 rounded-full bg-red-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* ── RIGHT: Scheduling link + AI actions + stats ── */}
      <div className="space-y-4">
        {/* Scheduling link card */}
        <Card className="overflow-hidden relative">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-transparent" />
          <CardHeader className="relative pb-3">
            <div className="flex items-center gap-2">
              <LinkIcon className="size-4 text-primary" />
              <CardTitle className="font-display text-[14px] font-semibold">
                Seu link público de agendamento
              </CardTitle>
            </div>
            <CardDescription className="text-[12px]">
              Compartilhe com leads para que escolham um horário livre automaticamente.
            </CardDescription>
          </CardHeader>
          <CardContent className="relative space-y-3">
            <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/40 px-2.5 py-2 font-mono text-[11.5px]">
              <LinkIcon className="size-3 text-muted-foreground shrink-0" />
              <span className="flex-1 truncate text-muted-foreground">
                techvendaspro.com/agendar/rafael-silva
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="size-6 p-0 shrink-0"
                onClick={copy}
              >
                {copied ? (
                  <Check className="size-3 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Copy className="size-3" />
                )}
              </Button>
            </div>

            <div className="space-y-1.5 rounded-lg bg-muted/30 p-3">
              {[
                ["Duração padrão", "30 min"],
                ["Buffer entre reuniões", "10 min"],
                ["Dias disponíveis", "Seg–Sex"],
                ["Horário", "09h – 18h"],
                ["Antecedência mínima", "2 h"],
              ].map(([label, val]) => (
                <div key={label} className="flex items-center justify-between text-[12px]">
                  <span className="text-muted-foreground">{label}</span>
                  <span className={label === "Horário" ? "font-mono" : ""}>{val}</span>
                </div>
              ))}
            </div>

            <Button variant="outline" size="sm" className="w-full">
              <Edit3 className="size-3.5" />
              Configurar slots
            </Button>
          </CardContent>
        </Card>

        {/* Meeting action inbox (AI) */}
        <div>
          <div className="flex items-center gap-2 mb-2 px-1">
            <Sparkles className="size-3.5 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-[0.06em] text-muted-foreground/80">
              Ações de reunião · Copiloto
            </span>
            <div className="flex-1" />
            {pendingCount > 0 && (
              <span className="inline-flex items-center rounded-md bg-primary/10 text-primary px-1.5 py-0.5 text-[10px] font-bold">
                {pendingCount}
              </span>
            )}
          </div>

          <div className="space-y-2.5">
            {CLOSER_MEETING_ACTIONS.map((m) => {
              const state = actionsState[m.id]
              if (state === "ignored") return null
              if (state === "created") {
                return (
                  <Card
                    key={m.id}
                    className="border-emerald-500/30 bg-emerald-500/[0.06] overflow-hidden"
                  >
                    <CardContent className="pt-4 flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-[12.5px] font-medium">
                        <Check className="size-3.5" />
                        {m.company} · {m.tasks.length} tarefas criadas
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 self-start text-xs"
                      >
                        Ver no dashboard →
                      </Button>
                    </CardContent>
                  </Card>
                )
              }
              return (
                <Card key={m.id} className="overflow-hidden">
                  <CardContent className="pt-4 space-y-2.5">
                    <div className="flex items-center gap-2 text-[12.5px] font-medium">
                      <Video className="size-3.5 text-primary" />
                      {m.company} · <span className="text-muted-foreground">{m.when}</span>
                    </div>
                    <p className="text-[12px] text-muted-foreground leading-snug">{m.intro}</p>
                    <div className="space-y-1.5">
                      {m.tasks.map((t, i) => (
                        <label
                          key={i}
                          className="flex items-start gap-2 text-[12px] cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            defaultChecked
                            className="mt-0.5 size-3.5 accent-primary"
                          />
                          <span>{t}</span>
                        </label>
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5 pt-1">
                      <Button
                        size="sm"
                        className="h-7 px-3 text-xs btn-lift bg-gradient-to-r from-primary to-orange-600 text-white"
                        onClick={() => setAction(m.id, "created")}
                      >
                        <Plus className="size-3" />
                        Criar tarefas no CRM
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-3 text-xs"
                        onClick={() => setAction(m.id, "ignored")}
                      >
                        Ignorar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            {allHandled && (
              <div className="rounded-lg border border-dashed border-border/60 p-6 text-center text-[12.5px] text-muted-foreground">
                Caixa vazia. Você está em dia! 🎉
              </div>
            )}
          </div>
        </div>

        {/* Week stats */}
        <div>
          <div className="flex items-center gap-2 mb-2 px-1">
            <TrendingUp className="size-3.5 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-[0.06em] text-muted-foreground/80">
              Esta semana
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {CLOSER_WEEK_MINI_STATS.map((s) => (
              <Card key={s.label}>
                <CardContent className="pt-3 pb-3">
                  <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/70">
                    {s.label}
                  </div>
                  <div className="font-mono text-[15px] font-semibold tracking-tight mt-0.5">
                    {s.value}
                  </div>
                  <div className="text-[10.5px] text-muted-foreground/60 mt-0.5">{s.sub}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ===========================================================================
// Role dispatcher
// ===========================================================================

export function SchedulePage() {
  const { user } = useAuth()
  if (user?.role === "closer") return <CloserSchedulePage />
  return <GestorSchedulePage />
}
