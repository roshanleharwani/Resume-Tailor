"use client"

import { AuthLayout } from "@/components/auth-layout"
import { SignUpForm } from "@/components/sign-up-form"

export default function SignUpPage() {
  return (
    <AuthLayout title="Get Started" subtitle="Create your Resume Tailor account">
      <SignUpForm />
    </AuthLayout>
  )
}
