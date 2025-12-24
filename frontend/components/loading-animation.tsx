"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const messages = [
  "Analyzing your career story",
  "Understanding your strengths",
  "Mapping experience to opportunities",
  "Optimizing for recruiter clarity",
  "Finalizing your tailored result",
];

export function LoadingAnimation() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [dots, setDots] = useState("");

  useEffect(() => {
    const msgInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 3200);

    const dotInterval = setInterval(() => {
      setDots((d) => (d.length < 3 ? d + "." : ""));
    }, 500);

    return () => {
      clearInterval(msgInterval);
      clearInterval(dotInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 relative overflow-hidden">
      {/* Subtle grain texture */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04] bg-[url('/noise.png')]" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center space-y-8 max-w-md"
      >
        {/* Loader Video */}
        <motion.video
          src="/loader.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-64 mx-auto rounded-2xl shadow-lg"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Main Message */}
        <div className="min-h-[3rem] flex items-center justify-center">
          <motion.p
            key={messageIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="text-2xl font-semibold text-gray-900"
          >
            {messages[messageIndex]}
            <span className="inline-block w-6 text-left">{dots}</span>
          </motion.p>
        </div>

        {/* Sub text */}
        <p className="text-sm text-gray-500 max-w-sm mx-auto">
          Please hold on while we carefully prepare everything for you.
        </p>
      </motion.div>
    </div>
  );
}
