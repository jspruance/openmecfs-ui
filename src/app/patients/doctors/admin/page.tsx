"use client";

import { useEffect, useMemo, useState } from "react";

type Clinic = {
  id: string;
  slug: string;
  name: string;
  country: string;
  state?: string;
  city?: string;
  postal_code?: string;
  address_line1?: string;
  address_line2?: string;
  website?: string;
  booking_url?: string;
  email?: string;
  phone?: string;
  tags?: string[]; // stored as array in DB
  autonomic_focused?: boolean;
  notes?: string;
};

export default function AdminClinicsPage() {
  const [adminPass, setAdminPass] = useState("");
  const emptyForm = {
    name: "",
    country: "USA",
    state: "",
    city: "",
    postal_code: "",
    address_line1: "",
    address_line2: "",
    website: "",
    booking_url: "",
    email: "",
    phone: "",
    tags: "", // comma list in UI
    autonomic_focused: false,
    notes: "",
  };
  const [form, setForm] = useState(emptyForm);

  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // NEW: list + selection state
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [filter, setFilter] = useState("");
  const [originalSlug, setOriginalSlug] = useState<string | null>(null); // identifies “edit” mode

  // Load clinics for quick-pick (admin sees full set)
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/clinics?admin=1", { cache: "no-store" });
        const data = await res.json();
        if (data?.ok) setClinics(data.clinics || []);
      } catch (e) {
        console.error("Failed to load clinics", e);
      }
    })();
  }, []);

  const visible = useMemo(() => {
    const n = filter.trim().toLowerCase();
    if (!n) return clinics;
    return clinics.filter((c) =>
      [c.name, c.city, c.state, c.country].join(" ").toLowerCase().includes(n)
    );
  }, [clinics, filter]);

  function startNew() {
    setForm(emptyForm);
    setOriginalSlug(null);
    setMsg(null);
    setErr(null);
  }

  function loadClinic(c: Clinic) {
    setOriginalSlug(c.slug || null);
    setForm({
      name: c.name || "",
      country: c.country || "USA",
      state: c.state || "",
      city: c.city || "",
      postal_code: c.postal_code || "",
      address_line1: c.address_line1 || "",
      address_line2: c.address_line2 || "",
      website: c.website || "",
      booking_url: c.booking_url || "",
      email: c.email || "",
      phone: c.phone || "",
      tags: (c.tags || []).join(", "),
      autonomic_focused: !!c.autonomic_focused,
      notes: c.notes || "",
    });
    setMsg(null);
    setErr(null);
  }

  async function refreshList() {
    try {
      const res = await fetch("/api/clinics?admin=1", { cache: "no-store" });
      const data = await res.json();
      if (data?.ok) setClinics(data.clinics || []);
    } catch {}
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setErr(null);
    setLoading(true);
    try {
      const payload = {
        adminPass,
        ...form,
        // Ensure array on server
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        // For edits, you can optionally send the existing slug so your API can keep it stable
        originalSlug, // your POST handler can ignore or use as needed
      };

      const res = await fetch("/api/clinics/admin-upsert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.error || "Failed");

      setMsg(`Saved: ${data.clinic?.name || "clinic"}`);
      setOriginalSlug(data.clinic?.slug ?? originalSlug ?? null);
      await refreshList();
    } catch (e: any) {
      setErr(e?.message || "Unexpected error.");
    } finally {
      setLoading(false);
    }
  }

  // NEW: Delete handler
  async function handleDelete() {
    if (!originalSlug) return;
    if (!adminPass) {
      setErr("Enter the admin password first.");
      return;
    }
    const ok = window.confirm("Delete this clinic permanently?");
    if (!ok) return;

    setLoading(true);
    setMsg(null);
    setErr(null);
    try {
      const res = await fetch("/api/clinics/admin-upsert", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminPass, slug: originalSlug }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.error || "Delete failed");

      await refreshList();
      startNew();
      setMsg("Clinic deleted.");
    } catch (e: any) {
      setErr(e?.message || "Unexpected error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <section className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold">Clinics — Admin Upsert</h1>
        <p className="text-sm text-gray-600 mt-1">
          Paste or type details; this will create or update a clinic (unique on{" "}
          <code>slug</code>).
        </p>

        <div className="mt-6 grid lg:grid-cols-3 gap-6">
          {/* Left: form (2 cols) */}
          <form onSubmit={submit} className="lg:col-span-2 space-y-4">
            <div>
              <label className="block text-sm font-medium">
                Admin password
              </label>
              <input
                type="password"
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                className="w-full rounded-md border border-gray-200 px-3 py-2"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <input
                placeholder="Name *"
                className="rounded-md border border-gray-200 px-3 py-2 md:col-span-2"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <input
                placeholder="Country *"
                className="rounded-md border border-gray-200 px-3 py-2"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                required
              />
              <input
                placeholder="State/Region"
                className="rounded-md border border-gray-200 px-3 py-2"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
              />
              <input
                placeholder="City"
                className="rounded-md border border-gray-200 px-3 py-2"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
              <input
                placeholder="Postal code"
                className="rounded-md border border-gray-200 px-3 py-2"
                value={form.postal_code}
                onChange={(e) =>
                  setForm({ ...form, postal_code: e.target.value })
                }
              />
              <input
                placeholder="Address line 1"
                className="rounded-md border border-gray-200 px-3 py-2 md:col-span-2"
                value={form.address_line1}
                onChange={(e) =>
                  setForm({ ...form, address_line1: e.target.value })
                }
              />
              <input
                placeholder="Address line 2"
                className="rounded-md border border-gray-200 px-3 py-2 md:col-span-2"
                value={form.address_line2}
                onChange={(e) =>
                  setForm({ ...form, address_line2: e.target.value })
                }
              />
              <input
                placeholder="Website"
                className="rounded-md border border-gray-200 px-3 py-2"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
              />
              <input
                placeholder="Booking URL"
                className="rounded-md border border-gray-200 px-3 py-2"
                value={form.booking_url}
                onChange={(e) =>
                  setForm({ ...form, booking_url: e.target.value })
                }
              />
              <input
                placeholder="Email"
                className="rounded-md border border-gray-200 px-3 py-2"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <input
                placeholder="Phone"
                className="rounded-md border border-gray-200 px-3 py-2"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <input
                placeholder="Tags (comma separated, e.g. ME/CFS, OI/POTS)"
                className="rounded-md border border-gray-200 px-3 py-2 md:col-span-2"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
              />
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.autonomic_focused}
                  onChange={(e) =>
                    setForm({ ...form, autonomic_focused: e.target.checked })
                  }
                />
                OI/Autonomic focused
              </label>
              <textarea
                placeholder="Notes"
                className="rounded-md border border-gray-200 px-3 py-2 md:col-span-2 min-h-[90px]"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>

            {msg && <p className="text-green-700 text-sm">{msg}</p>}
            {err && <p className="text-red-600 text-sm">{err}</p>}

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={loading}
                className="cursor-pointer inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {loading
                  ? "Saving…"
                  : originalSlug
                  ? "Save changes"
                  : "Save clinic"}
              </button>

              {originalSlug && (
                <button
                  type="button"
                  onClick={startNew}
                  className="cursor-pointer inline-flex items-center rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50"
                >
                  New clinic
                </button>
              )}

              {originalSlug && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={loading}
                  className="cursor-pointer inline-flex items-center rounded-md border border-red-300 text-red-700 px-4 py-2 hover:bg-red-50 disabled:opacity-60 ml-auto"
                >
                  Delete
                </button>
              )}
            </div>
          </form>

          {/* Right: quick-pick list */}
          <aside className="lg:col-span-1">
            <div className="rounded-xl border border-gray-200">
              <div className="p-3 border-b border-gray-200">
                <input
                  placeholder="Search clinics…"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full rounded-md border border-gray-200 px-3 py-2"
                />
              </div>
              <ul className="max-h-[520px] overflow-auto divide-y">
                {visible.map((c) => {
                  const selected = originalSlug === c.slug;
                  return (
                    <li key={c.id}>
                      <button
                        type="button"
                        onClick={() => loadClinic(c)}
                        className={
                          "w-full text-left px-3 py-2 cursor-pointer hover:bg-gray-50 " +
                          (selected ? "bg-blue-50" : "")
                        }
                      >
                        <div className="font-medium">{c.name}</div>
                        <div className="text-xs text-gray-600">
                          {[c.city, c.state, c.country]
                            .filter(Boolean)
                            .join(", ")}
                        </div>
                      </button>
                    </li>
                  );
                })}
                {visible.length === 0 && (
                  <li className="px-3 py-6 text-sm text-gray-500">
                    No matches.
                  </li>
                )}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
