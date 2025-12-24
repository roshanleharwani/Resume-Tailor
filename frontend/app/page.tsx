"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-bold text-primary">
            Resume Tailor
          </motion.div>
          <div className="flex gap-4">
            <Link href="/sign-in">
              <Button variant="ghost" className="text-primary hover:bg-secondary/10">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="text-center space-y-8">
          <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold text-primary leading-tight">
            Tailor Your Resume
            <br />
            <span className="text-secondary">For Any Job Instantly</span>
          </motion.h1>

          <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Upload your resume, paste the job description, and get a perfectly tailored version powered by AI in
            seconds.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex gap-4 justify-center pt-4">
            <Link href="/sign-up">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground text-lg px-8">
                Get Started
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 border-primary text-primary hover:bg-primary/10 bg-transparent"
              >
                Sign In
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 border-t border-border">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-center text-primary mb-16"
        >
          Why Resume Tailor?
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "AI-Powered",
              description: "Advanced AI analyzes your resume and the job description to create a perfect match.",
              icon: "⚡",
            },
            {
              title: "Lightning Fast",
              description: "Get your tailored resume in seconds, not hours. Save time and apply to more jobs.",
              icon: "🚀",
            },
            {
              title: "Version Control",
              description: "Save multiple tailored versions and compare them. Never lose a good iteration.",
              icon: "📚",
            },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="p-8 rounded-2xl bg-card border border-border hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-primary mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 border-t border-border">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-center text-primary mb-16"
        >
          What Users Say
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              name: "Sarah Chen",
              role: "Product Manager",
              quote: "Resume Tailor helped me get interviews at 5 major tech companies. Game changer!",
            },
            {
              name: "Marcus Johnson",
              role: "Software Engineer",
              quote: "The AI caught keywords I would have missed. Applied to 20 jobs and got 6 interviews.",
            },
          ].map((testimonial, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: idx === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="p-8 rounded-2xl bg-card border border-border"
            >
              <p className="text-lg text-foreground mb-4 italic">{testimonial.quote}</p>
              <p className="font-bold text-primary">{testimonial.name}</p>
              <p className="text-sm text-muted-foreground">{testimonial.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 border-t border-border text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-primary">Ready to Land Your Dream Job?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of job seekers using Resume Tailor to get more interviews.
          </p>
          <Link href="/sign-up">
            <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground text-lg px-8">
              Start Tailoring Now
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-primary text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-primary-foreground/80">&copy; 2025 Resume Tailor. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
