"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { StatCard } from "@/components/dashboard/stat-card"
import { GPULoadChart } from "@/components/dashboard/gpu-load-chart"
import { RDMATopology } from "@/components/dashboard/rdma-topology"
import { dashboardStats } from "@/lib/mock-data"
import { Cpu, Network, Database } from "lucide-react"

export default function DashboardPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">系统概览</h1>
          <p className="text-sm text-muted-foreground">
            实时监控集群资源使用情况
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            title="计算资源使用率"
            value={dashboardStats.computeUsage.value}
            unit="%"
            trend={dashboardStats.computeUsage.trend}
            trendDirection="up"
            progress={dashboardStats.computeUsage.value}
            status="normal"
            icon={<Cpu className="h-4 w-4" />}
          />
          <StatCard
            title="RDMA 平均重传率"
            value={dashboardStats.rdmaRetransmission.value}
            unit="%"
            trend={dashboardStats.rdmaRetransmission.trend}
            trendDirection="down"
            status="good"
            icon={<Network className="h-4 w-4" />}
          />
          <StatCard
            title="S3 存储剩余"
            value={dashboardStats.s3StorageRemaining.value}
            unit={`/ ${dashboardStats.s3StorageRemaining.total} TB`}
            progress={
              (dashboardStats.s3StorageRemaining.value /
                dashboardStats.s3StorageRemaining.total) *
              100
            }
            status="normal"
            icon={<Database className="h-4 w-4" />}
          />
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <GPULoadChart />
          <RDMATopology />
        </div>
      </div>
    </MainLayout>
  )
}
