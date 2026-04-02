// Mock data for AI-Infra OS

// ========== Security Center Data ==========

export interface SecretKey {
  id: string
  name: string
  type: "ssh" | "password" | "api_token"
  fingerprint: string
  associatedAssets: number
  createdAt: string
  createdBy: string
}

export interface Certificate {
  id: string
  cn: string
  issuer: string
  expiresAt: string
  status: "valid" | "expiring" | "revoked"
  nodeIp: string
  serialNumber: string
}

export interface CAInfo {
  name: string
  status: "active" | "inactive"
  validFrom: string
  validUntil: string
  issuedCerts: number
  revokedCerts: number
}

// Mock SSH Keys / Secrets
export const mockSecrets: SecretKey[] = [
  {
    id: "1",
    name: "gpu-cluster-ssh-key",
    type: "ssh",
    fingerprint: "SHA256:nThbg6kXUpJWGl7E1IGOCspRomTxdCARLviKw6E5SY8",
    associatedAssets: 24,
    createdAt: "2024-01-15",
    createdBy: "admin",
  },
  {
    id: "2",
    name: "harbor-registry-token",
    type: "api_token",
    fingerprint: "SHA256:QmxhY2tCb3hfQVBJX1Rva2VuXzIwMjQ=",
    associatedAssets: 1,
    createdAt: "2024-01-10",
    createdBy: "sre_zhang",
  },
  {
    id: "3",
    name: "nexus-admin-password",
    type: "password",
    fingerprint: "******",
    associatedAssets: 1,
    createdAt: "2024-01-08",
    createdBy: "admin",
  },
  {
    id: "4",
    name: "ansible-deploy-key",
    type: "ssh",
    fingerprint: "SHA256:YmFzZTY0X2VuY29kZWRfc3NoX2tleQ==",
    associatedAssets: 32,
    createdAt: "2024-01-20",
    createdBy: "sre_chen",
  },
  {
    id: "5",
    name: "pxe-boot-credential",
    type: "password",
    fingerprint: "******",
    associatedAssets: 8,
    createdAt: "2024-01-22",
    createdBy: "sre_zhang",
  },
]

// Mock CA Info
export const mockCAInfo: CAInfo = {
  name: "AI-Infra Root CA",
  status: "active",
  validFrom: "2024-01-01",
  validUntil: "2034-01-01",
  issuedCerts: 48,
  revokedCerts: 2,
}

// Mock Certificates
export const mockCertificates: Certificate[] = [
  {
    id: "1",
    cn: "gpu-node-001.aiinfra.local",
    issuer: "AI-Infra Root CA",
    expiresAt: "2025-06-15",
    status: "valid",
    nodeIp: "10.0.1.101",
    serialNumber: "01:A2:B3:C4:D5:E6",
  },
  {
    id: "2",
    cn: "gpu-node-002.aiinfra.local",
    issuer: "AI-Infra Root CA",
    expiresAt: "2025-06-15",
    status: "valid",
    nodeIp: "10.0.1.102",
    serialNumber: "02:A2:B3:C4:D5:E6",
  },
  {
    id: "3",
    cn: "gpu-node-003.aiinfra.local",
    issuer: "AI-Infra Root CA",
    expiresAt: "2024-03-01",
    status: "expiring",
    nodeIp: "10.0.1.103",
    serialNumber: "03:A2:B3:C4:D5:E6",
  },
  {
    id: "4",
    cn: "gpu-node-004.aiinfra.local",
    issuer: "AI-Infra Root CA",
    expiresAt: "2024-01-15",
    status: "revoked",
    nodeIp: "10.0.1.104",
    serialNumber: "04:A2:B3:C4:D5:E6",
  },
  {
    id: "5",
    cn: "gpu-node-005.aiinfra.local",
    issuer: "AI-Infra Root CA",
    expiresAt: "2025-08-20",
    status: "valid",
    nodeIp: "10.0.1.105",
    serialNumber: "05:A2:B3:C4:D5:E6",
  },
  {
    id: "6",
    cn: "spine-switch-01.aiinfra.local",
    issuer: "AI-Infra Root CA",
    expiresAt: "2025-12-01",
    status: "valid",
    nodeIp: "10.0.0.1",
    serialNumber: "06:A2:B3:C4:D5:E6",
  },
  {
    id: "7",
    cn: "leaf-switch-01.aiinfra.local",
    issuer: "AI-Infra Root CA",
    expiresAt: "2024-02-28",
    status: "expiring",
    nodeIp: "10.0.0.11",
    serialNumber: "07:A2:B3:C4:D5:E6",
  },
  {
    id: "8",
    cn: "harbor.aiinfra.local",
    issuer: "AI-Infra Root CA",
    expiresAt: "2025-09-10",
    status: "valid",
    nodeIp: "10.0.2.10",
    serialNumber: "08:A2:B3:C4:D5:E6",
  },
]

