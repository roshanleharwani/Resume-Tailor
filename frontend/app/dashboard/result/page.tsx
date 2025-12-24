"use client";

import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { ResultPreviewClient as ResultPreview } from "@/components/result-preview-client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ResultPage() {
  const router = useRouter();

  const [resultData, setResultData] = useState<any>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [texUrl, setTexUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const rawResult = sessionStorage.getItem("tailoredResult");
      const rawError = sessionStorage.getItem("resultError");

      if (rawError) {
        setError(rawError);
        return;
      }

      if (!rawResult) {
        setError("No result found. Please tailor your resume again.");
        return;
      }

      const parsed = JSON.parse(rawResult);
      setResultData(parsed);

      const payload = parsed?.payload;

      if (!payload?.pdf_url || !payload?.tex_url) {
        setError("Resume files were not generated correctly.");
        return;
      }

      setPdfUrl(payload.pdf_url);
      setTexUrl(payload.tex_url);
    } catch {
      setError("Failed to load resume result.");
    } finally {
      setLoading(false);

      // Clean up transient keys
      sessionStorage.removeItem("resultError");
      sessionStorage.removeItem("tailorInProgress");
      sessionStorage.removeItem("tailoredUrl");
      sessionStorage.removeItem("tailorError");
    }
  }, []);

  const handleLogout = () => router.push("/");
  const handleRetailor = () => router.push("/dashboard");

  /**
   * ✅ Save resume handler (this is what was missing)
   */
  const handleSaveResume = async (resumeName: string) => {
    if (!pdfUrl || !texUrl) {
      throw new Error("Resume URLs missing");
    }

    const originalPdfUrl =
      sessionStorage.getItem("original_resume_url") || null;

    const res = await fetch("/api/resumes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        resume_name: resumeName,
        tailored_pdf_url: pdfUrl,
        tailored_tex_url: texUrl,
        original_pdf_url: originalPdfUrl,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error || "Failed to save resume");
    }

    toast.success("Resume saved to history");
  };

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar activeItem="tailor" onLogout={handleLogout} />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex-1 ml-64 p-8"
      >
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <header>
            <h1 className="text-3xl font-bold">Tailored Resume</h1>
            <p className="text-muted-foreground mt-1">
              Preview and download your AI-generated resume
            </p>
          </header>

          {/* Loading */}
          {loading && (
            <div className="text-center text-muted-foreground">
              Loading resume…
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-5 py-4 rounded-lg">
              <p className="font-semibold mb-1">Error</p>
              <p>{error}</p>

              <button
                onClick={handleRetailor}
                className="mt-3 underline text-sm"
              >
                Go back and try again
              </button>
            </div>
          )}

          {/* Success */}
          {!loading && !error && pdfUrl && texUrl && (
            <ResultPreview
              pdfUrl={pdfUrl}
              texUrl={texUrl}
              onSave={handleSaveResume} // ✅ FIX
              onRetailor={handleRetailor}
            />
          )}
        </div>
      </motion.main>
    </div>
  );
}
