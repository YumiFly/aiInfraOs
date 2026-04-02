"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import {
  mockSecrets,
  mockCertificates,
  mockCAInfo,
  SecretKey,
  Certificate,
} from "@/lib/mock-data"
import {
  Shield,
  Key,
  Lock,
  FileKey,
  Plus,
  Search,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Download,
  Trash2,
  Eye,
  EyeOff,
  Clock,
  Server,
} from "lucide-react"

// 计算证书过期倒计时
function getExpiryInfo(expiresAt: string): { days: number; text: string } {
  const now = new Date()
  const expiry = new Date(expiresAt)
  const diffTime = expiry.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) {
    return { days: diffDays, text: `已过期 ${Math.abs(diffDays)} 天` }
  } else if (diffDays === 0) {
    return { days: 0, text: "今日过期" }
  } else if (diffDays <= 30) {
    return { days: diffDays, text: `${diffDays} 天后过期` }
  } else {
    return { days: diffDays, text: `${diffDays} 天后过期` }
  }
}

// 获取密钥类型显示文本
function getSecretTypeLabel(type: SecretKey["type"]): string {
  switch (type) {
    case "ssh":
      return "SSH 密钥"
    case "password":
      return "密码"
    case "api_token":
      return "API Token"
    default:
      return type
  }
}

// 获取密钥类型图标
function getSecretTypeIcon(type: SecretKey["type"]) {
  switch (type) {
    case "ssh":
      return <Key className="h-4 w-4" />
    case "password":
      return <Lock className="h-4 w-4" />
    case "api_token":
      return <FileKey className="h-4 w-4" />
    default:
      return <Key className="h-4 w-4" />
  }
}

