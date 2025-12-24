"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        // Check if user already exists in the users table
        const { data: existingUser } = await supabase
          .from("users")
          .select("id")
          .eq("id", session.user.id)
          .single();

        if (!existingUser) {
          // Create new user record
          const { error: dbError } = await supabase.from("users").insert([
            {
              id: session.user.id,
              name:
                session.user.user_metadata.full_name ||
                session.user.user_metadata.name,
              email: session.user.email,
            },
          ]);

          if (dbError) {
            console.error("Error creating user record:", dbError);
          }
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return children;
}
