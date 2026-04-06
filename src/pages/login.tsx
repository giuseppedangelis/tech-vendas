import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Flame, LogIn, Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react"

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
      <div className="hidden lg:flex lg:w-[46%] relative overflow-hidden bg-[oklch(0.12_0.012_55)] items-end p-12 pb-16">
        {/* Ambient glows */}
        <div className="pointer-events-none absolute top-[20%] left-[60%] -translate-x-1/2 h-[700px] w-[700px] rounded-full bg-primary/[0.07] blur-[150px]" />
        <div className="pointer-events-none absolute bottom-[10%] right-[10%] h-[400px] w-[400px] rounded-full bg-orange-500/[0.05] blur-[100px]" />
        <div className="pointer-events-none absolute top-[60%] left-[20%] h-[300px] w-[300px] rounded-full bg-chart-2/[0.03] blur-[80px]" />

        {/* Grid pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />

        {/* Diagonal decorative line */}
        <div className="pointer-events-none absolute top-0 right-0 w-[1px] h-[200%] bg-gradient-to-b from-transparent via-primary/20 to-transparent rotate-[30deg] translate-x-[-100px]" />

        <div className="relative z-10 max-w-md space-y-12">
          <div className="relative flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-orange-500 shadow-xl shadow-primary/20">
            <Flame className="size-6 text-white" />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/15 to-transparent" />
          </div>

          <div className="space-y-5">
            <h1 className="font-display text-[2.75rem] font-bold tracking-tight text-white/95 leading-[1.08]">
              Decisoes<br />comerciais mais<br />inteligentes.
            </h1>
            <p className="text-[15px] leading-relaxed text-white/35 max-w-[320px]">
              CRM potencializado por IA para equipes que buscam performance e previsibilidade.
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-10">
            {[
              { value: "23%", label: "mais conversao" },
              { value: "2.3x", label: "ROI medio" },
              { value: "12min", label: "SLA medio" },
            ].map((stat) => (
              <div key={stat.label} className="space-y-1">
                <p className="font-display text-2xl font-bold text-white/90">{stat.value}</p>
                <p className="text-[11px] font-medium text-white/25 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* AI badge */}
          <div className="flex items-center gap-2 rounded-xl bg-white/[0.04] border border-white/[0.06] px-4 py-3 w-fit">
            <Sparkles className="size-4 text-primary/70" />
            <span className="text-[12px] font-medium text-white/50">Powered by AI — Analise em tempo real</span>
          </div>
        </div>
      </div>

      {/* ── Right: form ─────────────────────────── */}
      <div className="relative flex flex-1 items-center justify-center bg-background p-6 lg:p-16">
        {/* Subtle ambient glow */}
        <div className="pointer-events-none absolute top-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-primary/[0.02] blur-[100px]" />

        <div className="relative w-full max-w-[400px] space-y-8">
          {/* Mobile branding */}
          <div className="flex flex-col items-center gap-3 lg:hidden">
            <div className="relative flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-orange-500 shadow-lg shadow-primary/15">
              <Flame className="size-6 text-white" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/15 to-transparent" />
            </div>
            <h1 className="font-display text-xl font-bold tracking-tight">
              Tech Vendas Pro
            </h1>
          </div>

          {/* Desktop heading */}
          <div className="hidden lg:block space-y-2">
            <h2 className="font-display text-xl font-bold tracking-tight">
              Entrar na plataforma
            </h2>
            <p className="text-[13px] text-muted-foreground/80">
              Use suas credenciais para acessar o sistema
            </p>
          </div>

          {/* Form card */}
          <Card className="animate-card-in stagger-1 overflow-visible">
            <CardContent className="pt-6 pb-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
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
                <div className="space-y-2">
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
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 transition-colors hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="rounded-lg bg-destructive/8 border border-destructive/15 px-3 py-2">
                    <p className="text-[13px] text-destructive">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="gradient"
                  size="lg"
                  className="btn-lift w-full"
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
          <div className="animate-card-in stagger-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-border" />
              <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">Acesso rapido</span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-border" />
            </div>

            <div className="space-y-2">
              {allUsers.map((u, index) => (
                <button
                  key={u.id}
                  onClick={() => handleQuickLogin(u.email)}
                  disabled={loading}
                  className={`animate-card-in stagger-${Math.min(index + 2, 6)} group flex w-full items-center gap-3 rounded-xl border border-border/60 bg-card/50 px-3.5 py-3 text-left transition-all duration-200 hover:border-primary/20 hover:bg-card hover:shadow-sm hover:shadow-primary/5 disabled:opacity-50 backdrop-blur-sm`}
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-muted to-muted/60 text-[10px] font-bold text-muted-foreground">
                    {u.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-medium truncate">{u.name}</span>
                      <span className={`inline-flex items-center rounded-md px-1.5 py-[2px] text-[9px] font-bold leading-none ${roleColors[u.role]}`}>
                        {roleLabels[u.role]}
                      </span>
                    </div>
                    <span className="text-[11px] text-muted-foreground/50">{u.email}</span>
                  </div>
                  <ArrowRight className="size-3.5 shrink-0 text-muted-foreground/15 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-primary/50" />
                </button>
              ))}
            </div>

            <p className="text-center text-[10px] text-muted-foreground/40">
              Senha: <code className="rounded-md bg-muted/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground/60">123456</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
