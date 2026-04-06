import { Outlet, useLocation } from "react-router-dom"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { AppHeader } from "@/components/layout/app-header"

export function MainLayout() {
  const location = useLocation()
  const isFullHeight = location.pathname.startsWith("/inbox")

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <div className="h-px bg-border/40" />
        <main
          key={location.pathname}
          className={`animate-page-in ${isFullHeight ? "flex-1 overflow-hidden" : "flex-1 p-6"}`}
        >
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
