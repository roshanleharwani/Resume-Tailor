"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// Configure pdfjs worker to load from CDN in the browser
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface ResultPreviewProps {
  pdfUrl?: string;
  texUrl?: string;
  onSave?: (name: string) => void;
  onRetailor?: () => void;
}

export function ResultPreviewClient({
  pdfUrl,
  texUrl,
  onSave,
  onRetailor,
}: ResultPreviewProps) {
  const [versionName, setVersionName] = useState("Resume v1");
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [saved, setSaved] = useState(false);

  const [fileData, setFileData] = useState<ArrayBuffer | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [useIframe, setUseIframe] = useState(false);

  useEffect(() => {
    if (!pdfUrl) return;

    let cancelled = false;

    async function loadPdf() {
      try {
        setLoadingPdf(true);
        setPdfError(null);
        setUseIframe(false);

        const res = await fetch(pdfUrl as string, {
          method: "GET",
          headers: {
            Accept: "application/pdf",
          },
          mode: "cors",
          credentials: "omit",
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch PDF (${res.status})`);
        }

        const arrayBuffer = await res.arrayBuffer();

        if (!cancelled) setFileData(arrayBuffer);
      } catch (err: any) {
        // Fallback to iframe if fetch fails (e.g., CORS issues)
        if (!cancelled) {
          console.warn(
            "Failed to load PDF via fetch, attempting iframe fallback:",
            err.message
          );
          setUseIframe(true);
          setPdfError(null);
          setFileData(null);
        }
      } finally {
        if (!cancelled) setLoadingPdf(false);
      }
    }

    loadPdf();

    return () => {
      cancelled = true;
    };
  }, [pdfUrl]);

  const handleSave = () => {
    if (onSave) {
      onSave(versionName);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handleDownloadPdf = async () => {
    if (!pdfUrl) return;

    try {
      const response = await fetch(pdfUrl, {
        method: "GET",
        mode: "cors",
        credentials: "omit",
      });

      if (!response.ok) {
        throw new Error("Failed to download PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "resume.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download PDF. Please try again.");
    }
  };

  const handleDownloadLatex = async () => {
    if (!texUrl) return;

    try {
      const response = await fetch(texUrl, {
        method: "GET",
        mode: "cors",
        credentials: "omit",
      });

      if (!response.ok) {
        throw new Error("Failed to download LaTeX file");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "resume.tex";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download LaTeX file. Please try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-primary">
          Your Tailored Resume is Ready
        </h1>
        <p className="text-muted-foreground text-lg">
          Preview, download, or save your AI-generated resume.
        </p>
      </div>

      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden flex flex-col"
      >
        {/* PDF Preview Section */}
        <div className="flex-1 bg-white rounded-t-2xl">
          <div className="w-full h-[90vh] flex items-center justify-center bg-gray-50 border-b border-border">
            {loadingPdf && (
              <div className="flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <div className="mb-4">
                    <svg
                      className="animate-spin h-12 w-12 text-primary mx-auto"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                  <p>Loading PDF preview…</p>
                </div>
              </div>
            )}

            {pdfError && (
              <div className="text-center text-red-600 px-6">
                <svg
                  className="h-12 w-12 text-red-600 mx-auto mb-3"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M12 9v2m0 4v2m0 0a9 9 0 110-18 9 9 0 010 18z"></path>
                </svg>
                <p className="font-semibold">{pdfError}</p>
              </div>
            )}

            {useIframe && pdfUrl ? (
              <iframe
                src={pdfUrl}
                className="w-full h-full border-0"
                title="Resume PDF Preview"
                onError={() => setPdfError("Failed to load PDF")}
              />
            ) : null}

            {fileData && !pdfError && !useIframe && (
              <div className="w-full h-full overflow-auto bg-white">
                <Document
                  file={fileData}
                  onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                  loading={""}
                  onLoadError={(error) => {
                    console.warn("PDF Document loading error:", error);
                    setUseIframe(true);
                  }}
                >
                  {Array.from(new Array(numPages), (_, index) => (
                    <div
                      key={index}
                      className="flex justify-center py-4 bg-white"
                    >
                      <Page
                        pageNumber={index + 1}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        scale={1.5}
                      />
                    </div>
                  ))}
                </Document>
              </div>
            )}
          </div>
        </div>

        {/* Actions Section */}
        <div className="bg-card border-t border-border p-6 space-y-4">
          {!showSaveForm ? (
            <Button
              onClick={() => setShowSaveForm(true)}
              className="w-full bg-primary hover:bg-primary/90 text-white rounded-lg h-11 font-medium"
            >
              💾 Save This Version
            </Button>
          ) : (
            <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
              <div>
                <Label
                  htmlFor="version-name"
                  className="text-sm font-semibold mb-2 block"
                >
                  Version Name
                </Label>
                <Input
                  id="version-name"
                  value={versionName}
                  onChange={(e) => setVersionName(e.target.value)}
                  className="rounded-lg"
                  placeholder="e.g., Resume v1"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleSave}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-lg"
                >
                  {saved ? "✓ Saved!" : "Save"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowSaveForm(false)}
                  className="flex-1 rounded-lg"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Button
          disabled={!pdfUrl}
          onClick={handleDownloadPdf}
          className="h-11 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium"
        >
          📄 Download PDF
        </Button>

        <Button
          disabled={!texUrl}
          variant="outline"
          onClick={handleDownloadLatex}
          className="h-11 rounded-lg font-medium"
        >
          ⌨️ Download LaTeX
        </Button>

        <Button
          variant="outline"
          onClick={onRetailor}
          className="h-11 rounded-lg font-medium"
        >
          🔄 Tailor Again
        </Button>
      </div>

      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800 text-sm text-foreground space-y-2">
        <p className="font-semibold flex items-center gap-2">
          <span>✓</span> Resume Optimization Complete
        </p>
        <p className="text-sm opacity-90">
          Your resume has been generated using professional LaTeX templates and
          is fully ATS-optimized for maximum compatibility with applicant
          tracking systems.
        </p>
      </div>
    </motion.div>
  );
}
