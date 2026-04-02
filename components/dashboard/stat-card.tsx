"use client"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  unit?: string
  trend?: string
  trendDirection?: "up" | "down" | "neutral"
  progress?: number
  status?: "good" | "normal" | "warning" | "critical"
  icon?: React.ReactNode
}

export function StatCard({
  title,
  value,
  unit,
  trend,
  trendDirection = "neutral",
  progress,
  status = "normal",
  icon,
}: StatCardProps) {
  const statusColors = {
    good: "text-success",
    normal: "text-primary",
    warning: "text-warning",
    critical: "text-destructive",
  }

  const progressColors = {
    good: "bg-success",
    normal: "bg-primary",
    warning: "bg-warning",
    critical: "bg-destructive",
  }

  const TrendIcon =
    trendDirection === "up"
      ? TrendingUp
      : trendDirection === "down"
      ? TrendingDown
      : Minus

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className={cn("text-3xl font-bold", statusColors[status])}>
            {value}
          </span>
          {unit && (
            <span className="text-sm text-muted-foreground">{unit}</span>
          )}
        </div>
        {trend && (
          <div className="mt-2 flex items-center gap-1 text-xs">
            <TrendIcon
              className={cn(
                "h-3 w-3",
                trendDirection === "up"
                  ? "text-success"
                  : trendDirection === "down"
                  ? "text-destructive"
                  : "text-muted-foreground"
              )}
            />
            <span
              className={cn(
                trendDirection === "up"
                  ? "text-success"
                  : trendDirection === "down"
                  ? "text-destructive"
                  : "text-muted-foreground"
              )}
            >
              {trend}
            </span>
            <span className="text-muted-foreground">vs 上周</span>
          </div>
        )}
        {progress !== undefined && (
          <div className="mt-3">
            <Progress
              value={progress}
              className="h-2"
              style={
                {
                  "--progress-background": `var(--${status === "good" ? "success" : status === "warning" ? "warning" : status === "critical" ? "destructive" : "primary"})`,
                } as React.CSSProperties
              }
            />
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>已使用</span>
              <span>{progress}%</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
