import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const AdminSchema = z.object({
  password: z.string().min(8),
  name: z.string().min(2),
  country: z.string().min(2),
  state: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  website: z.string().url().optional(),
  phone: z.string().optional(),
  tags: z.array(z.string()).optional(),
  autonomic_focused: z.boolean().optional(),
  telemedicine: z.boolean().optional(),
  notes: z.string().optional(),
  verified: z.boolean().optional(),
  source: z.string().optional(),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = AdminSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const data = parsed.data;

  if (data.password !== process.env.OPENMECFS_ADMIN_PASSWORD) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { password, ...toInsert } = data;

  const { data: created, error } = await supabaseAdmin
    .from("clinics")
    .insert([toInsert])
    .select()
    .single();

  if (error) {
    console.error("create clinic error", error);
    return NextResponse.json(
      { ok: false, error: "Insert failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, clinic: created });
}
