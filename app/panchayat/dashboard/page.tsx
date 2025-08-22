"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { PanchayatInterface } from "@/components/panchayat-interface"

export default function PanchayatDashboardPage() {
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      // 🔹 Redirect if not logged in or not the correct admin
      if (!user || user.email !== "admin@panchayath.com") {
        router.push("/panchayat/login")
      }
    }

    checkUser()
  }, [router])

  return (
    <div className="container mx-auto px-4 py-8">
      <PanchayatInterface />
    </div>
  )
}

























// import { PanchayatInterface } from "@/components/panchayat-interface"

// export default function PanchayatDashboardPage() {
//   return (
//     <div className="container mx-auto px-4 py-8">
//       <PanchayatInterface />
//     </div>
//   )
// }
