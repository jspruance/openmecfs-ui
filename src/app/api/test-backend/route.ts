// src/app/api/test-backend/route.ts
import { NextResponse } from "next/server";
import axios, { AxiosError } from "axios";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://openmecfs-platform-production.up.railway.app";

export async function GET(): Promise<NextResponse> {
  try {
    const { data } = await axios.get(`${API_BASE}/health`);
    return NextResponse.json({
      ok: true,
      backend: data,
      backend_url: API_BASE,
    });
  } catch (err) {
    const error = err as AxiosError;

    return NextResponse.json(
      {
        ok: false,
        error: error.message || "Unknown error",
        backend_url: API_BASE,
      },
      { status: 500 }
    );
  }
}
