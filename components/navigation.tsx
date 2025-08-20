"use client"
import { Card } from "@/components/ui/card"
import { Users, Briefcase, Shield } from "lucide-react"

interface NavigationPropsType {
  currentInterface: "citizen" | "worker" | "panchayat"
  onInterfaceChange: (interfaceType: "citizen" | "worker" | "panchayat") => void
}

export function Navigation({ currentInterface, onInterfaceChange }: NavigationPropsType) {
  const interfaces = [
    {
      id: "citizen" as const,
      name: "Citizen Portal",
      description: "Report waste issues in your area",
      icon: Users,
    },
    {
      id: "worker" as const,
      name: "Worker Dashboard",
      description: "Manage assigned cleanup tasks",
      icon: Briefcase,
    },
    {
      id: "panchayat" as const,
      name: "Panchayat Admin",
      description: "Monitor and manage all reports",
      icon: Shield,
    },
  ]

  return (
    <div className="w-full bg-background border-b">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Waste Management System</h1>
          <p className="text-muted-foreground">Keeping our community clean and sustainable</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {interfaces.map((interfaceItem) => {
            const Icon = interfaceItem.icon
            const isActive = currentInterface === interfaceItem.id

            return (
              <Card
                key={interfaceItem.id}
                className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                  isActive ? "bg-primary text-primary-foreground border-primary" : "bg-card hover:bg-accent"
                }`}
                onClick={() => onInterfaceChange(interfaceItem.id)}
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <Icon className="h-8 w-8" />
                  <h3 className="font-semibold text-lg">{interfaceItem.name}</h3>
                  <p className={`text-sm ${isActive ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                    {interfaceItem.description}
                  </p>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
