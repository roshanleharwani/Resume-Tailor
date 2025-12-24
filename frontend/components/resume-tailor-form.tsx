"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";
interface ResumeTailorFormProps {
  onTailor?: (resume: File, jobDescription: string) => void;
}

export function ResumeTailorForm({ onTailor }: ResumeTailorFormProps) {
  const router = useRouter();
  const [resume, setResume] = useState<File | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [tailoredUrl, setTailoredUrl] = useState<string | null>(null);

  const uploadResumeToCloudinary = async (
    file: File
  ): Promise<string | null> => {
    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "resume_uploads"); // EXACT preset name

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/drfbxcpih/raw/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("Cloudinary error:", data);
        throw new Error(data.error?.message || "Upload failed");
      }
      toast.success("Resume Uploaded Successfully");
      return data.secure_url;
    } catch (err: any) {
      console.error("Upload failed:", err);
      toast.error(err.message || "Upload failed");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setResume(file);
      uploadResumeToCloudinary(file).then((url) => setResumeUrl(url));
    } else {
      toast.error("Please upload a PDF file");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type === "application/pdf") {
      setResume(file);
      uploadResumeToCloudinary(file).then((url) => setResumeUrl(url));
    } else {
      toast.error("Please upload a PDF file");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resumeUrl || !jobDescription.trim()) {
      toast.error("Please upload a resume and enter a job description");
      return;
    }

    setLoading(true);

    try {
      // 1) Call Next.js API route that talks to Flask
      const resp = await fetch("/api/start-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pdf_url: resumeUrl,
          text: jobDescription,
        }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        throw new Error(data?.error || "Failed to start job");
      }

      const jobId = data.job_id;

      // Store job ID so loading page can poll
      sessionStorage.setItem("tailor_job_id", jobId);
      sessionStorage.setItem("original_resume_url", resumeUrl);
      // Redirect to loading screen immediately
      router.push("/dashboard/loading");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Error starting tailoring job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-4xl font-bold text-primary mb-2">
          Tailor Your Resume
        </h1>
        <p className="text-muted-foreground text-lg">
          Upload your resume and paste the job description to get an AI-tailored
          version in seconds.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-8 bg-card p-8 rounded-2xl border border-border"
      >
        {/* Resume Upload */}
        <div className="space-y-3">
          <Label className="text-base font-semibold text-foreground">
            Upload Your Resume (PDF)
          </Label>
          <div
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
              isDragOver
                ? "border-secondary bg-secondary/10"
                : "border-border hover:bg-muted/50"
            } ${uploading ? "opacity-50 pointer-events-none" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              id="resume-upload"
              required
              disabled={uploading}
            />
            <label htmlFor="resume-upload" className="cursor-pointer block">
              <div className="text-4xl mb-3">{uploading ? "⏳" : "📄"}</div>
              <p className="font-semibold text-foreground mb-1">
                {uploading
                  ? "Uploading..."
                  : resume
                  ? `✓ ${resume.name}`
                  : "Drag and drop your PDF here"}
              </p>
              <p className="text-sm text-muted-foreground">
                {uploading ? "Please wait..." : "or click to browse"}
              </p>
            </label>
          </div>
        </div>

        {/* Job Description */}
        <div className="space-y-3">
          <Label
            htmlFor="jd"
            className="text-base font-semibold text-foreground"
          >
            Job Description
          </Label>
          <Textarea
            id="jd"
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="min-h-40 rounded-xl border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-secondary resize-none"
            required
          />
          <p className="text-sm text-muted-foreground">
            Copy and paste the full job description from the job posting.
          </p>
        </div>

        {/* Submit Button */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            type="submit"
            disabled={loading}
            size="lg"
            className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold text-lg h-12 rounded-xl"
          >
            {loading ? "Tailoring Your Resume..." : "Tailor Resume"}
          </Button>
        </motion.div>
      </form>

      {/* Tailored URL (response from Flask) */}
      {tailoredUrl && (
        <div className="bg-card p-4 rounded-2xl border border-border">
          <Label className="text-base font-semibold text-foreground">
            Tailored Resume URL
          </Label>
          <p className="mt-2 text-sm wrap-break-word">{tailoredUrl}</p>
          <a
            href={tailoredUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-block mt-2 text-secondary font-semibold"
          >
            Open Tailored Resume
          </a>
        </div>
      )}

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            title: "Fast & Accurate",
            description:
              "Get tailored resume in seconds using advanced AI analysis.",
          },
          {
            title: "Version Control",
            description:
              "Save multiple versions and compare them to find the best fit.",
          },
          {
            title: "Keyword Optimized",
            description:
              "Automatically matches ATS-friendly keywords from the job description.",
          },
        ].map((info, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 * idx }}
            className="p-4 rounded-lg bg-card border border-border"
          >
            <p className="font-semibold text-primary mb-2">{info.title}</p>
            <p className="text-sm text-muted-foreground">{info.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
