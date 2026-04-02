"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import { cn } from "@/lib/utils"
import { Network, Settings, Plus, Edit, Trash2 } from "lucide-react"

// Mock VLAN data
const vlanList = [
  {
    id: "1",
    vlanId: 100,
    name: "Training Network",
    subnet: "10.0.100.0/24",
    gateway: "10.0.100.1",
    rdmaEnabled: true,
    nodeCount: 4,
  },
  {
    id: "2",
    vlanId: 101,
    name: "Inference Network",
    subnet: "10.0.101.0/24",
    gateway: "10.0.101.1",
    rdmaEnabled: true,
    nodeCount: 2,
  },
  {
    id: "3",
    vlanId: 102,
    name: "Management Network",
    subnet: "10.0.102.0/24",
    gateway: "10.0.102.1",
    rdmaEnabled: false,
    nodeCount: 8,
  },
  {
    id: "4",
    vlanId: 200,
    name: "Storage Network",
    subnet: "10.0.200.0/24",
    gateway: "10.0.200.1",
    rdmaEnabled: true,
    nodeCount: 8,
  },
]

// Mock switch data
const switchList = [
  {
    id: "1",
    name: "spine-switch-01",
    ip: "192.168.1.1",
    model: "Mellanox SN4600",
    ports: 64,
    usedPorts: 48,
    status: "online" as const,
  },
  {
    id: "2",
    name: "spine-switch-02",
    ip: "192.168.1.2",
    model: "Mellanox SN4600",
    ports: 64,
    usedPorts: 52,
    status: "online" as const,
  },
  {
    id: "3",
    name: "leaf-switch-01",
    ip: "192.168.1.11",
    model: "Mellanox SN2700",
    ports: 32,
    usedPorts: 24,
    status: "online" as const,
  },
  {
    id: "4",
    name: "leaf-switch-02",
    ip: "192.168.1.12",
    model: "Mellanox SN2700",
    ports: 32,
    usedPorts: 28,
    status: "online" as const,
  },
]

export default function NetworkPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">网络配置</h1>
            <p className="text-sm text-muted-foreground">
              管理 VLAN、RDMA 网络和交换机配置
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            新建 VLAN
          </Button>
        </div>

        {/* VLAN Configuration */}
        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Network className="h-5 w-5 text-primary" />
              <CardTitle className="text-base font-semibold text-foreground">
                VLAN 配置
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">VLAN ID</TableHead>
                  <TableHead className="text-muted-foreground">名称</TableHead>
                  <TableHead className="text-muted-foreground">子网</TableHead>
                  <TableHead className="text-muted-foreground">网关</TableHead>
                  <TableHead className="text-muted-foreground">RDMA</TableHead>
                  <TableHead className="text-muted-foreground">节点数</TableHead>
                  <TableHead className="text-muted-foreground">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vlanList.map((vlan) => (
                  <TableRow
                    key={vlan.id}
                    className="border-border hover:bg-secondary/50"
                  >
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {vlan.vlanId}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
                      {vlan.name}
                    </TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {vlan.subnet}
                    </TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {vlan.gateway}
                    </TableCell>
                    <TableCell>
                      {vlan.rdmaEnabled ? (
                        <Badge className="bg-success text-success-foreground">
                          启用
                        </Badge>
                      ) : (
                        <Badge variant="secondary">禁用</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {vlan.nodeCount}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
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

        {/* Switch Management */}
        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              <CardTitle className="text-base font-semibold text-foreground">
                交换机管理
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">名称</TableHead>
                  <TableHead className="text-muted-foreground">IP 地址</TableHead>
                  <TableHead className="text-muted-foreground">型号</TableHead>
                  <TableHead className="text-muted-foreground">端口使用</TableHead>
                  <TableHead className="text-muted-foreground">状态</TableHead>
                  <TableHead className="text-muted-foreground">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {switchList.map((sw) => (
                  <TableRow
                    key={sw.id}
                    className="border-border hover:bg-secondary/50"
                  >
                    <TableCell className="font-medium text-foreground">
                      {sw.name}
                    </TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {sw.ip}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {sw.model}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-20 rounded-full bg-secondary">
                          <div
                            className="h-2 rounded-full bg-primary"
                            style={{
                              width: `${(sw.usedPorts / sw.ports) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {sw.usedPorts}/{sw.ports}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "h-2 w-2 rounded-full",
                            sw.status === "online"
                              ? "status-online"
                              : "status-offline"
                          )}
                        />
                        <span
                          className={cn(
                            "text-sm",
                            sw.status === "online"
                              ? "text-success"
                              : "text-destructive"
                          )}
                        >
                          {sw.status === "online" ? "在线" : "离线"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        配置
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
