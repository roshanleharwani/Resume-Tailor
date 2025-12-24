"use client";

import { LoadingAnimation } from "@/components/loading-animation";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoadingPage() {
  const router = useRouter();

  useEffect(() => {
    const jobId = sessionStorage.getItem("tailor_job_id");
    if (!jobId) {
      sessionStorage.setItem("resultError", "No job ID found");
      router.push("/dashboard/result");
      return;
    }

    const pollInterval = setInterval(async () => {
      try {
        const resp = await fetch(`/api/job-status?job_id=${jobId}`);
        const data = await resp.json();

        // Status states returned by Flask
        if (data.status === "queued" || data.status === "running") {
          return; // keep waiting
        }

        clearInterval(pollInterval);

        // Completed successfully
        if (data.status === "completed") {
          sessionStorage.setItem("tailoredResult", JSON.stringify(data));
          router.push("/dashboard/result");
        }

        // Failure
        if (data.status === "failed") {
          sessionStorage.setItem(
            "resultError",
            JSON.stringify(data.payload || data)
          );
          router.push("/dashboard/result");
        }
      } catch (err: any) {
        clearInterval(pollInterval);
        sessionStorage.setItem("resultError", err.message || "Server error");
        router.push("/dashboard/result");
      }
    }, 3000); // poll every 3 seconds

    // Hard timeout after 5 mins
    const timeout = setTimeout(() => {
      clearInterval(pollInterval);
      sessionStorage.setItem("resultError", "Job timeout");
      router.push("/dashboard/result");
    }, 300000);

    return () => {
      clearInterval(pollInterval);
      clearTimeout(timeout);
    };
  }, [router]);

  return <LoadingAnimation />;
}
