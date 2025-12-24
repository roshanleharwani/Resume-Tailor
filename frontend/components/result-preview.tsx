"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import toast from "react-hot-toast";

interface ResultPreviewProps {
  pdfUrl?: string;
  texUrl?: string;
  onSave?: (name: string) => Promise<void> | void;
  onRetailor?: () => void;
}

export function ResultPreview({
  pdfUrl,
  texUrl,
  onSave,
  onRetailor,
}: ResultPreviewProps) {
  const [versionName, setVersionName] = useState("Resume v1");
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!versionName.trim()) {
      toast.error("Please enter a resume name");
      return;
    }

    if (!onSave) {
      toast.error("Save handler not available");
      return;
    }

    try {
      setSaving(true);
      await onSave(versionName);

      toast.success("Resume saved successfully");
      setShowSaveForm(false);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to save resume");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-primary">
          Your Tailored Resume is Ready
        </h1>
        <p className="text-muted-foreground text-lg">
          Preview, download, or save your AI-generated resume.
        </p>
      </div>

      {/* Preview Card */}
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="bg-card border border-border rounded-2xl p-6 space-y-6"
      >
        {/* PDF Preview */}
        <div className="rounded-xl overflow-hidden border bg-white">
          {pdfUrl ? (
            <iframe
              src={pdfUrl}
              title="Resume PDF Preview"
              className="w-full h-[85vh]"
              sandbox="allow-same-origin allow-scripts allow-popups"
            />
          ) : (
            <div className="h-[400px] flex items-center justify-center text-muted-foreground">
              PDF is still generating…
            </div>
          )}
        </div>

        {/* Save Section */}
        <div className="border-t border-border pt-6">
          {!showSaveForm ? (
            <Button
              onClick={() => setShowSaveForm(true)}
              className="w-full bg-secondary hover:bg-secondary/90 rounded-lg"
            >
              Save This Version
            </Button>
          ) : (
            <div className="space-y-3">
              <div>
                <Label htmlFor="version-name">Version Name</Label>
                <Input
                  id="version-name"
                  value={versionName}
                  onChange={(e) => setVersionName(e.target.value)}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1"
                >
                  {saving ? "Saving…" : "Save"}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setShowSaveForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button
          disabled={!pdfUrl}
          onClick={() =>
            pdfUrl && window.open(pdfUrl, "_blank", "noopener,noreferrer")
          }
          className="h-12"
        >
          Download PDF
        </Button>

        <Button
          disabled={!texUrl}
          variant="outline"
          onClick={() =>
            texUrl && window.open(texUrl, "_blank", "noopener,noreferrer")
          }
          className="h-12"
        >
          Download LaTeX
        </Button>

        <Button
          variant="outline"
          onClick={() => onRetailor && onRetailor()}
          disabled={!onRetailor}
          className="h-12"
        >
          Tailor Again
        </Button>
      </div>

      {/* Info */}
      <div className="p-4 bg-muted/50 rounded-lg border text-sm text-muted-foreground">
        Your resume is generated using professional LaTeX templates and is fully
        ATS-optimized.
      </div>
    </motion.div>
  );
}
