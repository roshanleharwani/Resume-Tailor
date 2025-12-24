import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const jobId = searchParams.get("job_id");

  if (!jobId) {
    return NextResponse.json({ error: "Missing job_id" }, { status: 400 });
  }

  try {
    const flaskUrl = `${process.env.NEXT_PUBLIC_FLASK_URL}/job-status?job_id=${jobId}`;

    const resp = await fetch(flaskUrl);

    if (!resp.ok) {
      const text = await resp.text();
      return NextResponse.json(
        { error: `Flask error: ${text}` },
        { status: resp.status }
      );
    }

    const data = await resp.json();
    return NextResponse.json(data);

  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Server error" },
      { status: 500 }
    );
  }
}
