import { lazy, Suspense } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { MainLayout } from "@/components/layout/main-layout"
import { useAuth } from "@/hooks/use-auth"
import { LoginPage } from "@/pages/login"
import type { UserRole } from "@/types"

// Lazy load all pages
const Dashboard = lazy(() =>
  import("@/pages/dashboard").then((m) => ({ default: m.Dashboard }))
)
const DashboardAnalytics = lazy(() =>
  import("@/pages/dashboard/analytics").then((m) => ({
    default: m.DashboardAnalytics,
  }))
)
const InboxPage = lazy(() =>
  import("@/pages/inbox/inbox-page").then((m) => ({
    default: m.InboxPage,
  }))
)
const PipelinePage = lazy(() =>
  import("@/pages/pipeline/pipeline-page").then((m) => ({
    default: m.PipelinePage,
  }))
)
const ContactsPage = lazy(() =>
  import("@/pages/contacts/contacts-page").then((m) => ({
    default: m.ContactsPage,
  }))
)
const ContactDetailPage = lazy(() =>
  import("@/pages/contacts/contact-detail-page").then((m) => ({
    default: m.ContactDetailPage,
  }))
)
const SchedulePage = lazy(() =>
  import("@/pages/schedule/schedule-page").then((m) => ({
    default: m.SchedulePage,
  }))
)
const TeamPage = lazy(() =>
  import("@/pages/team/team-page").then((m) => ({ default: m.TeamPage }))
)
const ReportsPage = lazy(() =>
  import("@/pages/reports/reports-page").then((m) => ({
    default: m.ReportsPage,
  }))
)
const SettingsPage = lazy(() =>
  import("@/pages/settings/settings-page").then((m) => ({
    default: m.SettingsPage,
  }))
)
const SetupPage = lazy(() =>
  import("@/pages/setup/setup-page").then((m) => ({
    default: m.SetupPage,
  }))
)
const SdrOverviewPage = lazy(() =>
  import("@/pages/sdr/sdr-overview-page").then((m) => ({
    default: m.SdrOverviewPage,
  }))
)
const SdrOperationsPage = lazy(() =>
  import("@/pages/sdr/sdr-operations-page").then((m) => ({
    default: m.SdrOperationsPage,
  }))
)
const SdrConfigurationPage = lazy(() =>
  import("@/pages/sdr/sdr-configuration-page").then((m) => ({
    default: m.SdrConfigurationPage,
  }))
)

function PageLoader() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  )
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

function RoleRoute({ children, allow }: { children: React.ReactNode; allow: UserRole[] }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (!allow.includes(user.role)) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

function GuestRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  if (user) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

export function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />

        {/* Protected — MainLayout */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/analytics" element={<DashboardAnalytics />} />
          <Route path="/inbox" element={<InboxPage />} />
          <Route path="/inbox/:conversationId" element={<InboxPage />} />
          <Route path="/pipeline" element={<PipelinePage />} />
          <Route path="/pipeline/:pipelineId" element={<PipelinePage />} />
          <Route path="/pipeline/:pipelineId/funnel" element={<PipelinePage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/contacts/:contactId" element={<ContactDetailPage />} />
          <Route path="/schedule" element={<RoleRoute allow={["admin","gestor","closer"]}><SchedulePage /></RoleRoute>} />
          <Route path="/team" element={<RoleRoute allow={["admin","gestor"]}><TeamPage /></RoleRoute>} />
          <Route path="/team/:memberId" element={<RoleRoute allow={["admin","gestor"]}><TeamPage /></RoleRoute>} />
          <Route path="/reports" element={<RoleRoute allow={["admin","gestor"]}><ReportsPage /></RoleRoute>} />
          <Route path="/reports/:section" element={<RoleRoute allow={["admin","gestor"]}><ReportsPage /></RoleRoute>} />
          <Route path="/sdr" element={<RoleRoute allow={["admin","gestor"]}><SdrOverviewPage /></RoleRoute>} />
          <Route path="/sdr/monitoramento" element={<RoleRoute allow={["admin","gestor"]}><SdrOperationsPage /></RoleRoute>} />
          <Route path="/sdr/monitoramento/:tab" element={<RoleRoute allow={["admin","gestor"]}><SdrOperationsPage /></RoleRoute>} />
          <Route path="/sdr/configuracao" element={<RoleRoute allow={["admin","gestor"]}><SdrConfigurationPage /></RoleRoute>} />
          <Route path="/sdr/configuracao/:tab" element={<RoleRoute allow={["admin","gestor"]}><SdrConfigurationPage /></RoleRoute>} />
          <Route path="/settings" element={<RoleRoute allow={["admin","gestor"]}><SettingsPage /></RoleRoute>} />
          <Route path="/settings/:section" element={<RoleRoute allow={["admin","gestor"]}><SettingsPage /></RoleRoute>} />
          <Route path="/settings/:section/:subsection" element={<RoleRoute allow={["admin","gestor"]}><SettingsPage /></RoleRoute>} />
        </Route>

        {/* Protected — standalone (no sidebar) */}
        <Route path="/setup" element={<ProtectedRoute><SetupPage /></ProtectedRoute>} />
        <Route path="/setup/:step" element={<ProtectedRoute><SetupPage /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  )
}
