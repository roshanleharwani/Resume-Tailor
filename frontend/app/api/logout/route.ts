import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST(req: Request) {
  // Prepare a response object that we can attach cookies to
  const res = NextResponse.redirect(new URL("/", req.url));

  // Initialize Supabase Server Client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          // get cookies from the request
          const cookieHeader = req.headers.get("cookie") ?? "";
          const cookies = cookieHeader
            .split(";")
            .map((c) => c.trim())
            .filter(Boolean)
            .map((pair) => {
              const [name, ...rest] = pair.split("=");
              return { name, value: rest.join("=") };
            });
          return cookies;
        },
        setAll(cookies) {
          // re-set cookies to response (so deletion persists)
          cookies.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // ✅ Sign out server-side (this removes refresh token etc.)
  await supabase.auth.signOut();

  // ✅ Manually delete all Supabase cookies
  const cookieNames = [
    "sb-access-token",
    "sb-refresh-token",
    // optional fallback for multiple tokens in some projects:
    "sb-" + process.env.NEXT_PUBLIC_SUPABASE_URL?.split(".")[0]?.split("//")[1] + "-auth-token",
  ];

  cookieNames.forEach((name) => res.cookies.delete(name));

  // Redirect back to home
  return res;
}
