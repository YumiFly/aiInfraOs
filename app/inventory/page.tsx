"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { inventoryNodes, type GPUNode } from "@/lib/mock-data"
import {
  Search,
  Filter,
  RefreshCw,
  Thermometer,
  Activity,
  Server,
} from "lucide-react"

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [clusterFilter, setClusterFilter] = useState<string>("all")

  const filteredNodes = inventoryNodes.filter((node) => {
    const matchesSearch =
      node.ip.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.hostname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.gpuModel.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === "all" || node.healthStatus === statusFilter

    const matchesCluster =
      clusterFilter === "all" ||
      (clusterFilter === "unassigned" && !node.cluster) ||
      node.cluster === clusterFilter

    return matchesSearch && matchesStatus && matchesCluster
  })

  const uniqueClusters = [
    ...new Set(inventoryNodes.map((n) => n.cluster).filter(Boolean)),
  ] as string[]

  const getHealthBadge = (status: GPUNode["healthStatus"]) => {
    switch (status) {
      case "healthy":
        return (
          <Badge
            variant="outline"
            className="border-success bg-success/10 text-success"
          >
            健康
          </Badge>
        )
      case "warning":
        return (
          <Badge
            variant="outline"
            className="border-warning bg-warning/10 text-warning"
          >
            警告
          </Badge>
        )
      case "critical":
        return (
          <Badge
            variant="outline"
            className="border-destructive bg-destructive/10 text-destructive"
          >
            严重
          </Badge>
        )
    }
  }

  const getTemperatureColor = (temp: number) => {
    if (temp >= 80) return "text-destructive"
    if (temp >= 70) return "text-warning"
    return "text-success"
  }

  const stats = {
    total: inventoryNodes.length,
    healthy: inventoryNodes.filter((n) => n.healthStatus === "healthy").length,
    warning: inventoryNodes.filter((n) => n.healthStatus === "warning").length,
    critical: inventoryNodes.filter((n) => n.healthStatus === "critical").length,
    unassigned: inventoryNodes.filter((n) => !n.cluster).length,
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">资源池</h1>
            <p className="text-sm text-muted-foreground">
              查看和管理所有 GPU 计算节点
            </p>
          </div>
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            刷新
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                  <Server className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {stats.total}
                  </p>
                  <p className="text-xs text-muted-foreground">总节点数</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/20">
                  <Activity className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-success">
                    {stats.healthy}
                  </p>
                  <p className="text-xs text-muted-foreground">健康节点</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/20">
                  <Thermometer className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-warning">
                    {stats.warning}
                  </p>
                  <p className="text-xs text-muted-foreground">警告节点</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/20">
                  <Activity className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-destructive">
                    {stats.critical}
                  </p>
                  <p className="text-xs text-muted-foreground">严重告警</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <Server className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-muted-foreground">
                    {stats.unassigned}
                  </p>
                  <p className="text-xs text-muted-foreground">未分配</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="搜索 IP、主机名或 GPU 型号..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="健康状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部状态</SelectItem>
                    <SelectItem value="healthy">健康</SelectItem>
                    <SelectItem value="warning">警告</SelectItem>
                    <SelectItem value="critical">严重</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={clusterFilter} onValueChange={setClusterFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="所属集群" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部集群</SelectItem>
                    <SelectItem value="unassigned">未分配</SelectItem>
                    {uniqueClusters.map((cluster) => (
                      <SelectItem key={cluster} value={cluster}>
                        {cluster}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">
              节点列表
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({filteredNodes.length} 个结果)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">IP 地址</TableHead>
                    <TableHead className="text-muted-foreground">GPU 型号</TableHead>
                    <TableHead className="text-muted-foreground">温度</TableHead>
                    <TableHead className="text-muted-foreground">RDMA 带宽</TableHead>
                    <TableHead className="text-muted-foreground">利用率</TableHead>
                    <TableHead className="text-muted-foreground">健康状态</TableHead>
                    <TableHead className="text-muted-foreground">所属集群</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNodes.map((node) => (
                    <TableRow
                      key={node.id}
                      className="border-border hover:bg-secondary/50"
                    >
                      <TableCell>
                        <div>
                          <p className="font-mono text-sm text-foreground">
                            {node.ip}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {node.hostname}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-foreground">
                        {node.gpuModel}
                        <span className="ml-1 text-xs text-muted-foreground">
                          x{node.gpuCount}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Thermometer
                            className={cn(
                              "h-4 w-4",
                              getTemperatureColor(node.temperature)
                            )}
                          />
                          <span
                            className={cn(
                              "font-mono text-sm",
                              getTemperatureColor(node.temperature)
                            )}
                          >
                            {node.temperature}°C
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm text-foreground">
                          {node.rdmaBandwidth} Gb/s
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="w-24">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-muted-foreground">GPU</span>
                            <span className="text-foreground">
                              {node.utilization}%
                            </span>
                          </div>
                          <Progress
                            value={node.utilization}
                            className="h-1.5"
                          />
                        </div>
                      </TableCell>
                      <TableCell>{getHealthBadge(node.healthStatus)}</TableCell>
                      <TableCell>
                        {node.cluster ? (
                          <Badge variant="secondary" className="font-mono text-xs">
                            {node.cluster}
                          </Badge>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            未分配
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
