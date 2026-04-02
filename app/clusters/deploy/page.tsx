"use client"

import { useState, useEffect, useRef } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { deploymentLogs } from "@/lib/mock-data"
import {
  Lock,
  Settings,
  HardDrive,
  Cpu,
  CheckCircle2,
  ArrowLeft,
  Loader2,
  Circle,
  Terminal,
} from "lucide-react"
import Link from "next/link"
import { NetworkTopologyAnimation } from "@/components/deploy/network-topology-animation"

interface DeploymentStep {
  id: string
  name: string
  icon: React.ReactNode
  status: "pending" | "running" | "completed" | "failed"
}

const initialSteps: DeploymentStep[] = [
  {
    id: "1",
    name: "锁定资源",
    icon: <Lock className="h-4 w-4" />,
    status: "completed",
  },
  {
    id: "2",
    name: "配置交换机",
    icon: <Settings className="h-4 w-4" />,
    status: "running", // Start with network config running to show animation
  },
  {
    id: "3",
    name: "PXE 装机",
    icon: <HardDrive className="h-4 w-4" />,
    status: "pending",
  },
  {
    id: "4",
    name: "驱动安装",
    icon: <Cpu className="h-4 w-4" />,
    status: "pending",
  },
  {
    id: "5",
    name: "NCCL 验收",
    icon: <CheckCircle2 className="h-4 w-4" />,
    status: "pending",
  },
]

export default function DeploymentTrackerPage() {
  const [steps, setSteps] = useState<DeploymentStep[]>(initialSteps)
  const [visibleLogs, setVisibleLogs] = useState<string[]>([])
  const [currentLogIndex, setCurrentLogIndex] = useState(0)
  const [networkConfigComplete, setNetworkConfigComplete] = useState(false)
  const terminalRef = useRef<HTMLDivElement>(null)

  // Check if we're on network config step
  const isNetworkConfigStep = steps.find(s => s.id === "2")?.status === "running"

  // Handle network config completion
  const handleNetworkConfigComplete = () => {
    setNetworkConfigComplete(true)
    // After a short delay, move to next step
    setTimeout(() => {
      setSteps(prevSteps => 
        prevSteps.map(step => {
          if (step.id === "2") return { ...step, status: "completed" as const }
          if (step.id === "3") return { ...step, status: "running" as const }
          return step
        })
      )
    }, 1500)
  }

  // Simulate log streaming - only start after network config is done
  useEffect(() => {
    if (isNetworkConfigStep) return // Don't stream logs during network config
    if (currentLogIndex >= deploymentLogs.length) return

    const timer = setTimeout(() => {
      setVisibleLogs((prev) => [...prev, deploymentLogs[currentLogIndex]])
      setCurrentLogIndex((prev) => prev + 1)
    }, 150 + Math.random() * 200) // Random delay for realistic effect

    return () => clearTimeout(timer)
  }, [currentLogIndex, isNetworkConfigStep])

  // Auto scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [visibleLogs])

  // Simulate step progression
  useEffect(() => {
    const timer = setTimeout(() => {
      setSteps((prevSteps) => {
        const newSteps = [...prevSteps]
        const runningIndex = newSteps.findIndex((s) => s.status === "running")
        if (runningIndex !== -1 && runningIndex < newSteps.length - 1) {
          // Keep current step running for demo
        }
        return newSteps
      })
    }, 5000)

    return () => clearTimeout(timer)
  }, [steps])

  const getStepStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-success text-success-foreground border-success"
      case "running":
        return "bg-primary text-primary-foreground border-primary"
      case "failed":
        return "bg-destructive text-destructive-foreground border-destructive"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  const getLogLineColor = (line: string) => {
    if (line.includes("TASK")) return "text-primary"
    if (line.includes("ok:")) return "text-success"
    if (line.includes("changed:")) return "text-warning"
    if (line.includes("failed:") || line.includes("error:"))
      return "text-destructive"
    return "text-muted-foreground"
  }

  const currentStepIndex = steps.findIndex((s) => s.status === "running")
  const progress =
    currentStepIndex === -1
      ? 100
      : ((currentStepIndex + 0.5) / steps.length) * 100

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/clusters">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">部署追踪</h1>
              <p className="text-sm text-muted-foreground">
                training-cluster-02 · 正在部署中
              </p>
            </div>
          </div>
          <Badge variant="outline" className="border-primary text-primary">
            进度: {Math.round(progress)}%
          </Badge>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Steps Sidebar */}
          <Card className="border-border bg-card h-fit">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-foreground">
                部署步骤
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {steps.map((step, index) => (
                <div key={step.id} className="relative">
                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        "absolute left-5 top-10 h-8 w-0.5",
                        step.status === "completed"
                          ? "bg-success"
                          : "bg-border"
                      )}
                    />
                  )}

                  {/* Step Item */}
                  <div
                    className={cn(
                      "flex items-center gap-3 rounded-lg p-3 transition-colors",
                      step.status === "running" && "bg-primary/10"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2",
                        getStepStatusColor(step.status)
                      )}
                    >
                      {step.status === "running" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : step.status === "completed" ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : step.status === "failed" ? (
                        <span className="text-xs font-bold">!</span>
                      ) : (
                        <Circle className="h-3 w-3" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "text-sm font-medium",
                          step.status === "running"
                            ? "text-primary"
                            : step.status === "completed"
                            ? "text-success"
                            : "text-muted-foreground"
                        )}
                      >
                        {step.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {step.status === "completed"
                          ? "已完成"
                          : step.status === "running"
                          ? "进行中..."
                          : step.status === "failed"
                          ? "失败"
                          : "等待中"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Main Content Area */}
          <div className="space-y-6">
            {/* Network Topology Animation - Show during network config step */}
            {isNetworkConfigStep && (
              <Card className="border-border bg-card">
                <CardHeader className="border-b border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4 text-primary" />
                      <CardTitle className="text-base font-semibold text-foreground">
                        网络拓扑配置
                      </CardTitle>
                    </div>
                    <Badge variant="outline" className="border-primary text-primary">
                      Switch {"<->"} Host 握手中
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <NetworkTopologyAnimation
                    isActive={isNetworkConfigStep && !networkConfigComplete}
                    onConfigComplete={handleNetworkConfigComplete}
                  />
                </CardContent>
              </Card>
            )}

            {/* Terminal */}
            <Card className="border-border bg-card">
              <CardHeader className="border-b border-border">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-primary" />
                  <CardTitle className="text-base font-semibold text-foreground">
                    Ansible 部署日志
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div
                  ref={terminalRef}
                  className="terminal h-[400px] overflow-auto p-4"
                >
                  {isNetworkConfigStep ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                      <Settings className="h-8 w-8 mb-3 animate-spin text-primary" />
                      <p className="text-sm">等待网络配置完成...</p>
                      <p className="text-xs mt-1">交换机端口配置通常需要 15-20 秒</p>
                    </div>
                  ) : (
                    <div className="space-y-0.5">
                      {visibleLogs.map((line, index) => (
                        <div
                          key={index}
                          className={cn(
                            "terminal-line font-mono text-[13px] leading-relaxed",
                            getLogLineColor(line)
                          )}
                        >
                          {line || "\u00A0"}
                        </div>
                      ))}
                      {currentLogIndex < deploymentLogs.length && !isNetworkConfigStep && (
                        <div className="flex items-center gap-2 text-primary">
                          <span className="animate-pulse">_</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
