"use client";

import {
  Activity,
  HeartPulse,
  Brain,
  Stethoscope,
  Syringe,
  Pill,
  Clock,
} from "lucide-react";

export default function MecfsPage() {
  return (
    <main className="min-h-screen bg-white text-gray-800">
      {/* 🧠 Intro */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-6">
          What is ME/CFS?
        </h1>
        <p className="text-lg text-gray-700 leading-relaxed mb-4">
          <strong>
            Myalgic Encephalomyelitis / Chronic Fatigue Syndrome (ME/CFS)
          </strong>{" "}
          is a complex, multisystem illness that affects the body’s energy
          production, nervous system, immune system, and cardiovascular
          regulation. It is characterized by <strong>profound fatigue</strong>,
          <strong> post-exertional malaise (PEM)</strong>—a worsening of
          symptoms after even minor physical or mental effort—
          <strong>unrefreshing sleep</strong>,{" "}
          <strong>cognitive dysfunction</strong> (“brain fog”), and often{" "}
          <strong>orthostatic intolerance (OI)</strong>, where standing or
          sitting upright worsens symptoms due to blood-flow abnormalities.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed">
          <strong>Open ME/CFS</strong> aims to make ME/CFS research accessible
          and understandable to everyone — from patients and caregivers to
          researchers and clinicians — by organizing and summarizing the latest
          scientific evidence.
        </p>
      </section>

      {/* 🧬 Understanding ME/CFS */}
      <section className="bg-gray-50 border-y border-gray-100 py-20">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Brain className="text-blue-600" /> Understanding ME/CFS
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              ME/CFS is recognized by the U.S. National Academy of Medicine
              (NAM, formerly IOM) as a serious, chronic, systemic disease — not
              psychological or “just tiredness.” The illness may develop after
              an infection, environmental exposure, or occur spontaneously, and
              can cause severe limitations in daily functioning — sometimes
              leaving patients bed- or home-bound.
            </p>
            <p className="text-gray-700 text-lg mt-3 leading-relaxed">
              Biomedical research points toward abnormalities in energy
              metabolism, immune signaling, autonomic nervous system regulation,
              and blood-flow dynamics. Studies have identified changes in
              cytokines, mitochondrial function, and cerebral blood flow that
              may explain hallmark symptoms such as PEM and OI.
            </p>
          </div>

          <div className="flex justify-center">
            <div className="bg-white p-6 rounded-2xl shadow-md max-w-md text-center border border-gray-100">
              <Activity className="mx-auto mb-3 text-blue-600" size={48} />
              <p className="text-gray-600 italic">
                “A profound loss of energy production and recovery capacity —
                the body no longer responds normally to stress or exertion.”
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ⚡ Symptoms */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 flex items-center gap-2">
            <HeartPulse className="text-blue-600" /> Common Symptoms
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Clock className="text-blue-600" size={32} />,
                title: "Post-Exertional Malaise (PEM)",
                desc: "Worsening of all symptoms after minimal effort — often delayed by 24-48 hours.",
              },
              {
                icon: <Brain className="text-blue-600" size={32} />,
                title: "Cognitive Dysfunction",
                desc: "Difficulty concentrating, short-term memory problems, and slowed processing.",
              },
              {
                icon: <Stethoscope className="text-blue-600" size={32} />,
                title: "Orthostatic Intolerance (OI)",
                desc: "Lightheadedness, palpitations, or fainting when upright due to blood-flow issues.",
              },
              {
                icon: <Activity className="text-blue-600" size={32} />,
                title: "Unrefreshing Sleep",
                desc: "Sleep that does not restore energy or relieve fatigue.",
              },
              {
                icon: <HeartPulse className="text-blue-600" size={32} />,
                title: "Widespread Pain or Sensitivity",
                desc: "Muscle, joint, and nerve pain that often fluctuates with exertion or stress.",
              },
              {
                icon: <Pill className="text-blue-600" size={32} />,
                title: "Other Symptoms",
                desc: "Headaches, sore throat, lymph node tenderness, gut issues, temperature dysregulation, and sensory overload.",
              },
            ].map((s, i) => (
              <div
                key={i}
                className="bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition"
              >
                <div className="mb-3">{s.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {s.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🧾 Diagnosis */}
      <section className="bg-gray-50 py-20 border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Stethoscope className="text-blue-600" /> Diagnosis
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            There is no single laboratory test for ME/CFS. Diagnosis is clinical
            and based on characteristic symptom patterns and exclusion of other
            conditions.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            The <em>Institute of Medicine (IOM, 2015)</em> criteria — now widely
            used — require:
          </p>
          <ul className="list-disc list-inside mt-4 text-gray-700 leading-relaxed space-y-1">
            <li>
              Substantial reduction in activity levels for more than 6 months
              due to fatigue.
            </li>
            <li>Post-Exertional Malaise (PEM).</li>
            <li>Unrefreshing sleep.</li>
            <li>
              At least one of: cognitive impairment or orthostatic intolerance
              (OI).
            </li>
          </ul>
          <p className="mt-4 text-gray-700 leading-relaxed">
            Diagnosis typically includes a detailed history, physical exam, and
            targeted testing to rule out endocrine, autoimmune, and infectious
            diseases.
          </p>
        </div>
      </section>

      {/* 💊 Treatments */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-2">
            <Syringe className="text-blue-600" /> Current Approaches &
            Treatments
          </h2>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            While there is no FDA-approved cure for ME/CFS yet, a range of
            approaches help manage symptoms and improve quality of life.
            Treatment is individualized and focuses on pacing, sleep, pain
            control, and supporting autonomic and metabolic function.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Pacing & Energy Management",
                desc: "Staying within your ‘energy envelope’ to prevent post-exertional crashes (PEM).",
              },
              {
                title: "Sleep Optimization",
                desc: "Sleep hygiene, melatonin, or low-dose medications to improve restorative sleep.",
              },
              {
                title: "Low-Dose Naltrexone (LDN)",
                desc: "An immune-modulating therapy that may reduce inflammation and pain.",
              },
              {
                title: "Orthostatic Intolerance (OI) Treatments",
                desc: "Fludrocortisone, midodrine, beta blockers, increased salt and fluids, compression wear.",
              },
              {
                title: "Nutritional Support",
                desc: "Vitamin D, B12, CoQ10, magnesium, and antioxidants may support mitochondrial health.",
              },
              {
                title: "Emerging Therapies",
                desc: "Research is exploring immunotherapies, metabolic modulators, and antivirals for post-infectious cases.",
              },
            ].map((t, i) => (
              <div
                key={i}
                className="bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {t.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🌍 Call to Action */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 text-white py-24 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Join the Movement Toward Understanding and a Cure
        </h2>
        <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
          Support open research, patient-centered science, and collaboration for
          ME/CFS.
        </p>
        <a
          href="/donate"
          className="inline-block bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-400 text-blue-900 px-8 py-3 rounded-md font-semibold shadow-[0_0_20px_rgba(255,200,100,0.6)] hover:shadow-[0_0_40px_rgba(255,200,100,0.8)] hover:scale-[1.05] transition-all duration-300 ease-out"
        >
          Donate to Support Research
        </a>
      </section>
    </main>
  );
}
