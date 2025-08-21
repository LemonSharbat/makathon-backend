"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, FileText, Wrench, Building2, Trophy } from "lucide-react"

export function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/citizen", label: "Citizen Report", icon: FileText },
    { href: "/worker/login", label: "Worker", icon: Wrench },
    { href: "/panchayat/login", label: "Panchayat", icon: Building2 },
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  ]

  return (
    <nav className="border-b bg-card sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors">
            THUDAR
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive =
                pathname === item.href ||
                (item.href.includes("/worker") && pathname.startsWith("/worker")) ||
                (item.href.includes("/panchayat") && pathname.startsWith("/panchayat"))

              return (
                <Button
                  key={item.href}
                  asChild
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Link href={item.href}>
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                </Button>
              )
            })}
          </div>

          <div className="md:hidden">
            <Button variant="ghost" size="sm">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>

        <div className="md:hidden mt-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive =
              pathname === item.href ||
              (item.href.includes("/worker") && pathname.startsWith("/worker")) ||
              (item.href.includes("/panchayat") && pathname.startsWith("/panchayat"))

            return (
              <Button
                key={item.href}
                asChild
                variant={isActive ? "default" : "ghost"}
                size="sm"
                className="w-full justify-start gap-2"
              >
                <Link href={item.href}>
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </Button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
