// app/patients/doctors/admin/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";

/* Types */
type Clinic = {
  id: string;
  slug: string;
  name: string;
  country: string;
  state?: string | null;
  city?: string | null;
  postal_code?: string | null;
  address_line1?: string | null;
  address_line2?: string | null;
  website?: string | null;
  booking_url?: string | null;
  email?: string | null;
  phone?: string | null;
  tags?: string[];
  autonomic_focused?: boolean | null;
  notes?: string | null;
  featured?: boolean | null;
  featured_rank?: number | null;
};

type FormState = {
  name: string;
  country: string;
  state: string;
  city: string;
  postal_code: string;
  address_line1: string;
  address_line2: string;
  website: string;
  booking_url: string;
  email: string;
  phone: string;
  tags: string; // comma list in UI
  autonomic_focused: boolean;
  notes: string;
  featured: boolean; // ⭐
  featured_rank: string; // 👈 UI stores as string; convert on submit
};

export default function AdminClinicsPage() {
  const [adminPass, setAdminPass] = useState("");

  const emptyForm: FormState = {
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
    tags: "",
    autonomic_focused: false,
    notes: "",
    featured: false,
    featured_rank: "", // 👈 default blank (null on save)
  };
  const [form, setForm] = useState<FormState>(emptyForm);

  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [filter, setFilter] = useState("");
  const [originalSlug, setOriginalSlug] = useState<string | null>(null);

  // Load full list for quick-pick
  async function refreshList() {
    try {
      const res = await fetch("/api/clinics?admin=1", { cache: "no-store" });
      const data = await res.json();
      if (data?.ok) setClinics(data.clinics || []);
    } catch (e) {
      console.error("Failed to load clinics", e);
    }
  }
  useEffect(() => {
    refreshList();
  }, []);

  const visible = useMemo(() => {
    const n = filter.trim().toLowerCase();
    if (!n) return clinics;
    return clinics.filter((c) =>
      [c.name, c.city ?? "", c.state ?? "", c.country]
        .join(" ")
        .toLowerCase()
        .includes(n)
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
      featured: !!c.featured,
      featured_rank:
        c.featured_rank !== null && c.featured_rank !== undefined
          ? String(c.featured_rank)
          : "", // show blank if null
    });
    setMsg(null);
    setErr(null);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setErr(null);
    setLoading(true);
    try {
      const rank =
        form.featured_rank === "" || form.featured_rank === undefined
          ? null
          : Number(form.featured_rank);

      const payload = {
        adminPass,
        ...form,
        featured_rank: rank, // 👈 converted number|null
        // turn comma list into array (route also normalizes)
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        originalSlug,
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
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Unexpected error.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!originalSlug) return;
    if (!adminPass) {
      setErr("Enter the admin password first.");
      return;
    }
    if (!window.confirm("Delete this clinic permanently?")) return;

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
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Unexpected error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <section className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold">Clinics — Admin Upsert</h1>
        <p className="text-sm text-gray-600 mt-1">
          Create or update a clinic (unique on <code>slug</code>).
        </p>

        {originalSlug && (
          <div className="mt-3 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-800">
            Editing: <code className="font-mono">{originalSlug}</code>
          </div>
        )}

        <div className="mt-6 grid lg:grid-cols-3 gap-6">
          {/* Left: form */}
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

              {/* Toggles */}
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

              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) =>
                      setForm({ ...form, featured: e.target.checked })
                    }
                  />
                  ⭐ Featured
                </label>

                {/* Featured rank input */}
                <input
                  type="number"
                  min={1}
                  placeholder="Featured rank (1 = top)"
                  className="rounded-md border border-gray-200 px-3 py-2 w-48"
                  value={form.featured_rank}
                  onChange={(e) =>
                    setForm({ ...form, featured_rank: e.target.value })
                  }
                />
              </div>

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
                        <div className="font-medium flex items-center gap-2">
                          {c.name}
                          {c.featured ? (
                            <span title="Featured" className="text-yellow-500">
                              ★
                            </span>
                          ) : null}
                          {c.featured && c.featured_rank != null && (
                            <span className="text-xs text-gray-500">
                              (#{c.featured_rank})
                            </span>
                          )}
                        </div>
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
