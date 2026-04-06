import { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// Separator replaced with gradient div inline
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  UserPlus,
  Users,
  Wifi,
  TrendingUp,
  MoreHorizontal,
  Mail,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Role = "Admin" | "Gestor" | "Closer" | "SDR"

interface TeamMember {
  id: string
  name: string
  email: string
  role: Role
  online: boolean
  initials: string
  dealsWon: number
  conversion: number
  sla: string
}

const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Carlos Eduardo",
    email: "carlos@techvendas.com",
    role: "Admin",
    online: true,
    initials: "CE",
    dealsWon: 45,
    conversion: 28.5,
    sla: "2h 15min",
  },
  {
    id: "2",
    name: "Ana Beatriz",
    email: "ana@techvendas.com",
    role: "Gestor",
    online: true,
    initials: "AB",
    dealsWon: 38,
    conversion: 25.2,
    sla: "1h 45min",
  },
  {
    id: "3",
    name: "Rafael Silva",
    email: "rafael@techvendas.com",
    role: "Closer",
    online: true,
    initials: "RS",
    dealsWon: 52,
    conversion: 31.0,
    sla: "1h 30min",
  },
  {
    id: "4",
    name: "Juliana Santos",
    email: "juliana@techvendas.com",
    role: "Closer",
    online: true,
    initials: "JS",
    dealsWon: 41,
    conversion: 22.8,
    sla: "2h 00min",
  },
  {
    id: "5",
    name: "Pedro Henrique",
    email: "pedro@techvendas.com",
    role: "SDR",
    online: false,
    initials: "PH",
    dealsWon: 15,
    conversion: 9.5,
    sla: "3h 10min",
  },
]

const roleBadgeVariant: Record<Role, "default" | "secondary" | "outline"> = {
  Admin: "default",
  Gestor: "secondary",
  Closer: "outline",
  SDR: "outline",
}

const roleColors: Record<Role, string> = {
  Admin: "bg-primary/10 text-primary dark:text-primary",
  Gestor: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  Closer: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  SDR: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
}

const avatarColors: Record<Role, string> = {
  Admin: "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary",
  Gestor: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  Closer: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  SDR: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
}

export function TeamPage() {
  const [inviteOpen, setInviteOpen] = useState(false)

  const onlineCount = teamMembers.filter((m) => m.online).length
  const avgConversion =
    teamMembers.reduce((acc, m) => acc + m.conversion, 0) / teamMembers.length

  return (
    <div className="animate-page-in space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gradient">Equipe</h2>
          <p className="text-muted-foreground">
            Gerencie sua equipe de vendas
          </p>
        </div>
        <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
          <DialogTrigger asChild>
            <Button className="btn-lift bg-gradient-to-r from-primary to-orange-600 text-primary-foreground shadow-md shadow-primary/10">
              <UserPlus className="mr-1.5 size-4" />
              Convidar Membro
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Convidar novo membro</DialogTitle>
              <DialogDescription>
                Envie um convite para um novo membro da equipe.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="invite-email">E-mail</Label>
                <Input
                  id="invite-email"
                  type="email"
                  placeholder="membro@empresa.com"
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-2">
                <Label>Cargo</Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="gestor">Gestor</SelectItem>
                    <SelectItem value="closer">Closer</SelectItem>
                    <SelectItem value="sdr">SDR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setInviteOpen(false)}
                >
                  Cancelar
                </Button>
                <Button className="btn-lift" onClick={() => setInviteOpen(false)}>
                  <Mail className="mr-1.5 size-4" />
                  Enviar Convite
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="animate-card-in stagger-1 card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Membros
            </CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-orange-500/10">
              <Users className="size-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamMembers.length}</div>
            <p className="text-xs text-muted-foreground">
              membros na equipe
            </p>
          </CardContent>
        </Card>
        <Card className="animate-card-in stagger-2 card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Online Agora</CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-orange-500/10">
              <Wifi className="size-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{onlineCount}</div>
            <p className="text-xs text-muted-foreground">
              membros ativos agora
            </p>
          </CardContent>
        </Card>
        <Card className="animate-card-in stagger-3 card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Media de Conversao
            </CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-orange-500/10">
              <TrendingUp className="size-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgConversion.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              taxa media da equipe
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Team Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {teamMembers.map((member, index) => (
          <Card key={member.id} className={`card-hover animate-card-in stagger-${(index % 5) + 1}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar size="lg">
                      <AvatarFallback className={avatarColors[member.role]}>
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-background ${
                        member.online ? "bg-emerald-500 pulse-online" : "bg-muted-foreground/40"
                      }`}
                    />
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="truncate">{member.name}</CardTitle>
                    <CardDescription className="truncate">
                      {member.email}
                    </CardDescription>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-xs">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Ver perfil</DropdownMenuItem>
                    <DropdownMenuItem>Editar</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Badge
                  variant={roleBadgeVariant[member.role]}
                  className={roleColors[member.role]}
                >
                  {member.role}
                </Badge>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span
                    className={`inline-block size-1.5 rounded-full ${
                      member.online ? "bg-emerald-500" : "bg-muted-foreground/40"
                    }`}
                  />
                  {member.online ? "Online" : "Offline"}
                </span>
              </div>
            </CardHeader>
            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            <CardContent className="pt-4">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-lg font-semibold">{member.dealsWon}</p>
                  <p className="text-[11px] text-muted-foreground">
                    Deals Ganhos
                  </p>
                </div>
                <div>
                  <p className="text-lg font-semibold">{member.conversion}%</p>
                  <p className="text-[11px] text-muted-foreground">
                    Conversao
                  </p>
                </div>
                <div>
                  <p className="text-lg font-semibold">{member.sla}</p>
                  <p className="text-[11px] text-muted-foreground">SLA</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
