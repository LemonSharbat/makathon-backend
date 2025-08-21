"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, CheckCircle, Clock, Upload, User } from "lucide-react"
import { dummyComplaints, type Complaint } from "@/lib/dummy-data"

export function WorkerInterface() {
  const [selectedWorker] = useState("Rajesh Kumar") // In real app, this would come from auth
  const [tasks, setTasks] = useState<Complaint[]>(dummyComplaints)
  const [afterPhotos, setAfterPhotos] = useState<Record<string, string>>({})
  const [uploadingPhotos, setUploadingPhotos] = useState<Record<string, File>>({})

  const myTasks = tasks.filter((task) => task.assignedWorker === selectedWorker)
  const pendingTasks = myTasks.filter((task) => task.status === "Pending")
  const completedTasks = myTasks.filter((task) => task.status === "Resolved")

  const handlePhotoUpload = (taskId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadingPhotos((prev) => ({ ...prev, [taskId]: file }))
      const reader = new FileReader()
      reader.onload = (e) => {
        setAfterPhotos((prev) => ({ ...prev, [taskId]: e.target?.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleMarkResolved = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: "Resolved" as const,
              resolvedAt: new Date(),
              afterPhoto: afterPhotos[taskId] || undefined,
            }
          : task,
      ),
    )
    // Clean up temporary photo states
    setAfterPhotos((prev) => {
      const { [taskId]: removed, ...rest } = prev
      return rest
    })
    setUploadingPhotos((prev) => {
      const { [taskId]: removed, ...rest } = prev
      return rest
    })
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

  const TaskCard = ({ task, showActions = false }: { task: Complaint; showActions?: boolean }) => (
    <Card key={task.id} className="overflow-hidden">
      <CardContent className="p-0">
        <div className="md:flex">
          {task.photo && (
            <div className="md:w-1/3">
              <img
                src={task.photo || "/placeholder.svg"}
                alt={task.title}
                className="w-full h-48 md:h-full object-cover"
              />
            </div>
          )}
          <div className={`p-6 ${task.photo ? "md:w-2/3" : "w-full"}`}>
            <div className="flex justify-between items-start mb-3">
              <h4 className="text-lg font-semibold text-foreground">{task.title}</h4>
              {getStatusBadge(task.status)}
            </div>

            <p className="text-muted-foreground mb-3">{task.description}</p>

            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <MapPin className="h-4 w-4" />
              {task.location}
            </div>

            <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
              <span>Reported: {task.createdAt.toLocaleDateString()}</span>
              {task.deadline && (
                <span className="text-orange-600 font-medium">Deadline: {task.deadline.toLocaleDateString()}</span>
              )}
            </div>

            {showActions && task.status === "Pending" && (
              <div className="space-y-4 border-t pt-4">
                <div className="space-y-2">
                  <Label htmlFor={`photo-${task.id}`} className="text-sm font-medium">
                    Upload After-Cleanup Photo
                  </Label>
                  <Input
                    id={`photo-${task.id}`}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePhotoUpload(task.id, e)}
                    className="cursor-pointer"
                  />
                  {afterPhotos[task.id] && (
                    <div className="mt-2">
                      <img
                        src={afterPhotos[task.id] || "/placeholder.svg"}
                        alt="After cleanup preview"
                        className="w-full max-w-xs h-32 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>

                <Button onClick={() => handleMarkResolved(task.id)} className="w-full" disabled={!afterPhotos[task.id]}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Resolved
                </Button>
              </div>
            )}

            {task.status === "Resolved" && task.afterPhoto && (
              <div className="border-t pt-4">
                <Label className="text-sm font-medium mb-2 block">After-Cleanup Photo</Label>
                <img
                  src={task.afterPhoto || "/placeholder.svg"}
                  alt="After cleanup"
                  className="w-full max-w-xs h-32 object-cover rounded-lg border"
                />
                {task.resolvedAt && (
                  <p className="text-sm text-green-600 mt-2">Completed on: {task.resolvedAt.toLocaleDateString()}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Worker Dashboard</h2>
        <p className="text-muted-foreground">Manage your assigned cleanup tasks</p>
      </div>

      {/* Worker Info */}
      <Card className="max-w-md mx-auto">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Welcome, {selectedWorker}</h3>
              <p className="text-sm text-muted-foreground">Waste Management Worker</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{pendingTasks.length}</div>
            <div className="text-sm text-muted-foreground">Pending Tasks</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{completedTasks.length}</div>
            <div className="text-sm text-muted-foreground">Completed Tasks</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{myTasks.length}</div>
            <div className="text-sm text-muted-foreground">Total Assigned</div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks Tabs */}
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Pending ({pendingTasks.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Completed ({completedTasks.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-6 mt-8">
          {pendingTasks.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">All Caught Up!</h3>
                <p className="text-muted-foreground">You have no pending tasks at the moment.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-foreground mb-2">My Pending Tasks</h3>
                <p className="text-muted-foreground">Complete these tasks by uploading after-cleanup photos</p>
              </div>
              {pendingTasks.map((task) => (
                <TaskCard key={task.id} task={task} showActions={true} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-6 mt-8">
          {completedTasks.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Completed Tasks Yet</h3>
                <p className="text-muted-foreground">
                  Completed tasks will appear here once you mark them as resolved.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-foreground mb-2">Completed Tasks</h3>
                <p className="text-muted-foreground">Tasks you have successfully completed</p>
              </div>
              {completedTasks.map((task) => (
                <TaskCard key={task.id} task={task} showActions={false} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
