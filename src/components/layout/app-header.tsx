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
import { Bell, Settings, LogOut, User, Sparkles, Command } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/use-auth"

const roleLabels: Record<string, string> = {
  admin: "Admin",
  gestor: "Gestor",
  closer: "Closer",
  sdr: "SDR",
}

const roleColors: Record<string, string> = {
  admin: "bg-rose-500/10 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400",
  gestor: "bg-sky-500/10 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400",
  closer: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
  sdr: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
}

export function AppHeader() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  function handleLogout() {
    logout()
    navigate("/login", { replace: true })
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/50 bg-background/70 px-5 backdrop-blur-xl">
      <SidebarTrigger className="text-muted-foreground/50 hover:text-foreground transition-colors" />

      <div className="flex-1" />

      {/* Search hint */}
      <button className="hidden md:flex items-center gap-2 rounded-lg border border-border/60 bg-muted/40 px-3 py-1.5 text-muted-foreground/50 transition-all duration-200 hover:bg-muted/60 hover:text-muted-foreground hover:border-border">
        <Command className="size-3" />
        <span className="text-[11px] font-medium">Buscar...</span>
        <kbd className="ml-3 inline-flex h-5 items-center rounded border border-border/60 bg-background/60 px-1.5 text-[10px] font-mono text-muted-foreground/40">
          ⌘K
        </kbd>
      </button>

      {/* AI Status */}
      <div className="hidden sm:flex items-center gap-2 rounded-lg ai-shimmer px-2.5 py-1.5">
        <Sparkles className="size-3 text-primary" />
        <span className="text-[11px] font-semibold ai-text-shimmer">IA Ativa</span>
        <span className="relative flex size-1.5">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-50" />
          <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]" />
        </span>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon-sm"
          className="relative text-muted-foreground/50 hover:text-foreground"
        >
          <Bell className="size-4" />
          <span className="absolute -top-0.5 -right-0.5 flex size-[15px] items-center justify-center rounded-full bg-gradient-to-br from-primary to-orange-600 text-[8px] font-bold text-white shadow-sm shadow-primary/20">
            3
          </span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="rounded-full ring-1 ring-border/50 hover:ring-border"
            >
              <Avatar className="size-7">
                <AvatarFallback className="bg-gradient-to-br from-muted to-muted/60 text-[9px] font-semibold text-muted-foreground">
                  {user?.initials ?? "?"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-1">
                <p className="text-[13px] font-semibold">{user?.name}</p>
                <p className="text-[11px] text-muted-foreground">{user?.email}</p>
                {user && (
                  <span className={`mt-0.5 inline-flex w-fit rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${roleColors[user.role]}`}>
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
              Configurações
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
