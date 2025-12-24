"use client"

import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { ProfileSettings } from "@/components/profile-settings"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const router = useRouter()

  const handleSave = (data: any) => {
    alert(`Profile updated: ${JSON.stringify(data)}`)
  }

  const handleLogout = () => {
    router.push("/")
  }

  return (
    <div className="flex">
      <DashboardSidebar activeItem="profile" onLogout={handleLogout} />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1 ml-64 min-h-screen bg-background p-8"
      >
        <div className="max-w-4xl">
          <ProfileSettings onSave={handleSave} />
        </div>
      </motion.main>
    </div>
  )
}
