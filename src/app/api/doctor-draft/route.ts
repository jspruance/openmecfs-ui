import { NextResponse } from "next/server";
import OpenAI from "openai";

// --- OpenAI Client ---
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// --- Basic In-memory Rate Limiter (3 requests / minute per IP) ---
const requests = new Map<string, { count: number; last: number }>();
const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 3;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = requests.get(ip) || { count: 0, last: now };

  // reset window
  if (now - entry.last > WINDOW_MS) {
    entry.count = 0;
    entry.last = now;
  }

  entry.count++;
  requests.set(ip, entry);

  return entry.count <= MAX_REQUESTS;
}

// --- API Route ---
export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please wait a minute and try again." },
        { status: 429 }
      );
    }

    const {
      patient_input,
      doctor_lastname = "",
      patient_name = "",
    } = await req.json();

    if (!patient_input || typeof patient_input !== "string") {
      return NextResponse.json(
        { error: "patient_input is required" },
        { status: 400 }
      );
    }

    const system =
      "You draft short, professional, clinically neutral messages for patients to send to their doctors. " +
      "Use ONLY the facts provided by the patient; do not invent diagnoses, test results, or citations. " +
      "Tone: respectful, concise, collaborative. Avoid medical advice. " +
      "Output plain text suitable for email/portal. " +
      "Structure: Subject line, greeting (use 'Dr. {LASTNAME}' if provided), 1–3 concise paragraphs, optional bullets, a clear ask, and a polite close.";

    const user = [
      `Patient goal: "${patient_input}"`,
      doctor_lastname ? `Doctor last name: ${doctor_lastname}` : "",
      patient_name ? `Patient name: ${patient_name}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.2,
      max_tokens: 500,
    });

    const text = completion.choices[0]?.message?.content?.trim() || "";
    return NextResponse.json({ body_md: text }, { status: 200 });
  } catch (e) {
    console.error("Error generating doctor message:", e);
    return NextResponse.json({ error: "Generation error" }, { status: 500 });
  }
}
