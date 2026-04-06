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
      <SidebarInset className="relative">
        {/* Ambient mesh gradient background */}
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-primary/[0.02] blur-[120px]" />
          <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-chart-2/[0.015] blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-chart-4/[0.01] blur-[140px]" />
        </div>

        <AppHeader />
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
