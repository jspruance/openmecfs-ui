// src/app/patients/doctors/_components/ClinicCard.tsx
"use client";
import React from "react";

export type ClinicType = {
  id: string;
  slug?: string | null;
  name: string;
  country: string;
  state?: string | null;
  city?: string | null;
  postal_code?: string | null;

  website?: string | null;
  booking_url?: string | null;
  email?: string | null;
  phone?: string | null;

  address_line1?: string | null;
  address_line2?: string | null;

  tags?: string[]; // array in DB
  autonomic_focused?: boolean | null;
  notes?: string | null;

  featured?: boolean | null;
};

export default function ClinicCard({ c }: { c: ClinicType }) {
  const auto =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (c as any).autonomicFocused /* legacy */ ?? c.autonomic_focused ?? false;

  const tags = c.tags ?? [];

  const addrLines = [
    c.address_line1,
    c.address_line2,
    [c.city, c.state, c.postal_code].filter(Boolean).join(", "),
    c.country,
  ].filter(Boolean) as string[];

  const mapsQuery = encodeURIComponent(
    [
      c.address_line1,
      c.address_line2,
      c.city,
      c.state,
      c.postal_code,
      c.country,
    ]
      .filter(Boolean)
      .join(" ")
  );

  return (
    <div className="h-full flex flex-col justify-between rounded-2xl border border-gray-200 p-6 hover:shadow-md transition">
      <div className="min-w-0">
        <h3 className="text-lg font-semibold text-gray-900 break-normal hyphens-auto">
          {c.name}
        </h3>
        <p className="text-gray-600">
          {c.city ? `${c.city}, ` : ""}
          {c.state ? `${c.state}, ` : ""}
          {c.country}
        </p>
      </div>

      {/* Tags */}
      {(tags.length > 0 || auto) && (
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map((t) => (
            <span
              key={t}
              className="inline-flex items-center rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs text-gray-700"
            >
              {t}
            </span>
          ))}
          {auto && (
            <span className="inline-flex items-center rounded-full bg-pink-50 text-pink-700 border border-pink-200 px-2.5 py-1 text-xs">
              OI/Autonomic
            </span>
          )}
        </div>
      )}

      {/* Notes */}
      {c.notes && <p className="mt-2 text-sm text-gray-700">{c.notes}</p>}

      {/* Actions */}
      {(c.website || c.booking_url || c.email || c.phone) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {c.website && (
            <a
              href={c.website}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer inline-flex items-center rounded-md border border-gray-200 px-3 py-1.5 text-sm text-blue-700 hover:bg-blue-50"
            >
              Visit site ↗
            </a>
          )}
          {c.booking_url && (
            <a
              href={c.booking_url}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer inline-flex items-center rounded-md border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50"
            >
              Book appointment
            </a>
          )}
          {c.email && (
            <a
              href={`mailto:${c.email}`}
              className="cursor-pointer inline-flex items-center rounded-md border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50 break-all"
            >
              {c.email}
            </a>
          )}
          {c.phone && (
            <a
              href={`tel:${c.phone}`}
              className="cursor-pointer inline-flex items-center rounded-md border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50"
            >
              {c.phone}
            </a>
          )}
        </div>
      )}

      {/* Address panel */}
      {addrLines.length > 0 && (
        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4">
          <div className="text-xs font-semibold tracking-wide text-gray-500">
            ADDRESS
          </div>
          <address className="not-italic mt-1 text-sm text-gray-800">
            {addrLines.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </address>
          <div className="mt-2">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer text-blue-700 text-sm hover:underline"
            >
              View on Maps ↗
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
