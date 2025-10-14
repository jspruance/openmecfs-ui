export default function AdvocacyPage() {
  const sections = [
    {
      title: "Pacing & Energy Envelope",
      body: "Learn how to manage your limited energy with pacing strategies. Break tasks into smaller parts, monitor PEM warning signs, and balance physical, cognitive, and emotional exertion.",
      subpoints: [
        "Recognize post-exertional malaise (PEM) early.",
        "Use heart rate or activity tracking to stay within limits.",
        "Prioritize rest and recovery before symptoms worsen.",
      ],
      icon: "⚡",
      color: "from-blue-50 to-blue-100",
    },
    {
      title: "Orthostatic Intolerance",
      body: "Orthostatic intolerance (OI) includes POTS and NMH — common in ME/CFS. Explore conservative and medical options with your clinician to stabilize blood pressure and reduce dizziness.",
      subpoints: [
        "Increase salt and fluid intake (if approved).",
        "Use compression garments to support blood flow.",
        "Discuss medications like fludrocortisone or midodrine with your doctor.",
      ],
      icon: "🩺",
      color: "from-purple-50 to-purple-100",
    },
    {
      title: "Documentation & Letters",
      body: "Accurate documentation helps secure medical accommodations and disability benefits. Coming soon: downloadable templates and examples of clinician support letters.",
      subpoints: [
        "Track symptom patterns over time.",
        "Request medical summaries highlighting functional impact.",
        "Document post-exertional crashes clearly.",
      ],
      icon: "📝",
      color: "from-green-50 to-green-100",
    },
    {
      title: "Work & School Accommodations",
      body: "ME/CFS can make full-time attendance or work unsustainable. Reasonable accommodations can help maintain participation and prevent relapse.",
      subpoints: [
        "Request flexible or remote work arrangements.",
        "Negotiate reduced hours and rest breaks.",
        "Adjust lighting, temperature, and noise levels.",
      ],
      icon: "🏫",
      color: "from-yellow-50 to-yellow-100",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Advocacy & Care</h1>
        <p className="mt-3 text-gray-600 text-lg">
          Practical strategies for pacing, documentation, and daily management —
          empowering patients to collaborate effectively with clinicians.
        </p>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-2 gap-8">
        {sections.map((s) => (
          <div
            key={s.title}
            className={`p-6 rounded-2xl shadow-sm bg-gradient-to-br ${s.color} border border-gray-200 hover:shadow-md transition-shadow duration-300`}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{s.icon}</span>
              <h3 className="font-semibold text-gray-900 text-lg">{s.title}</h3>
            </div>
            <p className="text-gray-700 text-sm mb-3">{s.body}</p>
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
              {s.subpoints.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Footer */}
      <p className="mt-10 text-xs text-center text-gray-500">
        Educational content only — not a substitute for professional medical
        advice. Always consult a qualified clinician.
      </p>
    </div>
  );
}
