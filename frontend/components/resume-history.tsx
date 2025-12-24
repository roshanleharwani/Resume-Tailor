"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface ResumeVersion {
  id: string;
  resumeName: string;
  createdAt: Date;
  pdfUrl: string;
  texUrl: string;
}

export function ResumeHistory() {
  const [versions, setVersions] = useState<ResumeVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const downloadFile = async (url: string, filename: string) => {
    const res = await fetch(
      `/api/resumes/download?url=${encodeURIComponent(
        url
      )}&filename=${filename}`,
      { credentials: "include" }
    );

    const blob = await res.blob();
    const downloadUrl = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(downloadUrl);
  };

  /* =========================
     Fetch resume history
     ========================= */
  useEffect(() => {
    const fetchResumes = async () => {
      const res = await fetch("/api/resumes", {
        credentials: "include",
      });

      if (!res.ok) {
        setLoading(false);
        return;
      }

      const json = await res.json();

      const mapped: ResumeVersion[] = json.resumes.map((r: any) => ({
        id: r.id,
        resumeName: r.resume_name,
        createdAt: new Date(r.created_at),
        pdfUrl: r.tailored_pdf_url,
        texUrl: r.tailored_tex_url,
      }));

      setVersions(mapped);
      setLoading(false);
    };

    fetchResumes();
  }, []);

  /* =========================
     Delete handler (UI + API)
     ========================= */
  const handleDelete = async (id: string) => {
    setDeletingId(id);

    await fetch(`/api/resumes/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    setVersions((prev) => prev.filter((v) => v.id !== id));
    setDeletingId(null);
  };

  const containerVariants = {
    animate: { transition: { staggerChildren: 0.05 } },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95 },
  };

  if (loading) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        Loading resume history…
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-4xl font-bold text-primary mb-2">Resume History</h1>
        <p className="text-muted-foreground text-lg">
          Download your tailored resumes or delete old versions.
        </p>
      </div>

      {versions.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-2xl border">
          <div className="text-5xl mb-4">📚</div>
          <p className="text-lg font-medium">No resumes yet</p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 gap-4"
        >
          {versions.map((version) => (
            <motion.div
              key={version.id}
              variants={itemVariants}
              layout
              className={`bg-card border rounded-2xl p-6 transition-all ${
                deletingId === version.id ? "opacity-50" : ""
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-primary">
                    {version.resumeName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Created on{" "}
                    {version.createdAt.toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div className="flex gap-3 flex-wrap">
                  <Button
                    onClick={() =>
                      downloadFile(version.pdfUrl, `${version.resumeName}.pdf`)
                    }
                    className="bg-secondary text-secondary-foreground"
                  >
                    PDF
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() =>
                      downloadFile(version.texUrl, `${version.resumeName}.tex`)
                    }
                  >
                    LaTeX
                  </Button>

                  <Button
                    variant="outline"
                    className="border-destructive text-destructive"
                    onClick={() => handleDelete(version.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
