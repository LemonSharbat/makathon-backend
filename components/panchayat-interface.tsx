"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { MapPin, CheckCircle, Clock, Calendar, BarChart3, Users, AlertTriangle, Shield } from "lucide-react"
import {
  dummyComplaints,
  dummyWorkers,
  getComplaintsByArea,
  getStatusCounts,
  getFrequentDumpingSpots,
  type Complaint,
} from "@/lib/dummy-data"

export function PanchayatInterface() {
  const [complaints, setComplaints] = useState<Complaint[]>(dummyComplaints)
  const [selectedComplaint, setSelectedComplaint] = useState<string | null>(null)
  const [newDeadline, setNewDeadline] = useState("")

  const statusCounts = getStatusCounts()
  const complaintsByArea = getComplaintsByArea()
  const frequentSpots = getFrequentDumpingSpots()

  const chartConfig = {
    count: {
      label: "Count",
      color: "hsl(var(--chart-1))",
    },
    pending: {
      label: "Pending",
      color: "hsl(var(--chart-2))",
    },
    resolved: {
      label: "Resolved",
      color: "hsl(var(--chart-1))",
    },
  }

  const statusData = [
    { name: "Pending", value: statusCounts.pending, color: "hsl(var(--chart-2))" },
    { name: "Resolved", value: statusCounts.resolved, color: "hsl(var(--chart-1))" },
  ]

  const handleDeadlineUpdate = (complaintId: string) => {
    if (newDeadline) {
      setComplaints((prev) =>
        prev.map((complaint) =>
          complaint.id === complaintId ? { ...complaint, deadline: new Date(newDeadline) } : complaint,
        ),
      )
      setSelectedComplaint(null)
      setNewDeadline("")
    }
  }

  const handleWorkerAssignment = (complaintId: string, workerId: string) => {
    const worker = dummyWorkers.find((w) => w.id === workerId)
    if (worker) {
      setComplaints((prev) =>
        prev.map((complaint) =>
          complaint.id === complaintId ? { ...complaint, assignedWorker: worker.name } : complaint,
        ),
      )
    }
  }

  const getStatusIcon = (status: string) => {
    return status === "Resolved" ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <Clock className="h-4 w-4 text-orange-500" />
    )
  }

  const getStatusBadge = (status: string) => {
    return (
      <Badge variant={status === "Resolved" ? "default" : "secondary"} className="flex items-center gap-1">
        {getStatusIcon(status)}
        {status}
      </Badge>
    )
  }

  const isOverdue = (complaint: Complaint) => {
    return complaint.deadline && complaint.status === "Pending" && new Date() > complaint.deadline
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Panchayat Admin Dashboard</h2>
        <p className="text-muted-foreground">Monitor and manage all waste reports</p>
      </div>

      {/* Overview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
            </div>
            <div className="text-2xl font-bold text-foreground">{complaints.length}</div>
            <div className="text-sm text-muted-foreground">Total Reports</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Clock className="h-5 w-5 text-orange-500" />
            </div>
            <div className="text-2xl font-bold text-orange-600">{statusCounts.pending}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">{statusCounts.resolved}</div>
            <div className="text-sm text-muted-foreground">Resolved</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div className="text-2xl font-bold text-primary">{dummyWorkers.length}</div>
            <div className="text-sm text-muted-foreground">Active Workers</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="management" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-8 mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Complaints by Area */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Complaints by Area
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={complaintsByArea}>
                      <XAxis dataKey="area" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" fill="var(--color-count)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="flex justify-center gap-4 mt-4">
                  {statusData.map((entry) => (
                    <div key={entry.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                      <span className="text-sm text-muted-foreground">
                        {entry.name}: {entry.value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Frequent Dumping Spots */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Frequent Dumping Spots
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={frequentSpots} layout="horizontal">
                    <XAxis type="number" />
                    <YAxis dataKey="location" type="category" width={150} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" fill="var(--color-count)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="management" className="space-y-6 mt-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-foreground mb-2">Complaint Management</h3>
            <p className="text-muted-foreground">Assign workers and set deadlines for complaints</p>
          </div>

          <div className="space-y-4">
            {complaints.map((complaint) => (
              <Card key={complaint.id} className={`${isOverdue(complaint) ? "border-red-500" : ""}`}>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {complaint.photo && (
                      <div className="lg:w-1/4">
                        <img
                          src={complaint.photo || "/placeholder.svg"}
                          alt={complaint.title}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>
                    )}

                    <div className={`${complaint.photo ? "lg:w-3/4" : "w-full"}`}>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-lg font-semibold text-foreground">{complaint.title}</h4>
                          {isOverdue(complaint) && (
                            <Badge variant="destructive" className="mt-1">
                              Overdue
                            </Badge>
                          )}
                        </div>
                        {getStatusBadge(complaint.status)}
                      </div>

                      <p className="text-muted-foreground mb-3">{complaint.description}</p>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <MapPin className="h-4 w-4" />
                        {complaint.location}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label className="text-sm font-medium">Assigned Worker</Label>
                          <Select
                            value={complaint.assignedWorker || ""}
                            onValueChange={(value) => handleWorkerAssignment(complaint.id, value)}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select worker" />
                            </SelectTrigger>
                            <SelectContent>
                              {dummyWorkers.map((worker) => (
                                <SelectItem key={worker.id} value={worker.id}>
                                  {worker.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="text-sm font-medium">Current Deadline</Label>
                          <div className="mt-1 p-2 bg-muted rounded text-sm">
                            {complaint.deadline ? complaint.deadline.toLocaleDateString() : "Not set"}
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium">Update Deadline</Label>
                          <div className="flex gap-2 mt-1">
                            <Input
                              type="date"
                              value={selectedComplaint === complaint.id ? newDeadline : ""}
                              onChange={(e) => {
                                setSelectedComplaint(complaint.id)
                                setNewDeadline(e.target.value)
                              }}
                              className="flex-1"
                            />
                            <Button
                              size="sm"
                              onClick={() => handleDeadlineUpdate(complaint.id)}
                              disabled={!newDeadline || selectedComplaint !== complaint.id}
                            >
                              <Calendar className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-sm text-muted-foreground mt-4 pt-4 border-t">
                        <span>Reported: {complaint.createdAt.toLocaleDateString()}</span>
                        {complaint.resolvedAt && <span>Resolved: {complaint.resolvedAt.toLocaleDateString()}</span>}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
