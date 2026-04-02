"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useRBAC, roleDisplayNames, UserRole } from "@/lib/rbac-context"
import {
  LayoutDashboard,
  Server,
  Network,
  Database,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Activity,
  Shield,
  Users,
  ChevronDown,
  Check,
  Bug,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface MainLayoutProps {
  children: React.ReactNode
}

// 完整导航项（包含权限要求）
const allNavItems = [
  {
    title: "概览",
    href: "/",
    icon: LayoutDashboard,
    permissions: ["view_dashboard"],
  },
  {
    title: "资源池",
    href: "/inventory",
    icon: Database,
    permissions: ["view_inventory"],
  },
  {
    title: "集群管理",
    href: "/clusters",
    icon: Server,
    permissions: ["view_clusters"],
  },
  {
    title: "网络配置",
    href: "/network",
    icon: Network,
    permissions: ["view_network", "manage_network"],
  },
  {
    title: "安全中心",
    href: "/security",
    icon: Shield,
    permissions: ["view_security"],
  },
  {
    title: "租户管理",
    href: "/tenants",
    icon: Users,
    permissions: ["manage_tenants"],
  },
]

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
  ],
  tenant_user: [
    "view_dashboard",
    "view_clusters",
    "view_tenant_stats",
    "view_task_logs",
  ],
}

// Mock data for header stats
const headerStats = {
  totalGPU: 256,
  onlineGPU: 248,
  harborStatus: "online" as const,
  nexusStatus: "online" as const,
}

export function MainLayout({ children }: MainLayoutProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const { role, setRole, currentTenant, tenants, setCurrentTenant, hasPermission } = useRBAC()

  // 根据角色过滤可见的导航项
  const visibleNavItems = allNavItems.filter((item) =>
    item.permissions.some((p) => rolePermissions[role].includes(p))
  )

  return (
    <TooltipProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        {/* Sidebar */}
        <aside
          className={cn(
            "flex flex-col border-r border-border bg-sidebar transition-all duration-300",
            collapsed ? "w-16" : "w-60"
          )}
        >
          {/* Logo */}
          <div className="flex h-16 items-center border-b border-border px-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Cpu className="h-5 w-5 text-primary-foreground" />
              </div>
              {!collapsed && (
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground">
                    AI-Infra OS
                  </span>
                  <span className="text-xs text-muted-foreground">
                    集群管控平台
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-2">
            {visibleNavItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <Tooltip key={item.href} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                      )}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </Link>
                  </TooltipTrigger>
                  {collapsed && (
                    <TooltipContent side="right">
                      {item.title}
                    </TooltipContent>
                  )}
                </Tooltip>
              )
            })}
          </nav>

          {/* Collapse Toggle */}
          <div className="border-t border-border p-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-center"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header */}
          <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
            <div className="flex items-center gap-6">
              {/* Tenant Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Users className="h-4 w-4" />
                    <span className="max-w-[120px] truncate">{currentTenant.displayName}</span>
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuLabel>切换租户</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {tenants.map((tenant) => (
                    <DropdownMenuItem
                      key={tenant.id}
                      onClick={() => setCurrentTenant(tenant)}
                      className="flex items-center justify-between"
                    >
                      <span>{tenant.displayName}</span>
                      {currentTenant.id === tenant.id && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="h-4 w-px bg-border" />

              {/* GPU Stats */}
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">总 GPU:</span>
                <span className="text-sm font-semibold text-foreground">
                  {headerStats.totalGPU}
                </span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full status-online" />
                <span className="text-sm text-muted-foreground">在线:</span>
                <span className="text-sm font-semibold text-[#22c55e]">
                  {headerStats.onlineGPU}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Role Switcher (Debug) */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Bug className="h-3 w-3" />
                    <span className="text-xs">{roleDisplayNames[role]}</span>
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    调试: 切换角色视角
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setRole("ops_admin")}>
                    <div className="flex items-center justify-between w-full">
                      <span>产品运营</span>
                      {role === "ops_admin" && <Check className="h-4 w-4 text-primary" />}
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRole("sre")}>
                    <div className="flex items-center justify-between w-full">
                      <span>运维人员</span>
                      {role === "sre" && <Check className="h-4 w-4 text-primary" />}
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRole("tenant_user")}>
                    <div className="flex items-center justify-between w-full">
                      <span>租户用户</span>
                      {role === "tenant_user" && <Check className="h-4 w-4 text-primary" />}
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Harbor Status */}
              <div className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-1.5">
                <div
                  className={cn(
                    "h-2 w-2 rounded-full",
                    headerStats.harborStatus === "online"
                      ? "status-online"
                      : "status-offline"
                  )}
                />
                <span className="text-xs font-medium text-foreground">
                  Harbor
                </span>
              </div>

              {/* Nexus Status */}
              <div className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-1.5">
                <div
                  className={cn(
                    "h-2 w-2 rounded-full",
                    headerStats.nexusStatus === "online"
                      ? "status-online"
                      : "status-offline"
                  )}
                />
                <span className="text-xs font-medium text-foreground">
                  Nexus
                </span>
              </div>

              {/* Current Role Badge */}
              <Badge 
                variant="outline" 
                className={cn(
                  "text-xs",
                  role === "ops_admin" && "border-primary text-primary",
                  role === "sre" && "border-[#f59e0b] text-[#f59e0b]",
                  role === "tenant_user" && "border-[#8b5cf6] text-[#8b5cf6]"
                )}
              >
                {roleDisplayNames[role]}
              </Badge>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </div>
    </TooltipProvider>
  )
}
