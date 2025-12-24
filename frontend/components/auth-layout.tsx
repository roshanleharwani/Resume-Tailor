"use client"

import type React from "react"

import { motion } from "framer-motion"

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Brand Illustration */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex lg:w-1/2 bg-primary text-primary-foreground flex-col justify-center items-center p-12"
      >
        <div className="max-w-md text-center space-y-8">
          <div className="text-6xl font-bold">Resume Tailor</div>
          <p className="text-xl text-primary-foreground/90">
            AI-powered resume optimization for landing your dream job.
          </p>
          <div className="space-y-4 pt-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-primary font-bold">
                ✓
              </div>
              <span>Instant tailoring</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-primary font-bold">
                ✓
              </div>
              <span>Version control</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-primary font-bold">
                ✓
              </div>
              <span>AI-powered insights</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Side - Form */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-background"
      >
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-primary">{title}</h1>
            <p className="text-muted-foreground text-lg">{subtitle}</p>
          </div>

          {children}
        </div>
      </motion.div>
    </div>
  )
}
