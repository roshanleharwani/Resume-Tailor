"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { ResumeTailorForm } from "@/components/resume-tailor-form";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [isTailoring, setIsTailoring] = useState(false);

  const handleTailor = (resume: File, jobDescription: string) => {
    setIsTailoring(true);
    // Simulate processing
    setTimeout(() => {
      router.push("/dashboard/loading");
    }, 500);
  };

  return (
    <div className="flex">
      <DashboardSidebar activeItem="tailor" />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1 ml-64 min-h-screen bg-background p-8"
      >
        <div className="max-w-4xl">
          <ResumeTailorForm onTailor={handleTailor} />
        </div>
      </motion.main>
    </div>
  );
}
