"use client"

import { createContext, useContext, useState, ReactNode } from "react"

// 角色类型
export type UserRole = "ops_admin" | "sre" | "tenant_user"

// 租户类型
export interface Tenant {
  id: string
  name: string
  displayName: string
  gpuQuota: number
  gpuUsed: number
  storageQuota: number // TB
  storageUsed: number // TB
  activeTasks: number
  memberCount: number
  createdAt: string
}

// 用户类型
export interface User {
  id: string
  username: string
  email: string
  role: UserRole
  tenantId: string
  avatar?: string
}

// RBAC Context 类型
interface RBACContextType {
  currentUser: User
  currentTenant: Tenant
  tenants: Tenant[]
  users: User[]
  role: UserRole
  setRole: (role: UserRole) => void
  setCurrentTenant: (tenant: Tenant) => void
  hasPermission: (permission: string) => boolean
  getVisibleNavItems: () => string[]
}

// 角色权限映射
const rolePermissions: Record<UserRole, string[]> = {
  ops_admin: [
    "view_dashboard",
    "view_all_stats",
    "manage_tenants",
    "manage_quotas",
    "view_inventory",
    "view_clusters",
    "view_network",
    "view_security",
    "manage_users",
  ],
  sre: [
    "view_dashboard",
    "view_inventory",
    "manage_inventory",
    "view_clusters",
    "manage_clusters",
    "view_network",
    "manage_network",
    "view_security",
    "manage_security",
    "pxe_boot",
    "switch_config",
  ],
  tenant_user: [
    "view_dashboard",
    "view_clusters",
    "view_tenant_stats",
    "view_task_logs",
  ],
}

// 导航项与权限映射
const navPermissions: Record<string, string[]> = {
  "/": ["view_dashboard"],
  "/inventory": ["view_inventory"],
  "/clusters": ["view_clusters"],
  "/network": ["view_network", "manage_network"],
  "/security": ["view_security"],
  "/tenants": ["manage_tenants"],
}

// Mock 租户数据
export const mockTenants: Tenant[] = [
  {
    id: "1",
    name: "llm-team",
    displayName: "大模型组",
    gpuQuota: 64,
    gpuUsed: 32,
    storageQuota: 50,
    storageUsed: 28.5,
    activeTasks: 12,
    memberCount: 8,
    createdAt: "2024-01-10",
  },
  {
    id: "2",
    name: "autonomous-driving",
    displayName: "自动驾驶组",
    gpuQuota: 128,
    gpuUsed: 96,
    storageQuota: 100,
    storageUsed: 72.3,
    activeTasks: 24,
    memberCount: 15,
    createdAt: "2024-01-05",
  },
  {
    id: "3",
    name: "cv-research",
    displayName: "计算机视觉组",
    gpuQuota: 48,
    gpuUsed: 24,
    storageQuota: 30,
    storageUsed: 18.2,
    activeTasks: 6,
    memberCount: 5,
    createdAt: "2024-01-15",
  },
  {
    id: "4",
    name: "nlp-team",
    displayName: "NLP 研究组",
    gpuQuota: 32,
    gpuUsed: 28,
    storageQuota: 20,
    storageUsed: 15.8,
    activeTasks: 8,
    memberCount: 4,
    createdAt: "2024-01-20",
  },
]

// Mock 用户数据
export const mockUsers: User[] = [
  {
    id: "1",
    username: "admin",
    email: "admin@aiinfra.io",
    role: "ops_admin",
    tenantId: "1",
  },
  {
    id: "2",
    username: "sre_zhang",
    email: "zhang@aiinfra.io",
    role: "sre",
    tenantId: "1",
  },
  {
    id: "3",
    username: "user_wang",
    email: "wang@aiinfra.io",
    role: "tenant_user",
    tenantId: "1",
  },
  {
    id: "4",
    username: "user_li",
    email: "li@aiinfra.io",
    role: "tenant_user",
    tenantId: "2",
  },
  {
    id: "5",
    username: "sre_chen",
    email: "chen@aiinfra.io",
    role: "sre",
    tenantId: "2",
  },
  {
    id: "6",
    username: "user_zhao",
    email: "zhao@aiinfra.io",
    role: "tenant_user",
    tenantId: "3",
  },
]

const RBACContext = createContext<RBACContextType | undefined>(undefined)

export function RBACProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>("ops_admin")
  const [currentTenantId, setCurrentTenantId] = useState("1")

  const currentTenant = mockTenants.find((t) => t.id === currentTenantId) || mockTenants[0]
  const currentUser = mockUsers.find((u) => u.role === role) || mockUsers[0]

  const hasPermission = (permission: string) => {
    return rolePermissions[role].includes(permission)
  }

  const getVisibleNavItems = () => {
    const visiblePaths: string[] = []
    Object.entries(navPermissions).forEach(([path, permissions]) => {
      if (permissions.some((p) => rolePermissions[role].includes(p))) {
        visiblePaths.push(path)
      }
    })
    return visiblePaths
  }

  const handleSetCurrentTenant = (tenant: Tenant) => {
    setCurrentTenantId(tenant.id)
  }

  return (
    <RBACContext.Provider
      value={{
        currentUser,
        currentTenant,
        tenants: mockTenants,
        users: mockUsers,
        role,
        setRole,
        setCurrentTenant: handleSetCurrentTenant,
        hasPermission,
        getVisibleNavItems,
      }}
    >
      {children}
    </RBACContext.Provider>
  )
}

export function useRBAC() {
  const context = useContext(RBACContext)
  if (context === undefined) {
    throw new Error("useRBAC must be used within a RBACProvider")
  }
  return context
}

// 角色显示名称
export const roleDisplayNames: Record<UserRole, string> = {
  ops_admin: "产品运营",
  sre: "运维人员",
  tenant_user: "租户用户",
}
