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

  function isActive(path: string) {
    return location.pathname === path || location.pathname.startsWith(path + "/")
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
          <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-orange-500 shadow-lg shadow-primary/10 transition-transform duration-200 group-hover:scale-[1.04]">
            <Flame className="size-4 text-white" />
          </div>
          <div className="flex flex-col gap-0">
            <span className="font-display text-sm font-semibold tracking-tight text-white/95">
              Tech Vendas
            </span>
            <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-white/30">
              Pro
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3 py-3">
        {menuGroups.map((group, groupIndex) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="px-3 mb-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/25">
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
                        className={`rounded-lg px-3 py-[7px] transition-all duration-150 ${
                          active
                            ? "bg-white/[0.07] text-white font-medium"
                            : "text-white/50 hover:bg-white/[0.04] hover:text-white/80"
                        }`}
                      >
                        <Link to={item.path}>
                          <item.icon className={`size-4 ${active ? "text-primary" : ""}`} />
                          <span className="text-[13px]">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                      {item.badge != null && item.badge > 0 && (
                        <SidebarMenuBadge className="bg-primary text-white text-[10px] font-semibold min-w-5 h-5 rounded-md">
                          {item.badge}
                        </SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
            {groupIndex < menuGroups.length - 1 && (
              <div className="mx-3 mt-2 mb-1 h-px bg-white/[0.04]" />
            )}
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-white/[0.06] p-4">
        <div className="flex items-center gap-2.5">
          <Avatar className="size-7">
            <AvatarFallback className="bg-white/[0.07] text-[10px] font-semibold text-white/70">
              {user?.initials ?? "?"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[12px] font-medium text-white/80 truncate">
                {user?.name ?? "Usuario"}
              </span>
              {user && (
                <span className={`inline-flex items-center rounded-md px-1.5 py-[1px] text-[9px] font-semibold leading-none ${roleColors[user.role]}`}>
                  {roleLabels[user.role]}
                </span>
              )}
            </div>
            <span className="text-[10px] text-white/30 truncate">{user?.email}</span>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-md p-1.5 text-white/25 transition-colors duration-150 hover:bg-white/[0.05] hover:text-red-400 shrink-0"
            aria-label="Sair"
          >
            <LogOut className="size-3.5" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
