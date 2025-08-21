"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Wrench, UserPlus } from "lucide-react"

export default function WorkerSignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    workerId: "",
    password: "",
    location: "",
    panchayat: "",
    groupName: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Dummy validation
    if (!formData.workerId || !formData.password || !formData.location || !formData.panchayat) {
      setError("Please fill in all required fields")
      setIsLoading(false)
      return
    }

    // Simulate API call
    setTimeout(() => {
      // Dummy registration - redirect to login
      router.push("/worker/login")
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto bg-green-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <Wrench className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Worker Registration</h1>
          <p className="text-muted-foreground mt-2">Join the TUDAR cleanup team</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Create Worker Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="workerId">Worker ID *</Label>
                <Input
                  id="workerId"
                  placeholder="Enter your worker ID"
                  value={formData.workerId}
                  onChange={(e) => handleInputChange("workerId", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Place/Location *</Label>
                <Input
                  id="location"
                  placeholder="Enter your work location"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="panchayat">Panchayat *</Label>
                <Input
                  id="panchayat"
                  placeholder="Enter your panchayat name"
                  value={formData.panchayat}
                  onChange={(e) => handleInputChange("panchayat", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="groupName">Group Name (Optional)</Label>
                <Input
                  id="groupName"
                  placeholder="Enter your group name"
                  value={formData.groupName}
                  onChange={(e) => handleInputChange("groupName", e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/worker/login" className="text-primary hover:underline font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Button asChild variant="ghost">
            <Link href="/">← Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
