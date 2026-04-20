import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { UserRole } from "@/types"

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
  initials: string
}

// Which routes each role can access
const roleAccess: Record<UserRole, string[]> = {
  admin: ["/dashboard", "/pipeline", "/inbox", "/schedule", "/contacts", "/team", "/reports", "/sdr", "/settings", "/setup"],
  gestor: ["/dashboard", "/pipeline", "/inbox", "/schedule", "/contacts", "/team", "/reports", "/sdr", "/settings"],
  closer: ["/dashboard", "/pipeline", "/inbox", "/schedule", "/contacts"],
  sdr: ["/dashboard", "/pipeline", "/inbox", "/contacts"],
}

export function canAccess(role: UserRole, path: string): boolean {
  return roleAccess[role].some((r) => path === r || path.startsWith(r + "/"))
}

const users: AuthUser[] = [
  { id: "u1", name: "Carlos Eduardo", email: "carlos@techvendas.com", role: "admin", initials: "CE" },
  { id: "u2", name: "Ana Beatriz", email: "ana@techvendas.com", role: "gestor", initials: "AB" },
  { id: "u3", name: "Rafael Silva", email: "rafael@techvendas.com", role: "closer", initials: "RS" },
  { id: "u4", name: "Juliana Santos", email: "juliana@techvendas.com", role: "closer", initials: "JS" },
  { id: "u5", name: "Pedro Henrique", email: "pedro@techvendas.com", role: "sdr", initials: "PH" },
]

// During the prototype phase, Gestor and Closer profiles can sign in.
// Other profiles remain listed for future unlocking but are blocked here.
export const ENABLED_ROLES: UserRole[] = ["gestor", "closer"]

export function isUserEnabled(user: AuthUser): boolean {
  return ENABLED_ROLES.includes(user.role)
}

// Credentials: email = email field, password = "123456" for all
const MOCK_PASSWORD = "123456"

interface AuthContextValue {
  user: AuthUser | null
  login: (email: string, password: string) => string | null
  logout: () => void
  allUsers: AuthUser[]
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem("tv_user")
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as AuthUser
        if (!isUserEnabled(parsed)) {
          localStorage.removeItem("tv_user")
          return null
        }
        return parsed
      } catch {
        return null
      }
    }
    return null
  })

  const login = useCallback((email: string, password: string): string | null => {
    if (password !== MOCK_PASSWORD) return "Senha incorreta"
    const found = users.find((u) => u.email === email)
    if (!found) return "Usuário não encontrado"
    if (!isUserEnabled(found)) return "Perfil temporariamente indisponível no protótipo"
    setUser(found)
    localStorage.setItem("tv_user", JSON.stringify(found))
    return null
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem("tv_user")
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout, allUsers: users }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