// ========== Original Data ==========

export interface GPUNode {
  id: string
  ip: string
  hostname: string
  gpuModel: string
  gpuCount: number
  temperature: number
  rdmaBandwidth: number
  healthStatus: "healthy" | "warning" | "critical"
  cluster: string | null
  utilization: number
}

export interface Cluster {
  id: string
  name: string
  status: "running" | "deploying" | "stopped" | "error"
  nodeCount: number
  gpuModel: string
  createdAt: string
  vlanId: number
  rdmaMode: string
}

export interface DeploymentStep {
  id: string
  name: string
  status: "pending" | "running" | "completed" | "failed"
  startTime?: string
  endTime?: string
}

// GPU 负载趋势数据（过去24小时）
export const gpuLoadTrendData = [
  { time: "00:00", load: 72, memory: 65 },
  { time: "02:00", load: 68, memory: 62 },
  { time: "04:00", load: 45, memory: 48 },
  { time: "06:00", load: 52, memory: 55 },
  { time: "08:00", load: 78, memory: 72 },
  { time: "10:00", load: 85, memory: 80 },
  { time: "12:00", load: 92, memory: 88 },
  { time: "14:00", load: 88, memory: 85 },
  { time: "16:00", load: 95, memory: 90 },
  { time: "18:00", load: 82, memory: 78 },
  { time: "20:00", load: 76, memory: 70 },
  { time: "22:00", load: 70, memory: 65 },
]

// Dashboard 统计数据
export const dashboardStats = {
  computeUsage: {
    value: 87.5,
    trend: "+2.3%",
    status: "normal" as const,
  },
  rdmaRetransmission: {
    value: 0.12,
    trend: "-0.05%",
    status: "good" as const,
  },
  s3StorageRemaining: {
    value: 42.8,
    unit: "TB",
    total: 100,
    status: "normal" as const,
  },
}

// RDMA 拓扑节点数据
export const rdmaTopologyNodes = [
  { id: "spine1", label: "Spine-1", type: "switch", x: 200, y: 50 },
  { id: "spine2", label: "Spine-2", type: "switch", x: 400, y: 50 },
  { id: "leaf1", label: "Leaf-1", type: "switch", x: 100, y: 150 },
  { id: "leaf2", label: "Leaf-2", type: "switch", x: 250, y: 150 },
  { id: "leaf3", label: "Leaf-3", type: "switch", x: 400, y: 150 },
  { id: "leaf4", label: "Leaf-4", type: "switch", x: 550, y: 150 },
  { id: "node1", label: "GPU-Node-1", type: "compute", x: 50, y: 250 },
  { id: "node2", label: "GPU-Node-2", type: "compute", x: 150, y: 250 },
  { id: "node3", label: "GPU-Node-3", type: "compute", x: 250, y: 250 },
  { id: "node4", label: "GPU-Node-4", type: "compute", x: 350, y: 250 },
  { id: "node5", label: "GPU-Node-5", type: "compute", x: 450, y: 250 },
  { id: "node6", label: "GPU-Node-6", type: "compute", x: 550, y: 250 },
]

