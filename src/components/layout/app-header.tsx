import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
    <header className="sticky top-0 z-30 flex h-[52px] items-center gap-3 border-b border-border bg-background px-5">
      <SidebarTrigger className="text-muted-foreground/60 hover:text-foreground transition-colors" />

      <div className="h-4 w-px bg-border" />

      <h1 className="text-sm font-semibold tracking-tight text-foreground">
        {pageName}
      </h1>

      <div className="flex-1" />

      {/* AI Status */}
      <div className="hidden sm:flex items-center gap-1.5 rounded-md bg-muted/60 px-2 py-1">
        <Sparkles className="size-3 text-primary/70" />
        <span className="text-[11px] font-medium text-muted-foreground">IA</span>
        <span className="relative flex size-1.5">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-50" />
          <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
        </span>
      </div>

      <div className="flex items-center gap-0.5">
        <Button
          variant="ghost"
          size="icon-sm"
          className="relative text-muted-foreground/60 hover:text-foreground"
        >
          <Bell className="size-4" />
          <span className="absolute -top-0.5 -right-0.5 flex size-[14px] items-center justify-center rounded-full bg-primary text-[8px] font-bold text-primary-foreground">
            3
          </span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="rounded-full"
            >
              <Avatar className="size-6">
                <AvatarFallback className="bg-muted text-[9px] font-semibold text-muted-foreground">
                  {user?.initials ?? "?"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-0.5">
                <p className="text-[13px] font-medium">{user?.name}</p>
                <p className="text-[11px] text-muted-foreground">{user?.email}</p>
                {user && (
                  <span className="mt-1 inline-flex w-fit rounded-md bg-primary/8 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                    {roleLabels[user.role]}
                  </span>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/settings")} className="cursor-pointer">
              <User className="size-4" />
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/settings")} className="cursor-pointer">
              <Settings className="size-4" />
              Configuracoes
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive cursor-pointer focus:text-destructive"
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
