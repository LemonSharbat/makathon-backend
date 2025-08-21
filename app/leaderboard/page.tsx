"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trophy, TrendingUp, TrendingDown, Clock, CheckCircle, AlertTriangle, ExternalLink } from "lucide-react"
import { dummyPanchayatPerformance } from "@/lib/dummy-data"

export default function LeaderboardPage() {
  const [sortOrder, setSortOrder] = useState<"worst-to-best" | "best-to-worst">("worst-to-best")

  const sortedPanchayats = [...dummyPanchayatPerformance].sort((a, b) => {
    if (sortOrder === "worst-to-best") {
      // Sort by highest unaddressed first, then lowest resolution rate
      if (a.unaddressedCount !== b.unaddressedCount) {
        return b.unaddressedCount - a.unaddressedCount
      }
      return a.resolutionRate - b.resolutionRate
    } else {
      // Sort by lowest unaddressed first, then highest resolution rate
      if (a.unaddressedCount !== b.unaddressedCount) {
        return a.unaddressedCount - b.unaddressedCount
      }
      return b.resolutionRate - a.resolutionRate
    }
  })

  const getPerformanceColor = (resolutionRate: number) => {
    if (resolutionRate >= 80) return "text-green-600"
    if (resolutionRate >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getPerformanceBadge = (resolutionRate: number) => {
    if (resolutionRate >= 80) return "default"
    if (resolutionRate >= 70) return "secondary"
    return "destructive"
  }

  const getRankIcon = (index: number) => {
    if (sortOrder === "best-to-worst") {
      if (index === 0) return <Trophy className="h-5 w-5 text-yellow-500" />
      if (index === 1) return <Trophy className="h-5 w-5 text-gray-400" />
      if (index === 2) return <Trophy className="h-5 w-5 text-amber-600" />
    }
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-yellow-100 p-3 rounded-full">
              <Trophy className="h-8 w-8 text-yellow-600" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Panchayat Performance Board</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Track and compare waste management performance across different Panchayats. Monitor resolution rates,
            response times, and overall efficiency.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Sort by:</span>
            <Select value={sortOrder} onValueChange={(value: "worst-to-best" | "best-to-worst") => setSortOrder(value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="worst-to-best">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4" />
                    Worst to Best
                  </div>
                </SelectItem>
                <SelectItem value="best-to-worst">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Best to Worst
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-muted-foreground">Showing {sortedPanchayats.length} Panchayats</div>
        </div>

        {/* Performance Cards */}
        <div className="space-y-4">
          {sortedPanchayats.map((panchayat, index) => (
            <Card key={panchayat.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Panchayat Info */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {getRankIcon(index)}
                      <div className="text-2xl font-bold text-muted-foreground">#{index + 1}</div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">{panchayat.name}</h3>
                      <p className="text-muted-foreground">{panchayat.location}</p>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-muted-foreground">Resolved</span>
                      </div>
                      <div className="text-2xl font-bold text-green-600">{panchayat.resolvedCount}</div>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <span className="text-sm font-medium text-muted-foreground">Unaddressed</span>
                      </div>
                      <div className="text-2xl font-bold text-red-600">{panchayat.unaddressedCount}</div>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-muted-foreground">Resolution Rate</span>
                      </div>
                      <Badge variant={getPerformanceBadge(panchayat.resolutionRate)} className="text-sm font-bold">
                        {panchayat.resolutionRate}%
                      </Badge>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-muted-foreground">Avg. Time</span>
                      </div>
                      <div className="text-lg font-semibold text-blue-600">{panchayat.averageResolutionTime}d</div>
                    </div>
                  </div>

                  {/* Action Button */}
                  {/* <div className="flex flex-col items-center gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/panchayat/dashboard?pid=${panchayat.id}`}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Details
                      </Link>
                    </Button>
                    <div className="text-xs text-muted-foreground text-center">
                      {panchayat.totalComplaints} total complaints
                    </div>
                  </div> */}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Total Resolved
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {sortedPanchayats.reduce((sum, p) => sum + p.resolvedCount, 0)}
              </div>
              <p className="text-sm text-muted-foreground">Across all Panchayats</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Total Unaddressed
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-red-600">
                {sortedPanchayats.reduce((sum, p) => sum + p.unaddressedCount, 0)}
              </div>
              <p className="text-sm text-muted-foreground">Needs immediate attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Average Resolution Rate
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-primary">
                {Math.round(sortedPanchayats.reduce((sum, p) => sum + p.resolutionRate, 0) / sortedPanchayats.length)}%
              </div>
              <p className="text-sm text-muted-foreground">System-wide performance</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
