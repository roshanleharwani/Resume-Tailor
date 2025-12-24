"use client"

import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { ResumeHistory } from "@/components/resume-history"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

export default function HistoryPage() {
  const router = useRouter()

  const handleDownload = (id: string) => {
    alert(`Downloading resume ${id}...`)
  }

  const handleDelete = (id: string) => {
    alert(`Resume ${id} deleted`)
  }

  const handleLogout = () => {
    router.push("/")
  }

  return (
    <div className="flex">
      <DashboardSidebar activeItem="resume-history" onLogout={handleLogout} />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1 ml-64 min-h-screen bg-background p-8"
      >
        <div className="max-w-4xl">
          <ResumeHistory onDownload={handleDownload} onDelete={handleDelete} />
        </div>
      </motion.main>
    </div>
  )
}
