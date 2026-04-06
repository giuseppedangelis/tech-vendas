import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Kanban, LogIn, Eye, EyeOff } from "lucide-react"

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

export function LoginPage() {
  const { login, allUsers } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    // Simulate brief loading
    setTimeout(() => {
      const err = login(email, password)
      if (err) {
        setError(err)
        setLoading(false)
      } else {
        navigate("/dashboard", { replace: true })
      }
    }, 300)
  }

  function handleQuickLogin(userEmail: string) {
    setError(null)
    setLoading(true)
    setTimeout(() => {
      const err = login(userEmail, "123456")
      if (err) {
        setError(err)
        setLoading(false)
      } else {
        navigate("/dashboard", { replace: true })
      }
    }, 300)
  }

  return (
    <div className="animate-page-in relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background p-4">
      {/* Subtle grid pattern background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Radial glow behind form */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.06] blur-[120px]" />

      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="glow-primary flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-violet-600 text-primary-foreground shadow-lg shadow-primary/20">
            <Kanban className="size-7" />
          </div>
          <div className="text-center">
            <h1 className="text-gradient text-3xl font-bold tracking-tight">
              Tech Vendas Pro
            </h1>
            <p className="mt-1 text-sm font-medium text-muted-foreground">
              Decisoes comerciais inteligentes
            </p>
          </div>
        </div>

        {/* Login Form */}
        <Card className="glass animate-card-in stagger-1 border-border/50 shadow-xl shadow-primary/[0.04]">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Entrar na plataforma</CardTitle>
            <CardDescription>Use suas credenciais para acessar</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors duration-150 hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <Button
                type="submit"
                className="btn-lift w-full bg-gradient-to-r from-primary to-violet-600 text-primary-foreground shadow-md shadow-primary/20 transition-all duration-200 hover:from-primary/90 hover:to-violet-600/90"
                disabled={loading}
              >
                {loading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                ) : (
                  <>
                    <LogIn className="size-4" />
                    Entrar
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Quick Access */}
        <Card className="glass animate-card-in stagger-2 border-border/50 shadow-lg shadow-primary/[0.03]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Acesso rapido por persona</CardTitle>
            <CardDescription className="text-xs">
              Clique em um usuario para entrar diretamente. Senha: <code className="rounded bg-muted px-1 font-mono text-xs">123456</code>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {allUsers.map((u, index) => (
              <button
                key={u.id}
                onClick={() => handleQuickLogin(u.email)}
                disabled={loading}
                className={`card-hover animate-card-in stagger-${Math.min(index + 2, 6)} flex w-full items-center gap-3 rounded-lg border border-border/50 p-3 text-left transition-all duration-200 hover:bg-accent/60 hover:border-primary/20 disabled:opacity-50`}
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-violet-500/10 font-medium text-sm text-primary">
                  {u.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">{u.name}</span>
                    <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 ${roleBadgeColors[u.role]}`}>
                      {roleLabels[u.role]}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">{u.email}</span>
                </div>
                <LogIn className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
            ))}

            <Separator className="my-3" />

            <div className="rounded-lg bg-muted/40 p-3 backdrop-blur-sm">
              <p className="text-xs font-medium mb-2">Credenciais de acesso:</p>
              <div className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Admin</span>
                <span className="font-mono">carlos@techvendas.com</span>
                <span className="font-medium text-foreground">Gestor</span>
                <span className="font-mono">ana@techvendas.com</span>
                <span className="font-medium text-foreground">Closer 1</span>
                <span className="font-mono">rafael@techvendas.com</span>
                <span className="font-medium text-foreground">Closer 2</span>
                <span className="font-mono">juliana@techvendas.com</span>
                <span className="font-medium text-foreground">SDR</span>
                <span className="font-mono">pedro@techvendas.com</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Senha para todos: <code className="rounded bg-background px-1 font-mono">123456</code>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