export const rdmaTopologyLinks = [
  { source: "spine1", target: "leaf1" },
  { source: "spine1", target: "leaf2" },
  { source: "spine1", target: "leaf3" },
  { source: "spine1", target: "leaf4" },
  { source: "spine2", target: "leaf1" },
  { source: "spine2", target: "leaf2" },
  { source: "spine2", target: "leaf3" },
  { source: "spine2", target: "leaf4" },
  { source: "leaf1", target: "node1" },
  { source: "leaf1", target: "node2" },
  { source: "leaf2", target: "node3" },
  { source: "leaf3", target: "node4" },
  { source: "leaf4", target: "node5" },
  { source: "leaf4", target: "node6" },
]

// 资源池节点列表
export const inventoryNodes: GPUNode[] = [
  {
    id: "1",
    ip: "10.0.1.101",
    hostname: "gpu-node-001",
    gpuModel: "NVIDIA H100 80GB",
    gpuCount: 8,
    temperature: 62,
    rdmaBandwidth: 198,
    healthStatus: "healthy",
    cluster: "training-cluster-01",
    utilization: 85,
  },
  {
    id: "2",
    ip: "10.0.1.102",
    hostname: "gpu-node-002",
    gpuModel: "NVIDIA H100 80GB",
    gpuCount: 8,
    temperature: 58,
    rdmaBandwidth: 195,
    healthStatus: "healthy",
    cluster: "training-cluster-01",
    utilization: 92,
  },
  {
    id: "3",
    ip: "10.0.1.103",
    hostname: "gpu-node-003",
    gpuModel: "NVIDIA H100 80GB",
    gpuCount: 8,
    temperature: 71,
    rdmaBandwidth: 188,
    healthStatus: "warning",
    cluster: "training-cluster-01",
    utilization: 78,
  },
  {
    id: "4",
    ip: "10.0.1.104",
    hostname: "gpu-node-004",
    gpuModel: "NVIDIA A100 80GB",
    gpuCount: 8,
    temperature: 55,
    rdmaBandwidth: 192,
    healthStatus: "healthy",
    cluster: "inference-cluster-01",
    utilization: 45,
  },
  {
    id: "5",
    ip: "10.0.1.105",
    hostname: "gpu-node-005",
    gpuModel: "NVIDIA A100 80GB",
    gpuCount: 8,
    temperature: 52,
    rdmaBandwidth: 190,
    healthStatus: "healthy",
    cluster: "inference-cluster-01",
    utilization: 38,
  },
  {
    id: "6",
    ip: "10.0.1.106",
    hostname: "gpu-node-006",
    gpuModel: "NVIDIA H100 80GB",
    gpuCount: 8,
    temperature: 65,
    rdmaBandwidth: 196,
    healthStatus: "healthy",
    cluster: null,
    utilization: 0,
  },
  {
    id: "7",
    ip: "10.0.1.107",
    hostname: "gpu-node-007",
    gpuModel: "NVIDIA A100 80GB",
    gpuCount: 8,
    temperature: 48,
    rdmaBandwidth: 185,
    healthStatus: "healthy",
    cluster: null,
    utilization: 0,
  },
  {
    id: "8",
    ip: "10.0.1.108",
    hostname: "gpu-node-008",
    gpuModel: "NVIDIA H100 80GB",
    gpuCount: 8,
    temperature: 82,
    rdmaBandwidth: 145,
    healthStatus: "critical",
    cluster: "training-cluster-02",
    utilization: 95,
  },
]

// 集群列表
export const clusterList: Cluster[] = [
  {
    id: "1",
    name: "training-cluster-01",
    status: "running",
    nodeCount: 4,
    gpuModel: "NVIDIA H100 80GB",
    createdAt: "2024-01-15",
    vlanId: 100,
    rdmaMode: "RoCE v2",
  },
  {
    id: "2",
    name: "inference-cluster-01",
    status: "running",
    nodeCount: 2,
    gpuModel: "NVIDIA A100 80GB",
    createdAt: "2024-01-20",
    vlanId: 101,
    rdmaMode: "RoCE v2",
  },
  {
    id: "3",
    name: "training-cluster-02",
    status: "deploying",
    nodeCount: 1,
    gpuModel: "NVIDIA H100 80GB",
    createdAt: "2024-02-01",
    vlanId: 102,
    rdmaMode: "RoCE v2",
  },
]

