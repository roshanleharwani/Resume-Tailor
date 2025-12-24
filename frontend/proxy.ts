// proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export default async function proxy(req: NextRequest) {
  const res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookies) {
          cookies.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl;

  // 🔓 IMPORTANT: allow OAuth callback to complete
  if (pathname.startsWith("/auth")) {
    return res;
  }

  // ✅ Logged-in users visiting "/" → dashboard
  if (session && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // 🚫 Unauthenticated users blocked from dashboard
  if (!session && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return res;
}


export const config = {
  matcher: ["/", "/dashboard/:path*", "/auth/:path*"],
};

