"use client";

import { useEffect, useState } from "react";

interface LatexViewerProps {
  texUrl: string;
}

export default function LatexViewer({ texUrl }: LatexViewerProps) {
  const [content, setContent] = useState<string>("Loading LaTeX...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(texUrl)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch LaTeX file");
        }
        return res.text();
      })
      .then(setContent)
      .catch(() => setError("Unable to load LaTeX source"));
  }, [texUrl]);

  if (error) {
    return (
      <div className="text-red-600 text-sm border border-red-300 p-4 rounded">
        {error}
      </div>
    );
  }

  return (
    <pre className="bg-muted text-sm p-4 rounded-lg overflow-auto max-h-[500px] whitespace-pre-wrap">
      {content}
    </pre>
  );
}
