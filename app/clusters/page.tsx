"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { gpuModelOptions, privateImages, clusterList, mockSecrets } from "@/lib/mock-data"
import {
  Check,
  ChevronRight,
  Server,
  Network,
  CheckCircle2,
  Loader2,
  Plus,
  Play,
  Pause,
  Trash2,
  Key,
  Shield,
} from "lucide-react"
import Link from "next/link"

type Step = 1 | 2 | 3

interface ClusterConfig {
  name: string
  gpuModel: string
  nodeCount: number
  ipMode: "auto" | "manual"
  manualIps: string
  vlanId: string
  rdmaMode: string
  selectedImage: string
  sshKeyId: string
  autoIssueCert: boolean
}

const steps = [
  { id: 1, title: "资源定义", description: "配置集群基本信息" },
  { id: 2, title: "网络与镜像", description: "设置网络和选择镜像" },
  { id: 3, title: "预检与提交", description: "确认配置并部署" },
]

export default function ClustersPage() {
  const [showCreator, setShowCreator] = useState(false)
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [isPreflightRunning, setIsPreflightRunning] = useState(false)
  const [preflightPassed, setPreflightPassed] = useState(false)
  const [config, setConfig] = useState<ClusterConfig>({
    name: "",
    gpuModel: "",
    nodeCount: 4,
    ipMode: "auto",
    manualIps: "",
    vlanId: "",
    rdmaMode: "roce-v2",
    selectedImage: "",
    sshKeyId: "",
    autoIssueCert: true,
  })

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => (prev + 1) as Step)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step)
    }
  }

  const handlePreflight = () => {
    setIsPreflightRunning(true)
    setPreflightPassed(false)
    // Simulate preflight check
    setTimeout(() => {
      setIsPreflightRunning(false)
      setPreflightPassed(true)
    }, 2000)
  }

  const handleDeploy = () => {
    // Navigate to deployment tracker
    window.location.href = "/clusters/deploy"
  }

  const resetCreator = () => {
    setShowCreator(false)
    setCurrentStep(1)
    setPreflightPassed(false)
    setConfig({
      name: "",
      gpuModel: "",
      nodeCount: 4,
      ipMode: "auto",
      manualIps: "",
      vlanId: "",
      rdmaMode: "roce-v2",
      selectedImage: "",
      sshKeyId: "",
      autoIssueCert: true,
    })
  }

  // 获取 SSH 密钥选项（仅 SSH 类型）
  const sshKeyOptions = mockSecrets.filter((s) => s.type === "ssh")

  // Cluster List View
  if (!showCreator) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">集群管理</h1>
              <p className="text-sm text-muted-foreground">
                管理和创建 GPU 计算集群
              </p>
            </div>
            <Button onClick={() => setShowCreator(true)}>
              <Plus className="mr-2 h-4 w-4" />
              创建集群
            </Button>
          </div>

          {/* Cluster List */}
          <div className="grid gap-4">
            {clusterList.map((cluster) => (
              <Card key={cluster.id} className="border-border bg-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-lg",
                          cluster.status === "running"
                            ? "bg-success/20"
                            : cluster.status === "deploying"
                            ? "bg-primary/20"
                            : "bg-muted"
                        )}
                      >
                        <Server
                          className={cn(
                            "h-5 w-5",
                            cluster.status === "running"
                              ? "text-success"
                              : cluster.status === "deploying"
                              ? "text-primary"
                              : "text-muted-foreground"
                          )}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {cluster.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {cluster.gpuModel} · {cluster.nodeCount} 节点 · VLAN{" "}
                          {cluster.vlanId}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge
                        variant={
                          cluster.status === "running"
                            ? "default"
                            : cluster.status === "deploying"
                            ? "secondary"
                            : "outline"
                        }
                        className={cn(
                          cluster.status === "running" &&
                            "bg-success text-success-foreground"
                        )}
                      >
                        {cluster.status === "running"
                          ? "运行中"
                          : cluster.status === "deploying"
                          ? "部署中"
                          : cluster.status === "stopped"
                          ? "已停止"
                          : "错误"}
                      </Badge>
                      <div className="flex gap-2">
                        {cluster.status === "running" ? (
                          <Button variant="outline" size="sm">
                            <Pause className="h-4 w-4" />
                          </Button>
                        ) : cluster.status === "stopped" ? (
                          <Button variant="outline" size="sm">
                            <Play className="h-4 w-4" />
                          </Button>
                        ) : cluster.status === "deploying" ? (
                          <Link href="/clusters/deploy">
                            <Button variant="outline" size="sm">
                              查看进度
                            </Button>
                          </Link>
                        ) : null}
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </MainLayout>
    )
  }

  // Cluster Creator Wizard
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">创建新集群</h1>
            <p className="text-sm text-muted-foreground">
              按照向导配置并部署 GPU 计算集群
            </p>
          </div>
          <Button variant="outline" onClick={resetCreator}>
            取消
          </Button>
        </div>

        {/* Steps Indicator */}
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                      currentStep === step.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : currentStep > step.id
                        ? "border-success bg-success text-success-foreground"
                        : "border-border bg-background text-muted-foreground"
                    )}
                  >
                    {currentStep > step.id ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="hidden sm:block">
                    <p
                      className={cn(
                        "text-sm font-medium",
                        currentStep >= step.id
                          ? "text-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {step.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <ChevronRight className="mx-4 h-5 w-5 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="border-border bg-card">
          <CardContent className="p-6">
            {/* Step 1: Resource Definition */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="cluster-name">集群名称</Label>
                  <Input
                    id="cluster-name"
                    placeholder="例如：training-cluster-01"
                    value={config.name}
                    onChange={(e) =>
                      setConfig({ ...config, name: e.target.value })
                    }
                    className="max-w-md"
                  />
                </div>

                <div className="space-y-2">
                  <Label>GPU 型号</Label>
                  <Select
                    value={config.gpuModel}
                    onValueChange={(value) =>
                      setConfig({ ...config, gpuModel: value })
                    }
                  >
                    <SelectTrigger className="max-w-md">
                      <SelectValue placeholder="选择 GPU 型号" />
                    </SelectTrigger>
                    <SelectContent>
                      {gpuModelOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center justify-between gap-4">
                            <span>{option.label}</span>
                            <Badge variant="outline" className="ml-2">
                              可用: {option.available}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between max-w-md">
                    <Label>节点数量</Label>
                    <span className="text-sm font-semibold text-primary">
                      {config.nodeCount} 个节点
                    </span>
                  </div>
                  <Slider
                    value={[config.nodeCount]}
                    onValueChange={(value) =>
                      setConfig({ ...config, nodeCount: value[0] })
                    }
                    min={1}
                    max={16}
                    step={1}
                    className="max-w-md"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground max-w-md">
                    <span>1</span>
                    <span>16</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>IP 地址分配</Label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={config.ipMode === "manual"}
                        onCheckedChange={(checked) =>
                          setConfig({
                            ...config,
                            ipMode: checked ? "manual" : "auto",
                          })
                        }
                      />
                      <span className="text-sm text-muted-foreground">
                        {config.ipMode === "auto" ? "自动分配" : "手动指定"}
                      </span>
                    </div>
                  </div>
                  {config.ipMode === "manual" && (
                    <Input
                      placeholder="输入 IP 地址，用逗号分隔"
                      value={config.manualIps}
                      onChange={(e) =>
                        setConfig({ ...config, manualIps: e.target.value })
                      }
                      className="max-w-md"
                    />
                  )}
                </div>

                {/* Security Credentials Section */}
                <div className="space-y-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="h-4 w-4 text-primary" />
                    <Label className="text-base font-semibold">安全凭证配置</Label>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>关联 SSH 密钥</Label>
                    <Select
                      value={config.sshKeyId}
                      onValueChange={(value) =>
                        setConfig({ ...config, sshKeyId: value })
                      }
                    >
                      <SelectTrigger className="max-w-md">
                        <SelectValue placeholder="从安全中心选择 SSH 密钥" />
                      </SelectTrigger>
                      <SelectContent>
                        {sshKeyOptions.map((key) => (
                          <SelectItem key={key.id} value={key.id}>
                            <div className="flex items-center gap-2">
                              <Key className="h-4 w-4 text-muted-foreground" />
                              <span>{key.name}</span>
                              <Badge variant="outline" className="ml-2 text-xs">
                                关联 {key.associatedAssets} 资产
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      用于 Ansible 部署和节点访问的 SSH 密钥
                    </p>
                  </div>

                  <div className="flex items-center justify-between max-w-md rounded-lg border border-border bg-secondary/30 p-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        <Label className="font-medium">自动签发并注入节点证书</Label>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        启用后将从 CA 自动签发 mTLS 证书并注入到每个节点
                      </p>
                    </div>
                    <Switch
                      checked={config.autoIssueCert}
                      onCheckedChange={(checked) =>
                        setConfig({ ...config, autoIssueCert: checked })
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Network & Image */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="vlan-id">VLAN ID</Label>
                  <Input
                    id="vlan-id"
                    placeholder="例如：100"
                    value={config.vlanId}
                    onChange={(e) =>
                      setConfig({ ...config, vlanId: e.target.value })
                    }
                    className="max-w-md"
                  />
                </div>

                <div className="space-y-2">
                  <Label>RDMA 模式</Label>
                  <Select
                    value={config.rdmaMode}
                    onValueChange={(value) =>
                      setConfig({ ...config, rdmaMode: value })
                    }
                  >
                    <SelectTrigger className="max-w-md">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="roce-v2">RoCE v2</SelectItem>
                      <SelectItem value="infiniband">InfiniBand</SelectItem>
                      <SelectItem value="disabled">禁用</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label>选择私有镜像</Label>
                  <div className="grid gap-4 md:grid-cols-2">
                    {privateImages.map((image) => (
                      <Card
                        key={image.id}
                        className={cn(
                          "cursor-pointer border-2 transition-colors",
                          config.selectedImage === image.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-muted-foreground"
                        )}
                        onClick={() =>
                          setConfig({ ...config, selectedImage: image.id })
                        }
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-foreground">
                                {image.name}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {image.version}
                              </p>
                            </div>
                            {config.selectedImage === image.id && (
                              <CheckCircle2 className="h-5 w-5 text-primary" />
                            )}
                          </div>
                          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{image.size}</span>
                            <Badge variant="outline">{image.registry}</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Preflight & Submit */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    配置汇总
                  </h3>
                  <div className="rounded-lg border border-border bg-secondary/50 p-4 space-y-3 font-mono text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">集群名称:</span>
                      <span className="text-foreground">
                        {config.name || "-"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">GPU 型号:</span>
                      <span className="text-foreground">
                        {gpuModelOptions.find((o) => o.value === config.gpuModel)
                          ?.label || "-"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">节点数量:</span>
                      <span className="text-foreground">
                        {config.nodeCount} 个节点
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">IP 分配:</span>
                      <span className="text-foreground">
                        {config.ipMode === "auto" ? "自动" : config.manualIps}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">VLAN ID:</span>
                      <span className="text-foreground">
                        {config.vlanId || "-"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">RDMA 模式:</span>
                      <span className="text-foreground">
                        {config.rdmaMode === "roce-v2"
                          ? "RoCE v2"
                          : config.rdmaMode === "infiniband"
                          ? "InfiniBand"
                          : "禁用"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">选择镜像:</span>
                      <span className="text-foreground">
                        {privateImages.find((i) => i.id === config.selectedImage)
                          ?.name || "-"}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-border pt-3 mt-3">
                      <span className="text-muted-foreground">SSH 密钥:</span>
                      <span className="text-foreground">
                        {sshKeyOptions.find((k) => k.id === config.sshKeyId)
                          ?.name || "-"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">自动签发证书:</span>
                      <span className={config.autoIssueCert ? "text-[#22c55e]" : "text-muted-foreground"}>
                        {config.autoIssueCert ? "已启用" : "已禁用"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    onClick={handlePreflight}
                    disabled={isPreflightRunning}
                  >
                    {isPreflightRunning ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        预检中...
                      </>
                    ) : preflightPassed ? (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4 text-success" />
                        预检通过
                      </>
                    ) : (
                      "点击预检"
                    )}
                  </Button>
                  {preflightPassed && (
                    <Badge
                      variant="outline"
                      className="border-success text-success"
                    >
                      所有检查通过
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevStep}
            disabled={currentStep === 1}
          >
            上一步
          </Button>
          {currentStep < 3 ? (
            <Button onClick={handleNextStep}>
              下一步
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleDeploy} disabled={!preflightPassed}>
              开始部署
            </Button>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
