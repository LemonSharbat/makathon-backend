"use client"

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient"; 
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Wrench, Building2, Trophy, Camera, BarChart3, Users, ArrowRight } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            <span className="text-primary">TUDAR</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Citizen-led waste reporting platform for cleaner communities
          </p>
          <p className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto">
            Report waste issues instantly, track cleanup progress, and help build cleaner neighborhoods across Mangalore
            and nearby towns.
          </p>
          <Button asChild size="lg" className="text-lg px-8 py-6">
            <Link href="/citizen">
              <FileText className="h-5 w-5 mr-2" />
              Report an Issue Now
            </Link>
          </Button>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">How TUDAR Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Citizen Card */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto bg-blue-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Citizens</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Report waste issues with photos and location details. No registration required.
                </p>
                <div className="flex flex-col gap-2">
                  <Button asChild className="w-full">
                    <Link href="/citizen">
                      <Camera className="h-4 w-4 mr-2" />
                      Report an Issue
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Worker Card */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto bg-green-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <Wrench className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">Workers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Access assigned cleanup tasks, upload completion photos, and track progress.
                </p>
                <div className="flex flex-col gap-2">
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <Link href="/worker/login">Log In</Link>
                  </Button>
                  <Button asChild variant="ghost" className="w-full">
                    <Link href="/worker/signup">Sign Up</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Panchayat Card */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto bg-purple-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <Building2 className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Panchayats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Monitor all reports, assign workers, set deadlines, and analyze waste patterns.
                </p>
                <div className="flex flex-col gap-2">
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <Link href="/panchayat/login">Log In</Link>
                  </Button>
                  <Button asChild variant="ghost" className="w-full">
                    <Link href="/panchayat/signup">Sign Up</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center text-foreground mb-8">About TUDAR</h2>
          <div className="prose prose-lg mx-auto text-center space-y-6">
            <p className="text-muted-foreground">
              TUDAR empowers communities to take charge of their cleanliness by providing a simple, effective platform
              for reporting and managing waste issues. Our system connects citizens, workers, and local authorities in a
              coordinated effort to maintain clean neighborhoods.
            </p>
            <p className="text-muted-foreground">
              With real-time reporting, photo documentation, and progress tracking, TUDAR ensures transparency and
              accountability in waste management. Join thousands of users across Mangalore and nearby towns who are
              making a difference, one report at a time.
            </p>
            <p className="text-muted-foreground">
              Whether you're reporting an overflowing bin, tracking cleanup progress, or analyzing waste patterns,
              TUDAR provides the tools needed to build cleaner, healthier communities for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Leaderboard Preview */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mx-auto bg-yellow-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <Trophy className="h-8 w-8 text-yellow-600" />
              </div>
              <CardTitle className="text-2xl">Panchayat Performance Board</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                See how different Panchayats are performing in waste management. Track resolution rates, response times,
                and community impact.
              </p>
              <Button asChild size="lg">
                <Link href="/leaderboard">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  View Performance Board
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
