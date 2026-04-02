"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import {
  useRBAC,
  mockTenants,
  mockUsers,
  Tenant,
  User,
  UserRole,
  roleDisplayNames,
} from "@/lib/rbac-context"
import {
  Users,
  HardDrive,
  Cpu,
  Activity,
  Plus,
  Settings,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  UserPlus,
} from "lucide-react"

export default function TenantsPage() {
  const { tenants } = useRBAC()
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddTenantOpen, setIsAddTenantOpen] = useState(false)

  // 过滤用户
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // 更新用户角色
  const handleRoleChange = (userId: string, newRole: UserRole) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    )
  }

  // 更新用户租户
  const handleTenantChange = (userId: string, tenantId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, tenantId } : user
      )
    )
  }

  // 获取租户名称
  const getTenantName = (tenantId: string) => {
    const tenant = tenants.find((t) => t.id === tenantId)
    return tenant?.displayName || "未分配"
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">租户管理</h1>
            <p className="text-sm text-muted-foreground">
              管理租户配额和用户权限
            </p>
          </div>
          <Dialog open={isAddTenantOpen} onOpenChange={setIsAddTenantOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                创建租户
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>创建新租户</DialogTitle>
                <DialogDescription>
                  配置新租户的资源配额
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>租户名称</Label>
                  <Input placeholder="例如: nlp-research" />
                </div>
                <div className="space-y-2">
                  <Label>显示名称</Label>
                  <Input placeholder="例如: NLP 研究组" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>GPU 配额</Label>
                    <Input type="number" placeholder="64" />
                  </div>
                  <div className="space-y-2">
                    <Label>存储配额 (TB)</Label>
                    <Input type="number" placeholder="50" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddTenantOpen(false)}>
                  取消
                </Button>
                <Button onClick={() => setIsAddTenantOpen(false)}>创建</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">总租户数</p>
                  <p className="text-2xl font-bold text-foreground">{tenants.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#22c55e]/20">
                  <Cpu className="h-5 w-5 text-[#22c55e]" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">GPU 总配额</p>
                  <p className="text-2xl font-bold text-foreground">
                    {tenants.reduce((sum, t) => sum + t.gpuQuota, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f59e0b]/20">
                  <HardDrive className="h-5 w-5 text-[#f59e0b]" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">存储总配额</p>
                  <p className="text-2xl font-bold text-foreground">
                    {tenants.reduce((sum, t) => sum + t.storageQuota, 0)} TB
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#8b5cf6]/20">
                  <Activity className="h-5 w-5 text-[#8b5cf6]" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">活跃任务</p>
                  <p className="text-2xl font-bold text-foreground">
                    {tenants.reduce((sum, t) => sum + t.activeTasks, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="tenants" className="space-y-4">
          <TabsList className="bg-secondary">
            <TabsTrigger value="tenants" className="gap-2">
              <Users className="h-4 w-4" />
              租户看板
            </TabsTrigger>
            <TabsTrigger value="members" className="gap-2">
              <UserPlus className="h-4 w-4" />
              成员管理
            </TabsTrigger>
          </TabsList>

          {/* Tenants Tab */}
          <TabsContent value="tenants" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {tenants.map((tenant) => {
                const gpuPercent = (tenant.gpuUsed / tenant.gpuQuota) * 100
                const storagePercent = (tenant.storageUsed / tenant.storageQuota) * 100

                return (
                  <Card key={tenant.id} className="border-border bg-card">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-base">
                              {tenant.displayName}
                            </CardTitle>
                            <p className="text-xs text-muted-foreground">
                              @{tenant.name}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* GPU Usage */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">GPU 使用量</span>
                          <span className="font-medium text-foreground">
                            {tenant.gpuUsed} / {tenant.gpuQuota} 张
                          </span>
                        </div>
                        <Progress
                          value={gpuPercent}
                          className={cn(
                            "h-2",
                            gpuPercent > 90 && "[&>div]:bg-destructive",
                            gpuPercent > 70 && gpuPercent <= 90 && "[&>div]:bg-[#eab308]"
                          )}
                        />
                      </div>

                      {/* Storage Usage */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">存储占用</span>
                          <span className="font-medium text-foreground">
                            {tenant.storageUsed} / {tenant.storageQuota} TB
                          </span>
                        </div>
                        <Progress
                          value={storagePercent}
                          className={cn(
                            "h-2",
                            storagePercent > 90 && "[&>div]:bg-destructive",
                            storagePercent > 70 && storagePercent <= 90 && "[&>div]:bg-[#eab308]"
                          )}
                        />
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1.5">
                            <Activity className="h-3.5 w-3.5 text-[#22c55e]" />
                            <span className="text-muted-foreground">
                              活跃任务:
                            </span>
                            <span className="font-medium text-foreground">
                              {tenant.activeTasks}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Users className="h-3.5 w-3.5 text-primary" />
                            <span className="text-muted-foreground">
                              成员:
                            </span>
                            <span className="font-medium text-foreground">
                              {tenant.memberCount}
                            </span>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          创建于 {tenant.createdAt}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members" className="space-y-4">
            <Card className="border-border bg-card">
              <CardHeader className="border-b border-border">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">成员列表</CardTitle>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="搜索用户..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-64 pl-9"
                      />
                    </div>
                    <Button size="sm">
                      <UserPlus className="mr-2 h-4 w-4" />
                      添加成员
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="w-[200px]">用户名</TableHead>
                      <TableHead>邮箱</TableHead>
                      <TableHead>所属租户</TableHead>
                      <TableHead>角色</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id} className="border-border">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
                              <span className="text-xs font-medium text-primary">
                                {user.username.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="font-medium text-foreground">
                              {user.username}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {user.email}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={user.tenantId}
                            onValueChange={(value) =>
                              handleTenantChange(user.id, value)
                            }
                          >
                            <SelectTrigger className="w-[160px] h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {tenants.map((tenant) => (
                                <SelectItem key={tenant.id} value={tenant.id}>
                                  {tenant.displayName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={user.role}
                            onValueChange={(value: UserRole) =>
                              handleRoleChange(user.id, value)
                            }
                          >
                            <SelectTrigger
                              className={cn(
                                "w-[140px] h-8",
                                user.role === "ops_admin" &&
                                  "border-primary text-primary",
                                user.role === "sre" &&
                                  "border-[#f59e0b] text-[#f59e0b]",
                                user.role === "tenant_user" &&
                                  "border-[#8b5cf6] text-[#8b5cf6]"
                              )}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ops_admin">
                                {roleDisplayNames.ops_admin}
                              </SelectItem>
                              <SelectItem value="sre">
                                {roleDisplayNames.sre}
                              </SelectItem>
                              <SelectItem value="tenant_user">
                                {roleDisplayNames.tenant_user}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
