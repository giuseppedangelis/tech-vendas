import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Flame, LogIn, Eye, EyeOff, ArrowRight } from "lucide-react"

const roleColors: Record<string, string> = {
  admin: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  gestor: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  closer: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  sdr: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
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
    <div className="animate-page-in relative flex min-h-screen">
      {/* ── Left: brand panel ───────────────────── */}
      <div className="hidden lg:flex lg:w-[44%] relative overflow-hidden bg-[oklch(0.14_0.01_55)] items-end p-10 pb-14">
        {/* Warm glow */}
        <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-primary/[0.06] blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-[350px] w-[350px] rounded-full bg-orange-500/[0.04] blur-[90px]" />

        {/* Grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        <div className="relative z-10 max-w-md space-y-10">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-orange-500">
            <Flame className="size-5 text-white" />
          </div>

          <div className="space-y-4">
            <h1 className="font-display text-[2.5rem] font-semibold tracking-tight text-white/95 leading-[1.1]">
              Decisoes<br />comerciais mais<br />inteligentes.
            </h1>
            <p className="text-[15px] leading-relaxed text-white/40 max-w-xs">
              CRM potencializado por IA para equipes que buscam performance e previsibilidade.
            </p>
          </div>

          <div className="flex items-center gap-8">
            {[
              { value: "23%", label: "mais conversao" },
              { value: "2.3x", label: "ROI medio" },
              { value: "12min", label: "SLA medio" },
            ].map((stat) => (
              <div key={stat.label} className="space-y-0.5">
                <p className="font-display text-xl font-semibold text-white/85">{stat.value}</p>
                <p className="text-[11px] text-white/30">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right: form ─────────────────────────── */}
      <div className="flex flex-1 items-center justify-center bg-background p-6 lg:p-16">
        <div className="w-full max-w-[380px] space-y-8">
          {/* Mobile branding */}
          <div className="flex flex-col items-center gap-3 lg:hidden">
            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-orange-500 shadow-lg">
              <Flame className="size-5 text-white" />
            </div>
            <h1 className="font-display text-xl font-semibold tracking-tight">
              Tech Vendas Pro
            </h1>
          </div>

          {/* Desktop heading */}
          <div className="hidden lg:block space-y-1.5">
            <h2 className="text-lg font-semibold tracking-tight">
              Entrar na plataforma
            </h2>
            <p className="text-[13px] text-muted-foreground">
              Use suas credenciais para acessar o sistema
            </p>
          </div>

          {/* Form card */}
          <Card className="animate-card-in stagger-1">
            <CardContent className="pt-5 pb-5">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-[13px] font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-[13px] font-medium">Senha</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite sua senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 transition-colors hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="text-[13px] text-destructive">{error}</p>
                )}

                <Button
                  type="submit"
                  className="btn-lift w-full bg-gradient-to-r from-primary to-orange-600 text-white shadow-md shadow-primary/10"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
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

          {/* Quick access */}
          <div className="animate-card-in stagger-2 space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-[11px] font-medium text-muted-foreground/60 uppercase tracking-wider">Acesso rapido</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="space-y-1.5">
              {allUsers.map((u, index) => (
                <button
                  key={u.id}
                  onClick={() => handleQuickLogin(u.email)}
                  disabled={loading}
                  className={`animate-card-in stagger-${Math.min(index + 2, 6)} group flex w-full items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5 text-left transition-all duration-150 hover:border-primary/15 hover:shadow-sm disabled:opacity-50`}
                >
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-[10px] font-semibold text-muted-foreground">
                    {u.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[13px] font-medium truncate">{u.name}</span>
                      <span className={`inline-flex items-center rounded-md px-1.5 py-[1px] text-[9px] font-semibold leading-none ${roleColors[u.role]}`}>
                        {roleLabels[u.role]}
                      </span>
                    </div>
                    <span className="text-[11px] text-muted-foreground/60">{u.email}</span>
                  </div>
                  <ArrowRight className="size-3 shrink-0 text-muted-foreground/20 transition-all duration-150 group-hover:translate-x-0.5 group-hover:text-primary/50" />
                </button>
              ))}
            </div>

            <p className="text-center text-[10px] text-muted-foreground/50">
              Senha: <code className="rounded bg-muted px-1 py-0.5 font-mono text-[10px]">123456</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
