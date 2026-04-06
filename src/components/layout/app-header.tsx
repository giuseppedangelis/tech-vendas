import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, Settings, LogOut, User, Sparkles } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/use-auth"

const routeNames: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/inbox": "Inbox",
  "/pipeline": "Pipeline",
  "/contacts": "Contatos",
  "/schedule": "Agenda",
  "/team": "Equipe",
  "/reports": "Relatorios",
  "/settings": "Configuracoes",
}

function getPageName(pathname: string): string {
  if (routeNames[pathname]) return routeNames[pathname]
  for (const [route, name] of Object.entries(routeNames)) {
    if (pathname.startsWith(route + "/")) return name
  }
  return "Dashboard"
}

const roleLabels: Record<string, string> = {
  admin: "Admin",
  gestor: "Gestor",
  closer: "Closer",
  sdr: "SDR",
}

export function AppHeader() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const pageName = getPageName(location.pathname)

  function handleLogout() {
    logout()
    navigate("/login", { replace: true })
  }

  return (
    <header className="glass sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border/50 px-6 shadow-sm shadow-primary/[0.02]">
      <SidebarTrigger className="transition-all duration-200 hover:text-primary" />
      <Separator orientation="vertical" className="h-6 bg-border/40" />

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="text-base font-semibold tracking-tight">
              {pageName}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex-1" />

      {/* AI Status Indicator */}
      <div className="hidden sm:flex items-center gap-2 rounded-full border border-violet-200 dark:border-violet-800 bg-gradient-to-r from-violet-500/5 to-primary/5 px-3 py-1.5 mr-2">
        <div className="glow-primary flex size-5 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-primary text-white">
          <Sparkles className="size-3 animate-spin" style={{ animationDuration: "3s" }} />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold leading-tight">IA Ativa</span>
          <div className="flex items-center gap-1">
            <span className="relative flex size-1"><span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex size-1 rounded-full bg-emerald-500" /></span>
            <span className="text-[9px] text-emerald-600 dark:text-emerald-400 leading-tight">Monitorando</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="relative transition-all duration-200 hover:bg-primary/5 hover:text-primary"
        >
          <Bell className="size-4" />
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 flex h-4 min-w-4 animate-pulse items-center justify-center rounded-full px-1 text-[10px] shadow-sm"
          >
            3
          </Badge>
          <span className="sr-only">Notificacoes</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full transition-all duration-200 hover:ring-2 hover:ring-primary/20"
            >
              <Avatar className="transition-all duration-200">
                <AvatarFallback className="bg-gradient-to-br from-primary/10 to-violet-500/10 text-xs font-medium text-primary">
                  {user?.initials ?? "?"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 shadow-lg shadow-primary/[0.04]">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
                {user && (
                  <Badge variant="outline" className="w-fit text-[10px] mt-0.5 border-primary/20">
                    {roleLabels[user.role]}
                  </Badge>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigate("/settings")}
              className="transition-colors duration-150 cursor-pointer"
            >
              <User className="size-4" />
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate("/settings")}
              className="transition-colors duration-150 cursor-pointer"
            >
              <Settings className="size-4" />
              Configuracoes
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive transition-colors duration-150 cursor-pointer focus:text-destructive"
            >
              <LogOut className="size-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
