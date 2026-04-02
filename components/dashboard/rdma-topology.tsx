"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { rdmaTopologyNodes, rdmaTopologyLinks } from "@/lib/mock-data"

export function RDMATopology() {
  const getNodeColor = (type: string) => {
    return type === "switch" ? "#0052CC" : "#00c7b7"
  }

  const getNodeSize = (type: string) => {
    return type === "switch" ? 24 : 20
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-foreground">
          RDMA 网络拓扑
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <svg
            viewBox="0 0 650 320"
            className="h-full w-full"
            style={{ background: "transparent" }}
          >
            {/* Draw links */}
            {rdmaTopologyLinks.map((link, index) => {
              const sourceNode = rdmaTopologyNodes.find(
                (n) => n.id === link.source
              )
              const targetNode = rdmaTopologyNodes.find(
                (n) => n.id === link.target
              )
              if (!sourceNode || !targetNode) return null

              return (
                <line
                  key={`link-${index}`}
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  stroke="var(--border)"
                  strokeWidth={2}
                  opacity={0.6}
                />
              )
            })}

            {/* Draw nodes */}
            {rdmaTopologyNodes.map((node) => {
              const size = getNodeSize(node.type)
              const color = getNodeColor(node.type)

              return (
                <g key={node.id}>
                  {/* Node glow effect */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={size + 4}
                    fill={color}
                    opacity={0.2}
                  />
                  {/* Node circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={size}
                    fill="var(--card)"
                    stroke={color}
                    strokeWidth={2}
                  />
                  {/* Node icon */}
                  {node.type === "switch" ? (
                    <g transform={`translate(${node.x - 8}, ${node.y - 8})`}>
                      <rect
                        width={16}
                        height={16}
                        rx={2}
                        fill="none"
                        stroke={color}
                        strokeWidth={1.5}
                      />
                      <line
                        x1={4}
                        y1={6}
                        x2={12}
                        y2={6}
                        stroke={color}
                        strokeWidth={1.5}
                      />
                      <line
                        x1={4}
                        y1={10}
                        x2={12}
                        y2={10}
                        stroke={color}
                        strokeWidth={1.5}
                      />
                    </g>
                  ) : (
                    <g transform={`translate(${node.x - 7}, ${node.y - 7})`}>
                      <rect
                        width={14}
                        height={14}
                        rx={2}
                        fill="none"
                        stroke={color}
                        strokeWidth={1.5}
                      />
                      <rect
                        x={3}
                        y={3}
                        width={8}
                        height={8}
                        rx={1}
                        fill={color}
                        opacity={0.6}
                      />
                    </g>
                  )}
                  {/* Node label */}
                  <text
                    x={node.x}
                    y={node.y + size + 14}
                    textAnchor="middle"
                    fill="var(--muted-foreground)"
                    fontSize={10}
                    fontFamily="var(--font-mono)"
                  >
                    {node.label}
                  </text>
                </g>
              )
            })}

            {/* Legend */}
            <g transform="translate(20, 290)">
              <circle cx={8} cy={0} r={6} fill="#0052CC" />
              <text
                x={20}
                y={4}
                fill="var(--muted-foreground)"
                fontSize={10}
              >
                交换机
              </text>
              <circle cx={80} cy={0} r={6} fill="#00c7b7" />
              <text
                x={92}
                y={4}
                fill="var(--muted-foreground)"
                fontSize={10}
              >
                计算节点
              </text>
            </g>
          </svg>
        </div>
      </CardContent>
    </Card>
  )
}