export default function SecurityPage() {
  const [secrets, setSecrets] = useState<SecretKey[]>(mockSecrets)
  const [certificates, setCertificates] = useState<Certificate[]>(mockCertificates)
  const [searchTerm, setSearchTerm] = useState("")
  const [certSearchTerm, setCertSearchTerm] = useState("")
  const [isAddSecretOpen, setIsAddSecretOpen] = useState(false)
  const [newSecret, setNewSecret] = useState({
    name: "",
    type: "ssh" as SecretKey["type"],
    content: "",
  })

  // 过滤密钥
  const filteredSecrets = secrets.filter(
    (secret) =>
      secret.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      secret.type.includes(searchTerm.toLowerCase())
  )

  // 过滤证书
  const filteredCertificates = certificates.filter(
    (cert) =>
      cert.cn.toLowerCase().includes(certSearchTerm.toLowerCase()) ||
      cert.nodeIp.includes(certSearchTerm)
  )

  // 添加新密钥
  const handleAddSecret = () => {
    const newSecretItem: SecretKey = {
      id: String(secrets.length + 1),
      name: newSecret.name,
      type: newSecret.type,
      fingerprint:
        newSecret.type === "password"
          ? "******"
          : `SHA256:${btoa(newSecret.name).slice(0, 32)}`,
      associatedAssets: 0,
      createdAt: new Date().toISOString().split("T")[0],
      createdBy: "admin",
    }
    setSecrets([...secrets, newSecretItem])
    setNewSecret({ name: "", type: "ssh", content: "" })
    setIsAddSecretOpen(false)
  }

  // 统计数据
  const validCerts = certificates.filter((c) => c.status === "valid").length
  const expiringCerts = certificates.filter((c) => c.status === "expiring").length
  const revokedCerts = certificates.filter((c) => c.status === "revoked").length

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">安全中心</h1>
            <p className="text-sm text-muted-foreground">
              管理 SSH 密钥、凭证和 PKI 证书
            </p>
          </div>
        </div>

        {/* CA Status Card */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">{mockCAInfo.name}</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    有效期: {mockCAInfo.validFrom} 至 {mockCAInfo.validUntil}
                  </p>
                </div>
              </div>
              <Badge
                variant="outline"
                className={cn(
                  mockCAInfo.status === "active"
                    ? "border-[#22c55e] text-[#22c55e]"
                    : "border-destructive text-destructive"
                )}
              >
                {mockCAInfo.status === "active" ? "运行中" : "已停用"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="rounded-lg bg-secondary/50 p-4">
                <p className="text-xs text-muted-foreground">已签发证书</p>
                <p className="text-2xl font-bold text-foreground">
                  {mockCAInfo.issuedCerts}
                </p>
              </div>
              <div className="rounded-lg bg-secondary/50 p-4">
                <p className="text-xs text-muted-foreground">有效证书</p>
                <p className="text-2xl font-bold text-[#22c55e]">{validCerts}</p>
              </div>
              <div className="rounded-lg bg-secondary/50 p-4">
                <p className="text-xs text-muted-foreground">即将过期</p>
                <p className="text-2xl font-bold text-[#eab308]">{expiringCerts}</p>
              </div>
              <div className="rounded-lg bg-secondary/50 p-4">
                <p className="text-xs text-muted-foreground">已吊销</p>
                <p className="text-2xl font-bold text-destructive">{revokedCerts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="secrets" className="space-y-4">
          <TabsList className="bg-secondary">
            <TabsTrigger value="secrets" className="gap-2">
              <Key className="h-4 w-4" />
              密钥管理
            </TabsTrigger>
            <TabsTrigger value="certificates" className="gap-2">
              <FileKey className="h-4 w-4" />
              证书流水线
            </TabsTrigger>
          </TabsList>

          {/* Secrets Tab */}
          <TabsContent value="secrets" className="space-y-4">
            <Card className="border-border bg-card">
              <CardHeader className="border-b border-border">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">凭证列表</CardTitle>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="搜索密钥..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-64 pl-9"
                      />
                    </div>
                    <Dialog open={isAddSecretOpen} onOpenChange={setIsAddSecretOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Plus className="mr-2 h-4 w-4" />
                          新增密钥
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>新增安全凭证</DialogTitle>
                          <DialogDescription>
                            添加 SSH 密钥、密码或 API Token
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="secret-name">名称</Label>
                            <Input
                              id="secret-name"
                              placeholder="例如: prod-ssh-key"
                              value={newSecret.name}
                              onChange={(e) =>
                                setNewSecret({ ...newSecret, name: e.target.value })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>类型</Label>
                            <Select
                              value={newSecret.type}
                              onValueChange={(value: SecretKey["type"]) =>
                                setNewSecret({ ...newSecret, type: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="ssh">SSH 密钥</SelectItem>
                                <SelectItem value="password">密码</SelectItem>
                                <SelectItem value="api_token">API Token</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="secret-content">
                              {newSecret.type === "ssh"
                                ? "私钥内容"
                                : newSecret.type === "password"
                                ? "密码"
                                : "Token"}
                            </Label>
                            <Textarea
                              id="secret-content"
                              placeholder={
                                newSecret.type === "ssh"
                                  ? "-----BEGIN RSA PRIVATE KEY-----"
                                  : "输入凭证内容..."
                              }
                              value={newSecret.content}
                              onChange={(e) =>
                                setNewSecret({ ...newSecret, content: e.target.value })
                              }
                              rows={newSecret.type === "ssh" ? 6 : 2}
                              className="font-mono text-sm"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setIsAddSecretOpen(false)}
                          >
                            取消
                          </Button>
                          <Button onClick={handleAddSecret}>保存</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="w-[250px]">名称</TableHead>
                      <TableHead>类型</TableHead>
                      <TableHead>指纹</TableHead>
                      <TableHead className="text-center">关联资产</TableHead>
                      <TableHead>创建时间</TableHead>
                      <TableHead>创建者</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSecrets.map((secret) => (
                      <TableRow key={secret.id} className="border-border">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getSecretTypeIcon(secret.type)}
                            <span className="font-medium text-foreground">
                              {secret.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {getSecretTypeLabel(secret.type)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <code className="rounded bg-secondary px-2 py-1 text-xs font-mono text-muted-foreground">
                            {secret.fingerprint.length > 24
                              ? `${secret.fingerprint.slice(0, 24)}...`
                              : secret.fingerprint}
                          </code>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary">{secret.associatedAssets}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {secret.createdAt}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {secret.createdBy}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Download className="h-4 w-4" />
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

          {/* Certificates Tab */}
          <TabsContent value="certificates" className="space-y-4">
            <Card className="border-border bg-card">
              <CardHeader className="border-b border-border">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">节点 mTLS 证书</CardTitle>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="搜索 CN 或 IP..."
                        value={certSearchTerm}
                        onChange={(e) => setCertSearchTerm(e.target.value)}
                        className="w-64 pl-9"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      批量续期
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="w-[280px]">CN 域名</TableHead>
                      <TableHead>节点 IP</TableHead>
                      <TableHead>颁发者</TableHead>
                      <TableHead>序列号</TableHead>
                      <TableHead>过期倒计时</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCertificates.map((cert) => {
                      const expiryInfo = getExpiryInfo(cert.expiresAt)
                      return (
                        <TableRow key={cert.id} className="border-border">
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Server className="h-4 w-4 text-muted-foreground" />
                              <span className="font-mono text-sm text-foreground">
                                {cert.cn}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <code className="text-sm text-muted-foreground">
                              {cert.nodeIp}
                            </code>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {cert.issuer}
                          </TableCell>
                          <TableCell>
                            <code className="text-xs text-muted-foreground">
                              {cert.serialNumber}
                            </code>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span
                                className={cn(
                                  "text-sm",
                                  cert.status === "valid" && "text-[#22c55e]",
                                  cert.status === "expiring" && "text-[#eab308]",
                                  cert.status === "revoked" && "text-destructive"
                                )}
                              >
                                {expiryInfo.text}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={cn(
                                cert.status === "valid" &&
                                  "border-[#22c55e] text-[#22c55e]",
                                cert.status === "expiring" &&
                                  "border-[#eab308] text-[#eab308]",
                                cert.status === "revoked" &&
                                  "border-destructive text-destructive"
                              )}
                            >
                              {cert.status === "valid" && (
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                              )}
                              {cert.status === "expiring" && (
                                <AlertTriangle className="mr-1 h-3 w-3" />
                              )}
                              {cert.status === "revoked" && (
                                <XCircle className="mr-1 h-3 w-3" />
                              )}
                              {cert.status === "valid"
                                ? "正常"
                                : cert.status === "expiring"
                                ? "即将过期"
                                : "已吊销"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
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
