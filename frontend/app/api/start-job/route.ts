import { NextResponse } from "next/server";

const FLASK_BASE = process.env.FLASK_BASE || "http://localhost:5000";

export async function POST(req: Request) {
  try {
    const { pdf_url, text } = await req.json();

    if (!pdf_url || text === undefined) {
      return NextResponse.json(
        { error: "pdf_url and text are required" },
        { status: 400 }
      );
    }

    const resp = await fetch(`${FLASK_BASE}/start-job`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pdf_url, text }),
    });

    const data = await resp.json();
    return NextResponse.json(data, { status: resp.status });
  } catch (err) {
    console.error("Error contacting Flask:", err);
    return NextResponse.json(
        { error: "Internal proxy error" },
        { status: 500 }
    );
  }
}
