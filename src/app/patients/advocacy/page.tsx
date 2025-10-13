export default function AdvocacyPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Advocacy & Care</h1>
      <p className="mt-2 text-gray-700">
        Practical strategies for pacing, medical documentation, accommodations,
        and working with clinicians.
      </p>

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        {[
          {
            title: "Pacing & Energy Envelope",
            body: "Track triggers, break tasks, avoid PEM with flexible thresholds.",
          },
          {
            title: "Orthostatic Intolerance",
            body: "Salt/fluids, compression, and medical therapies to discuss with your clinician.",
          },
          {
            title: "Documentation & Letters",
            body: "Key phrases for disability forms and clinician letters (coming soon).",
          },
          {
            title: "Work & School Accommodations",
            body: "Remote options, reduced load, rest breaks, lighting/noise adjustments.",
          },
        ].map((c) => (
          <div key={c.title} className="rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900">{c.title}</h3>
            <p className="mt-1 text-gray-700 text-sm">{c.body}</p>
          </div>
        ))}
      </div>

      <p className="mt-6 text-xs text-gray-500">
        Educational content only; consult a qualified clinician.
      </p>
    </div>
  );
}
