"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface NetworkNode {
  id: string
  name: string
  type: "switch" | "host"
  x: number
  y: number
  status: "idle" | "configuring" | "connected"
}

interface NetworkLink {
  from: string
  to: string
  port: string
  status: "idle" | "configuring" | "connected"
}

interface NetworkTopologyAnimationProps {
  isActive: boolean
  onConfigComplete?: () => void
}

export function NetworkTopologyAnimation({
  isActive,
  onConfigComplete,
}: NetworkTopologyAnimationProps) {
  const [nodes] = useState<NetworkNode[]>([
    { id: "leaf-01", name: "Leaf-01", type: "switch", x: 200, y: 40, status: "idle" },
    { id: "leaf-02", name: "Leaf-02", type: "switch", x: 400, y: 40, status: "idle" },
    { id: "host-01", name: "Host-01", type: "host", x: 100, y: 160, status: "idle" },
    { id: "host-02", name: "Host-02", type: "host", x: 230, y: 160, status: "idle" },
    { id: "host-03", name: "Host-03", type: "host", x: 360, y: 160, status: "idle" },
    { id: "host-04", name: "Host-04", type: "host", x: 490, y: 160, status: "idle" },
  ])

  const [links, setLinks] = useState<NetworkLink[]>([
    { from: "leaf-01", to: "host-01", port: "Eth 1/1", status: "idle" },
    { from: "leaf-01", to: "host-02", port: "Eth 1/2", status: "idle" },
    { from: "leaf-02", to: "host-03", port: "Eth 1/1", status: "idle" },
    { from: "leaf-02", to: "host-04", port: "Eth 1/2", status: "idle" },
    { from: "leaf-01", to: "leaf-02", port: "Eth 1/48", status: "idle" },
  ])

  const [currentConfigStep, setCurrentConfigStep] = useState(0)
  const [configMessage, setConfigMessage] = useState("")

  const configSteps = [
    { linkIndex: 4, message: "正在配置 Leaf-01 <-> Leaf-02 互联端口 Eth 1/48..." },
    { linkIndex: 0, message: "正在配置 Leaf-01 交换机端口 Eth 1/1 -> Host-01..." },
    { linkIndex: 1, message: "正在配置 Leaf-01 交换机端口 Eth 1/2 -> Host-02..." },
    { linkIndex: 2, message: "正在配置 Leaf-02 交换机端口 Eth 1/1 -> Host-03..." },
    { linkIndex: 3, message: "正在配置 Leaf-02 交换机端口 Eth 1/2 -> Host-04..." },
  ]

  useEffect(() => {
    if (!isActive) {
      // Reset state when not active
      setCurrentConfigStep(0)
      setLinks((prev) =>
        prev.map((link) => ({ ...link, status: "idle" }))
      )
      setConfigMessage("")
      return
    }

    if (currentConfigStep >= configSteps.length) {
      // All config complete
      setConfigMessage("网络配置完成，RDMA 通道已建立")
      onConfigComplete?.()
      return
    }

    const step = configSteps[currentConfigStep]
    setConfigMessage(step.message)

    // Set current link to configuring
    setLinks((prev) =>
      prev.map((link, idx) => ({
        ...link,
        status:
          idx === step.linkIndex
            ? "configuring"
            : idx < step.linkIndex
            ? "connected"
            : link.status,
      }))
    )

    // After delay, mark as connected and move to next
    const timer = setTimeout(() => {
      setLinks((prev) =>
        prev.map((link, idx) => ({
          ...link,
          status: idx === step.linkIndex ? "connected" : link.status,
        }))
      )
      setCurrentConfigStep((prev) => prev + 1)
    }, 3000 + Math.random() * 2000) // 3-5 seconds per step

    return () => clearTimeout(timer)
  }, [isActive, currentConfigStep, onConfigComplete])

  const getNodePosition = (nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId)
    return node ? { x: node.x, y: node.y } : { x: 0, y: 0 }
  }

  const getLinkColor = (status: string) => {
    switch (status) {
      case "connected":
        return "#3fb950"
      case "configuring":
        return "#0052CC"
      default:
        return "#30363d"
    }
  }

  const getNodeColor = (nodeId: string) => {
    const connectedLinks = links.filter(
      (l) => (l.from === nodeId || l.to === nodeId) && l.status === "connected"
    )
    const configuringLinks = links.filter(
      (l) => (l.from === nodeId || l.to === nodeId) && l.status === "configuring"
    )
    
    if (configuringLinks.length > 0) return "#0052CC"
    if (connectedLinks.length > 0) return "#3fb950"
    return "#30363d"
  }

  return (
    <div className="space-y-4">
      {/* Topology SVG */}
      <div className="relative bg-background/50 rounded-lg border border-border p-4">
        <svg
          viewBox="0 0 600 220"
          className="w-full h-auto"
          style={{ minHeight: "200px" }}
        >
          {/* Links */}
          {links.map((link, idx) => {
            const from = getNodePosition(link.from)
            const to = getNodePosition(link.to)
            const isConfiguring = link.status === "configuring"

            return (
              <g key={idx}>
                {/* Link line */}
                <line
                  x1={from.x + 40}
                  y1={from.y + 25}
                  x2={to.x + 40}
                  y2={to.y + 25}
                  stroke={getLinkColor(link.status)}
                  strokeWidth={isConfiguring ? 3 : 2}
                  className={cn(
                    "transition-all duration-500",
                    isConfiguring && "animate-pulse"
                  )}
                />

                {/* Animated data packets for configuring links */}
                {isConfiguring && (
                  <>
                    <circle r="4" fill="#0052CC">
                      <animateMotion
                        dur="1s"
                        repeatCount="indefinite"
                        path={`M${from.x + 40},${from.y + 25} L${to.x + 40},${to.y + 25}`}
                      />
                    </circle>
                    <circle r="4" fill="#58a6ff">
                      <animateMotion
                        dur="1s"
                        repeatCount="indefinite"
                        begin="0.5s"
                        path={`M${to.x + 40},${to.y + 25} L${from.x + 40},${from.y + 25}`}
                      />
                    </circle>
                  </>
                )}

                {/* Connected checkmark */}
                {link.status === "connected" && (
                  <circle
                    cx={(from.x + to.x) / 2 + 40}
                    cy={(from.y + to.y) / 2 + 25}
                    r="8"
                    fill="#3fb950"
                    className="animate-in zoom-in duration-300"
                  />
                )}
              </g>
            )
          })}

          {/* Nodes */}
          {nodes.map((node) => (
            <g key={node.id}>
              {/* Node background */}
              <rect
                x={node.x}
                y={node.y}
                width={80}
                height={50}
                rx={6}
                fill="#111820"
                stroke={getNodeColor(node.id)}
                strokeWidth={2}
                className="transition-all duration-300"
              />

              {/* Node icon */}
              {node.type === "switch" ? (
                // Switch icon
                <g transform={`translate(${node.x + 28}, ${node.y + 8})`}>
                  <rect width="24" height="14" rx="2" fill={getNodeColor(node.id)} opacity="0.3" />
                  <circle cx="6" cy="7" r="2" fill={getNodeColor(node.id)} />
                  <circle cx="12" cy="7" r="2" fill={getNodeColor(node.id)} />
                  <circle cx="18" cy="7" r="2" fill={getNodeColor(node.id)} />
                </g>
              ) : (
                // Host icon
                <g transform={`translate(${node.x + 28}, ${node.y + 8})`}>
                  <rect width="24" height="16" rx="2" fill="none" stroke={getNodeColor(node.id)} strokeWidth="1.5" />
                  <line x1="4" y1="11" x2="20" y2="11" stroke={getNodeColor(node.id)} strokeWidth="1" />
                </g>
              )}

              {/* Node name */}
              <text
                x={node.x + 40}
                y={node.y + 40}
                textAnchor="middle"
                fill="#e6e6e6"
                fontSize="11"
                fontWeight="500"
                fontFamily="Inter, sans-serif"
              >
                {node.name}
              </text>

              {/* Pulsing ring for configuring nodes */}
              {links.some(
                (l) =>
                  (l.from === node.id || l.to === node.id) &&
                  l.status === "configuring"
              ) && (
                <rect
                  x={node.x - 2}
                  y={node.y - 2}
                  width={84}
                  height={54}
                  rx={8}
                  fill="none"
                  stroke="#0052CC"
                  strokeWidth="2"
                  opacity="0.5"
                  className="animate-ping"
                />
              )}
            </g>
          ))}
        </svg>
      </div>

      {/* Config Status Message */}
      {configMessage && (
        <div className="flex items-center gap-3 rounded-lg bg-primary/10 border border-primary/30 p-3">
          <div className="relative">
            <div className="h-3 w-3 rounded-full bg-primary" />
            <div className="absolute inset-0 h-3 w-3 rounded-full bg-primary animate-ping" />
          </div>
          <span className="text-sm font-mono text-primary">{configMessage}</span>
        </div>
      )}

      {/* Progress indicator */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>端口配置进度</span>
          <span>{Math.min(currentConfigStep, configSteps.length)} / {configSteps.length}</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{
              width: `${(Math.min(currentConfigStep, configSteps.length) / configSteps.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Detailed Port Config List */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        {configSteps.slice(1).map((step, idx) => {
          const linkStatus = links[step.linkIndex]?.status
          return (
            <div
              key={idx}
              className={cn(
                "flex items-center gap-2 p-2 rounded border transition-all",
                linkStatus === "connected"
                  ? "border-success/30 bg-success/5 text-success"
                  : linkStatus === "configuring"
                  ? "border-primary/30 bg-primary/5 text-primary"
                  : "border-border bg-muted/30 text-muted-foreground"
              )}
            >
              <div
                className={cn(
                  "h-2 w-2 rounded-full",
                  linkStatus === "connected"
                    ? "bg-success"
                    : linkStatus === "configuring"
                    ? "bg-primary animate-pulse"
                    : "bg-muted-foreground/50"
                )}
              />
              <span className="font-mono truncate">
                {step.message.replace("正在配置 ", "").replace("...", "")}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
