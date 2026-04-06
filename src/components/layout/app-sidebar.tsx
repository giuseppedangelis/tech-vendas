import {
  LayoutDashboard,
  Kanban,
  MessageSquare,
  CalendarDays,
  Users,
  UserCog,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react"
import { useLocation, Link, useNavigate } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth, canAccess } from "@/hooks/use-auth"
import type { LucideIcon } from "lucide-react"

interface MenuItem {
  title: string
  icon: LucideIcon
  path: string
  badge?: number
}

interface MenuGroup {
  label: string
  items: MenuItem[]
}

const allMenuGroups: MenuGroup[] = [
  {
    label: "Principal",
    items: [
      { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
      { title: "Pipeline", icon: Kanban, path: "/pipeline" },
    ],
  },
  {
    label: "Comunicacao",
    items: [
      { title: "Inbox", icon: MessageSquare, path: "/inbox", badge: 5 },
      { title: "Agenda", icon: CalendarDays, path: "/schedule" },
    ],
  },
  {
    label: "Gestao",
    items: [
      { title: "Contatos", icon: Users, path: "/contacts" },
      { title: "Equipe", icon: UserCog, path: "/team" },
      { title: "Relatorios", icon: BarChart3, path: "/reports" },
    ],
  },
  {
    label: "Configuracao",
    items: [
      { title: "Configuracoes", icon: Settings, path: "/settings" },
    ],
  },
]

const roleBadgeColors: Record<string, string> = {
  admin: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  gestor: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  closer: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  sdr: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
}

const roleLabels: Record<string, string> = {
  admin: "Admin",
  gestor: "Gestor",
  closer: "Closer",
  sdr: "SDR",
}

export function AppSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  function isActive(path: string) {
    return location.pathname === path || location.pathname.startsWith(path + "/")
  }

  // Filter menu items by role
  const menuGroups = allMenuGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) =>
        user ? canAccess(user.role, item.path) : false
      ),
    }))
    .filter((group) => group.items.length > 0)

  function handleLogout() {
    logout()
    navigate("/login", { replace: true })
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border/60 px-6 py-4">
        <Link to="/dashboard" className="flex items-center gap-3 transition-opacity duration-200 hover:opacity-80">
          <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-violet-600 text-primary-foreground shadow-md shadow-primary/20">
            <Kanban className="size-4" />
          </div>
          <span className="text-gradient text-lg font-bold tracking-tight">
            Tech Vendas Pro
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {menuGroups.map((group, groupIndex) => (
          <SidebarGroup key={group.label} className="animate-card-in" style={{ animationDelay: `${groupIndex * 0.05}s` }}>
            <SidebarGroupLabel className="px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const active = isActive(item.path)
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        className={`transition-all duration-200 ${
                          active
                            ? "border-l-[3px] border-l-primary bg-primary/[0.06] font-medium text-primary"
                            : "border-l-[3px] border-l-transparent hover:bg-accent/50 hover:border-l-primary/30"
                        }`}
                      >
                        <Link to={item.path}>
                          <item.icon className={`size-4 ${active ? "text-primary" : ""}`} />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                      {item.badge != null && item.badge > 0 && (
                        <SidebarMenuBadge className="bg-primary/10 text-primary font-semibold">
                          {item.badge}
                        </SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
            {/* Gradient separator between groups */}
            {groupIndex < menuGroups.length - 1 && (
              <div className="mx-3 mt-1 h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />
            )}
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/60 p-4">
        <div className="flex items-center gap-3">
          <Avatar className="ring-2 ring-primary/20 transition-all duration-200 hover:ring-primary/40">
            <AvatarFallback className="bg-gradient-to-br from-primary/10 to-violet-500/10 text-xs font-medium text-primary">
              {user?.initials ?? "?"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-col text-sm leading-tight min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-medium truncate">{user?.name ?? "Usuario"}</span>
              {user && (
                <Badge
                  variant="secondary"
                  className={`text-[9px] px-1.5 py-0 leading-tight shrink-0 shadow-sm ${roleBadgeColors[user.role]}`}
                >
                  {roleLabels[user.role]}
                </Badge>
              )}
            </div>
            <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-md p-1.5 text-muted-foreground transition-all duration-200 hover:bg-destructive/10 hover:text-destructive shrink-0"
            aria-label="Sair"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
