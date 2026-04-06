// ── Lead / Contact ──────────────────────────────────────────────

export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "proposal"
  | "negotiation"
  | "won"
  | "lost"

export type LeadPriority = "low" | "medium" | "high" | "urgent"

export type Channel =
  | "whatsapp"
  | "instagram"
  | "telegram"
  | "form"
  | "manual"
  | "webhook"

export type Methodology = "def" | "spin" | "bant" | "none"

export type UserRole = "admin" | "gestor" | "closer" | "sdr"

export interface Lead {
  id: string
  name: string
  email?: string
  phone: string
  company?: string
  value?: number
  score: number
  status: LeadStatus
  priority: LeadPriority
  channel: Channel
  pipelineId: string
  stageId: string
  assignedTo?: string
  tags: string[]
  customFields: Record<string, string | number | boolean>
  isLocked: boolean
  lockedBy?: string
  lastInteraction?: string
  createdAt: string
  updatedAt: string
}

export interface Contact {
  id: string
  name: string
  email?: string
  phone: string
  company?: string
  role?: string
  source: Channel
  tags: string[]
  score: number
  lifecycleStage:
    | "lead"
    | "mql"
    | "sql"
    | "opportunity"
    | "customer"
    | "churned"
  customFields: Record<string, string | number | boolean>
  createdAt: string
  updatedAt: string
}

// ── Pipeline ────────────────────────────────────────────────────

export interface Pipeline {
  id: string
  name: string
  description?: string
  stages: PipelineStage[]
  isDefault: boolean
  createdAt: string
}

export interface PipelineStage {
  id: string
  name: string
  color: string
  order: number
  description?: string
  objective?: string
  kpis?: string[]
  responsibleRole?: UserRole
  automationRules: AutomationRule[]
}

export interface AutomationRule {
  id: string
  trigger:
    | "whatsapp_reply"
    | "form_submit"
    | "payment_webhook"
    | "scheduled"
    | "no_show"
    | "manual"
  action:
    | "move_stage"
    | "assign_closer"
    | "send_message"
    | "create_task"
    | "update_field"
    | "notify"
  targetStageId?: string
  config: Record<string, unknown>
}

// ── Messaging ───────────────────────────────────────────────────

export interface Conversation {
  id: string
  contactId: string
  contactName: string
  contactPhone: string
  contactAvatar?: string
  channel: Channel
  status: "open" | "closed" | "waiting" | "paused"
  assignedTo?: string
  assignedName?: string
  lastMessage?: string
  lastMessageAt?: string
  unreadCount: number
  labels: string[]
  createdAt: string
}

export interface Message {
  id: string
  conversationId: string
  content: string
  type:
    | "text"
    | "image"
    | "audio"
    | "video"
    | "document"
    | "template"
    | "system"
  direction: "inbound" | "outbound"
  status: "pending" | "sent" | "delivered" | "read" | "failed"
  senderName?: string
  timestamp: string
  metadata?: Record<string, unknown>
}

// ── Dashboard ───────────────────────────────────────────────────

export interface DashboardStats {
  totalLeads: number
  totalLeadsChange: number
  activeDeals: number
  activeDealsChange: number
  conversionRate: number
  conversionRateChange: number
  totalRevenue: number
  totalRevenueChange: number
  avgResponseTime: string
  avgResponseTimeChange: number
}

export interface FunnelData {
  stageId: string
  stageName: string
  count: number
  value: number
  conversionRate: number
  avgTimeInStage: string
  dropoffRate: number
}

export interface TeamMemberStats {
  id: string
  name: string
  avatar?: string
  role: UserRole
  dealsWon: number
  dealsLost: number
  totalValue: number
  conversionRate: number
  avgResponseTime: string
  slaCompliance: number
}

// ── Schedule ────────────────────────────────────────────────────

export interface Appointment {
  id: string
  leadId: string
  leadName: string
  closerId: string
  closerName: string
  type: "call" | "meeting" | "demo" | "follow_up"
  status:
    | "scheduled"
    | "confirmed"
    | "completed"
    | "no_show"
    | "cancelled"
    | "rescheduled"
  scheduledAt: string
  duration: number
  notes?: string
}

// ── AI ──────────────────────────────────────────────────────────

export interface AISuggestion {
  id: string
  type: "response" | "objection" | "next_step" | "score_explanation"
  content: string
  methodology: Methodology
  confidence: number
  context?: string
}

export interface AIInsight {
  id: string
  type: "alert" | "recommendation" | "pattern" | "anomaly"
  title: string
  description: string
  severity: "info" | "warning" | "critical"
  actionable: boolean
  suggestedAction?: string
  relatedEntityId?: string
  createdAt: string
}

// ── Team ────────────────────────────────────────────────────────

export interface TeamMember {
  id: string
  name: string
  email: string
  avatar?: string
  role: UserRole
  isActive: boolean
  joinedAt: string
}

// ── Settings ────────────────────────────────────────────────────

export interface Tag {
  id: string
  name: string
  color: string
  category?: string
}

export interface CustomField {
  id: string
  key: string
  label: string
  type: "text" | "number" | "date" | "select" | "boolean"
  options?: string[]
  required: boolean
  entityType: "lead" | "contact"
}
