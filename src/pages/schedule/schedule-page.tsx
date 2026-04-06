import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
} from "lucide-react"

type AppointmentType = "Reuniao" | "Ligacao" | "Demo" | "Follow-up"
type AppointmentStatus = "Agendado" | "Confirmado" | "Concluido" | "No-show"

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
    type: "Ligacao",
    status: "Concluido",
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
    type: "Reuniao",
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
    type: "Reuniao",
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
    leadCompany: "Agencia Rocha",
    type: "Demo",
    status: "Agendado",
    closerName: "Ricardo Mendes",
    date: "2026-04-07",
    dayLabel: "Amanha",
  },
  {
    id: "ap7",
    timeStart: "11:00",
    timeEnd: "11:30",
    leadName: "Igor Nascimento Dias",
    leadCompany: "Dias Consultoria",
    type: "Ligacao",
    status: "Confirmado",
    closerName: "Fernanda Lima",
    date: "2026-04-07",
    dayLabel: "Amanha",
  },
  {
    id: "ap8",
    timeStart: "14:00",
    timeEnd: "15:00",
    leadName: "Juliana Teixeira Gomes",
    leadCompany: "Varejo Gomes",
    type: "Reuniao",
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
    leadCompany: "Saude Cunha",
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
  Reuniao: {
    icon: Video,
    color: "text-blue-700 dark:text-blue-300",
    bgColor: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  },
  Ligacao: {
    icon: PhoneCall,
    color: "text-green-700 dark:text-green-300",
    bgColor:
      "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  },
  Demo: {
    icon: Monitor,
    color: "text-violet-700 dark:text-violet-300",
    bgColor:
      "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300",
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
  Concluido: {
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
    <Card className="card-hover animate-card-in shadow-lg shadow-primary/[0.03]">
      <CardContent className="pt-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-3">
            <div className="flex flex-col items-center gap-1">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/5 to-violet-500/5">
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
                  <AvatarFallback className="bg-gradient-to-br from-primary/10 to-violet-500/10 text-primary text-[10px]">
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
              {appointment.status !== "Concluido" && appointment.status !== "No-show" && (
                <div className="flex items-center gap-1.5 pt-2 mt-2 border-t border-dashed border-violet-200 dark:border-violet-800">
                  <Sparkles className="size-3 text-violet-500 shrink-0" />
                  <span className="text-[10px] text-violet-600 dark:text-violet-400">
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
            {appointment.status !== "Concluido" &&
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

export function SchedulePage() {
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
          <h2 className="text-2xl font-bold tracking-tight text-gradient">Agenda</h2>
          <p className="text-muted-foreground">
            Gerencie seus agendamentos
          </p>
        </div>
        <Button className="btn-lift bg-gradient-to-r from-primary to-violet-600 text-primary-foreground shadow-md shadow-primary/20">
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
      <div className="flex items-center gap-3 rounded-xl border-gradient glass px-4 py-3 shadow-sm animate-card-in">
        <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-primary text-white shadow-sm">
          <Sparkles className="size-4 animate-spin" style={{ animationDuration: "3s" }} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold">Analise da IA</span>
            <span className="relative flex size-1.5"><span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" /></span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Hoje: 5 agendamentos · 2 no-shows detectados · Proxima reuniao em 45min (Camila - Demo confirmada) · Recomendacao: envie briefing para a reuniao das 14h
          </p>
        </div>
      </div>

      {/* View Tabs */}
      <Tabs value={viewTab} onValueChange={setViewTab}>
        <TabsList>
          <TabsTrigger value="today">Hoje</TabsTrigger>
          <TabsTrigger value="week">Semana</TabsTrigger>
          <TabsTrigger value="month">Mes</TabsTrigger>
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
                <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
              )}
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">{dayLabel}</h3>
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

        {/* Mes Tab */}
        <TabsContent value="month" className="pt-4">
          <Card>
            <CardContent className="flex h-64 items-center justify-center pt-4">
              <div className="text-center">
                <CalendarPlus className="mx-auto mb-3 size-10 text-muted-foreground/50" />
                <p className="text-sm font-medium text-muted-foreground">
                  Visualizacao mensal
                </p>
                <p className="text-xs text-muted-foreground">
                  {displayedAppointments.length} agendamentos neste mes
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Summary Footer */}
      <div className="flex flex-wrap gap-4 rounded-lg border glass px-4 py-3 shadow-sm shadow-primary/[0.02]">
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
            Concluidos:{" "}
            {
              displayedAppointments.filter((a) => a.status === "Concluido")
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
