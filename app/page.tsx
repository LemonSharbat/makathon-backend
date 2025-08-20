"use client"

import { useState } from "react"
import { CitizenInterface } from "@/components/citizen-interface"
import { WorkerInterface } from "@/components/worker-interface"
import { PanchayatInterface } from "@/components/panchayat-interface"
import { Button } from "@/components/ui/button"
import { Users, Wrench, Building2 } from "lucide-react"

export default function Home() {
  const [currentInterface, setCurrentInterface] = useState<"citizen" | "worker" | "panchayat">("citizen")

  const interfaces = [
    {
      id: "citizen" as const,
      title: "Citizen Portal",
      description: "Report waste issues in your area",
      icon: Users,
      color: "bg-blue-50 hover:bg-blue-100 border-blue-200",
    },
    {
      id: "worker" as const,
      title: "Worker Dashboard",
      description: "Manage assigned cleanup tasks",
      icon: Wrench,
      color: "bg-green-50 hover:bg-green-100 border-green-200",
    },
    {
      id: "panchayat" as const,
      title: "Panchayat Admin",
      description: "Monitor and manage all reports",
      icon: Building2,
      color: "bg-purple-50 hover:bg-purple-100 border-purple-200",
    },
  ]

  const renderContent = () => {
    switch (currentInterface) {
      case "citizen":
        return <CitizenInterface />
      case "worker":
        return <WorkerInterface />
      case "panchayat":
        return <PanchayatInterface />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-center text-foreground">Waste Management System</h1>
          <p className="text-center text-muted-foreground mt-2">Keeping our community clean together</p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {interfaces.map((interface_) => {
              const Icon = interface_.icon
              return (
                <Button
                  key={interface_.id}
                  variant={currentInterface === interface_.id ? "default" : "outline"}
                  onClick={() => setCurrentInterface(interface_.id)}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {interface_.title}
                </Button>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">{renderContent()}</main>
    </div>
  )
}
