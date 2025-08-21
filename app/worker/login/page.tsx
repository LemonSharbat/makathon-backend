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
import { Wrench, LogIn } from "lucide-react"

export default function WorkerLoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    workerId: "",
    password: "",
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
    if (!formData.workerId || !formData.password) {
      setError("Please fill in all required fields")
      setIsLoading(false)
      return
    }

    // Simulate API call
    setTimeout(() => {
      // Dummy authentication - accept any credentials
      router.push("/worker/dashboard")
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto bg-green-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <Wrench className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Worker Login</h1>
          <p className="text-muted-foreground mt-2">Access your cleanup tasks and assignments</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LogIn className="h-5 w-5" />
              Sign In to Your Account
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
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/worker/signup" className="text-primary hover:underline font-medium">
                  Sign up here
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
