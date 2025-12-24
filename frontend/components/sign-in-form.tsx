"use client";

import type React from "react";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "react-hot-toast";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Sign in with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Redirect to dashboard on success
      window.location.href = "/dashboard";
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      // On success the browser will redirect to Google's consent screen
      // and ultimately back to the dashboard. No further action needed here.
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in with Google");
      setGoogleLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Email Field */}
      <div className="space-y-2">
        <Label
          htmlFor="email"
          className="text-base font-medium text-foreground"
        >
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-12 rounded-xl border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-secondary"
          required
        />
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Label
          htmlFor="password"
          className="text-base font-medium text-foreground"
        >
          Password
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-12 rounded-xl border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-secondary"
          required
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full h-12 bg-secondary cursor-pointer hover:bg-secondary/90 text-secondary-foreground font-semibold rounded-xl transition-all duration-300"
      >
        {loading ? "Signing in..." : "Sign In"}
      </Button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-background text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="flex items-center justify-center  bg-tr">
        <button
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
          className="flex items-center bg-white dark:bg-gray-900 border cursor-pointer border-gray-300 rounded-lg shadow-md px-6 py-2 text-sm font-medium text-gray-800 dark:text-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          <svg
            className="h-6 w-6 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            width="800px"
            height="800px"
            viewBox="-0.5 0 48 48"
            version="1.1"
          >
            {" "}
            <title>Google-color</title> <desc>Created with Sketch.</desc>{" "}
            <defs> </defs>{" "}
            <g
              id="Icons"
              stroke="none"
              stroke-width="1"
              fill="none"
              fill-rule="evenodd"
            >
              {" "}
              <g id="Color-" transform="translate(-401.000000, -860.000000)">
                {" "}
                <g id="Google" transform="translate(401.000000, 860.000000)">
                  {" "}
                  <path
                    d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24"
                    id="Fill-1"
                    fill="#FBBC05"
                  >
                    {" "}
                  </path>{" "}
                  <path
                    d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333"
                    id="Fill-2"
                    fill="#EB4335"
                  >
                    {" "}
                  </path>{" "}
                  <path
                    d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667"
                    id="Fill-3"
                    fill="#34A853"
                  >
                    {" "}
                  </path>{" "}
                  <path
                    d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24"
                    id="Fill-4"
                    fill="#4285F4"
                  >
                    {" "}
                  </path>{" "}
                </g>{" "}
              </g>{" "}
            </g>{" "}
          </svg>
          <span>
            {googleLoading ? "Connecting..." : "Continue with Google"}
          </span>
        </button>
      </div>

      {/* Sign Up Link */}
      <p className="text-center text-muted-foreground">
        Don't have an account?{" "}
        <Link
          href="/sign-up"
          className="text-secondary font-semibold hover:underline"
        >
          Sign up
        </Link>
      </p>
    </motion.form>
  );
}
