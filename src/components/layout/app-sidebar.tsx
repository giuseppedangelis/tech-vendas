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
  Flame,
  Gauge,
  Activity,
  SlidersHorizontal,
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
    label: "Comunicação",
    items: [
      { title: "Inbox", icon: MessageSquare, path: "/inbox", badge: 5 },
      { title: "Agenda", icon: CalendarDays, path: "/schedule" },
    ],
  },
  {
    label: "Gestão",
    items: [
      { title: "Contatos", icon: Users, path: "/contacts" },
      { title: "Equipe", icon: UserCog, path: "/team" },
      { title: "Relatórios", icon: BarChart3, path: "/reports" },
    ],
  },
  {
    label: "SDR",
    items: [
      { title: "Visão Geral", icon: Gauge, path: "/sdr" },
      { title: "Monitoramento", icon: Activity, path: "/sdr/monitoramento" },
      { title: "Configuração", icon: SlidersHorizontal, path: "/sdr/configuracao" },
    ],
  },
  {
    label: "Configuração",
    items: [
      { title: "Configurações", icon: Settings, path: "/settings" },
    ],
  },
]

const roleColors: Record<string, string> = {
  admin: "bg-rose-500/20 text-rose-300",
  gestor: "bg-sky-500/20 text-sky-300",
  closer: "bg-emerald-500/20 text-emerald-300",
  sdr: "bg-amber-500/20 text-amber-300",
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

  const allPaths = allMenuGroups.flatMap((g) => g.items.map((i) => i.path))

  function isActive(path: string) {
    if (location.pathname === path) return true
    if (!location.pathname.startsWith(path + "/")) return false
    return !allPaths.some(
      (p) =>
        p !== path &&
        p.startsWith(path + "/") &&
        (location.pathname === p || location.pathname.startsWith(p + "/"))
    )
  }

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
      <SidebarHeader className="border-b border-white/[0.06] px-5 py-5">
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div className="relative flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-orange-500 shadow-lg shadow-primary/15 transition-all duration-300 group-hover:scale-[1.06] group-hover:shadow-primary/25">
            <Flame className="size-[18px] text-white" />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 to-transparent" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-display text-[13px] font-bold tracking-tight text-white/95">
              Tech Vendas
            </span>
            <span className="text-[8px] font-semibold uppercase tracking-[0.2em] text-primary/60">
              Pro Platform
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        {menuGroups.map((group, groupIndex) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="px-3 mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/20">
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
                        className={`rounded-lg px-3 py-[8px] transition-all duration-200 ${
                          active
                            ? "sidebar-active-indicator bg-white/[0.08] text-white font-medium shadow-sm shadow-black/10"
                            : "text-white/45 hover:bg-white/[0.05] hover:text-white/75"
                        }`}
                      >
                        <Link to={item.path}>
                          <item.icon className={`size-[15px] transition-colors duration-200 ${active ? "text-primary" : ""}`} />
                          <span className="text-[13px]">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                      {item.badge != null && item.badge > 0 && (
                        <SidebarMenuBadge className="bg-gradient-to-br from-primary to-orange-600 text-white text-[10px] font-bold min-w-5 h-5 rounded-md shadow-sm shadow-primary/20">
                          {item.badge}
                        </SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
            {groupIndex < menuGroups.length - 1 && (
              <div className="mx-3 mt-3 mb-1.5 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
            )}
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-white/[0.06] p-4">
        <div className="flex items-center gap-2.5">
          <Avatar className="size-8 ring-1 ring-white/10">
            <AvatarFallback className="bg-gradient-to-br from-white/[0.08] to-white/[0.04] text-[10px] font-semibold text-white/70">
              {user?.initials ?? "?"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[12px] font-medium text-white/80 truncate">
                {user?.name ?? "Usuário"}
              </span>
              {user && (
                <span className={`inline-flex items-center rounded-md px-1.5 py-[2px] text-[9px] font-bold leading-none ${roleColors[user.role]}`}>
                  {roleLabels[user.role]}
                </span>
              )}
            </div>
            <span className="text-[10px] text-white/25 truncate">{user?.email}</span>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg p-1.5 text-white/20 transition-all duration-200 hover:bg-white/[0.06] hover:text-red-400 shrink-0"
            aria-label="Sair"
          >
            <LogOut className="size-3.5" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
