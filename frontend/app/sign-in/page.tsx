"use client"

import { AuthLayout } from "@/components/auth-layout"
import { SignInForm } from "@/components/sign-in-form"

export default function SignInPage() {
  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to your Resume Tailor account">
      <SignInForm />
    </AuthLayout>
  )
}