// GPU 型号选项
export const gpuModelOptions = [
  { value: "h100-80gb", label: "NVIDIA H100 80GB", available: 16 },
  { value: "h100-40gb", label: "NVIDIA H100 40GB", available: 8 },
  { value: "a100-80gb", label: "NVIDIA A100 80GB", available: 24 },
  { value: "a100-40gb", label: "NVIDIA A100 40GB", available: 32 },
  { value: "l40s", label: "NVIDIA L40S 48GB", available: 12 },
]

// 私有镜像列表
export const privateImages = [
  {
    id: "1",
    name: "pytorch-training",
    version: "2.1.0-cuda12.1",
    size: "15.2 GB",
    registry: "Harbor",
    lastUpdated: "2024-01-28",
  },
  {
    id: "2",
    name: "tensorflow-gpu",
    version: "2.15.0-cuda12.1",
    size: "12.8 GB",
    registry: "Harbor",
    lastUpdated: "2024-01-25",
  },
  {
    id: "3",
    name: "deepspeed-training",
    version: "0.12.0",
    size: "18.5 GB",
    registry: "Harbor",
    lastUpdated: "2024-01-30",
  },
  {
    id: "4",
    name: "megatron-lm",
    version: "core-0.5.0",
    size: "22.1 GB",
    registry: "Nexus",
    lastUpdated: "2024-01-22",
  },
]

// 部署步骤
export const deploymentSteps: DeploymentStep[] = [
  { id: "1", name: "锁定资源", status: "completed" },
  { id: "2", name: "配置交换机", status: "completed" },
  { id: "3", name: "PXE 装机", status: "running" },
  { id: "4", name: "驱动安装", status: "pending" },
  { id: "5", name: "NCCL 验收", status: "pending" },
]

// 模拟部署日志
export const deploymentLogs = [
  "[2024-02-01 10:00:01] TASK [lock_resources] ***********************************",
  "[2024-02-01 10:00:01] ok: [gpu-node-001] => Resource locked successfully",
  "[2024-02-01 10:00:02] ok: [gpu-node-002] => Resource locked successfully",
  "[2024-02-01 10:00:03] ok: [gpu-node-003] => Resource locked successfully",
  "",
  "[2024-02-01 10:00:05] TASK [configure_switch] *********************************",
  "[2024-02-01 10:00:05] changed: [spine-switch-01] => VLAN 102 configured",
  "[2024-02-01 10:00:06] changed: [leaf-switch-01] => Port profile applied",
  "[2024-02-01 10:00:07] changed: [leaf-switch-02] => Port profile applied",
  "[2024-02-01 10:00:08] ok: [all] => RDMA QoS policy configured",
  "",
  "[2024-02-01 10:00:10] TASK [pxe_boot] ******************************************",
  "[2024-02-01 10:00:10] ok: [pxe-server] => DHCP reservation created",
  "[2024-02-01 10:00:12] changed: [gpu-node-001] => PXE boot initiated...",
  "[2024-02-01 10:00:15] changed: [gpu-node-001] => Downloading base image...",
  "[2024-02-01 10:00:45] changed: [gpu-node-001] => Image downloaded (15.2 GB)",
  "[2024-02-01 10:01:20] changed: [gpu-node-001] => Partitioning disk...",
  "[2024-02-01 10:01:45] changed: [gpu-node-001] => Installing base system...",
  "[2024-02-01 10:05:30] ok: [gpu-node-001] => Base system installed",
  "[2024-02-01 10:05:32] changed: [gpu-node-002] => PXE boot initiated...",
  "[2024-02-01 10:05:35] changed: [gpu-node-002] => Downloading base image...",
  "[2024-02-01 10:06:05] changed: [gpu-node-002] => Image downloaded (15.2 GB)",
  "[2024-02-01 10:06:30] changed: [gpu-node-002] => Partitioning disk...",
  "[2024-02-01 10:06:55] changed: [gpu-node-002] => Installing base system...",
  "[2024-02-01 10:10:40] ok: [gpu-node-002] => Base system installed",
  "[2024-02-01 10:10:42] changed: [gpu-node-003] => PXE boot initiated...",
  "[2024-02-01 10:10:45] changed: [gpu-node-003] => Downloading base image...",
]
