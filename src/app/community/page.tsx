import Image from "next/image";

export const metadata = {
  title: "Community & Connection — Open ME/CFS",
  description:
    "Information about community connection options for people living with ME/CFS.",
};

export default function CommunityPage() {
  return (
    <main className="min-h-screen bg-white text-gray-800">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Community & Connection
        </h1>

        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
          <p>
            Living with ME/CFS and related chronic illnesses can be deeply
            isolating, even when you are informed and supported medically.
          </p>

          <p>
            Some people are looking for quiet, low-pressure ways to connect with
            others who understand their experience — whether for conversation,
            friendship, companionship, or dating — at a pace that respects
            limited energy and bad days.
          </p>

          <p>
            OpenME/CFS focuses on research, education, and evidence-based
            information. We do not host community or social features directly.
          </p>
        </div>

        {/* Subtle section break */}
        <div className="my-12 border-t border-gray-200"></div>

        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
          <p>
            However, we are aware of a small, separate community space that was
            created specifically to support gentle, consent-based connection for
            people living with chronic illness.
          </p>
        </div>

        {/* MellowMatch Section */}
        <div className="mt-12 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">
            About MellowMatch
          </h2>

          {/* MellowMatch Image */}
          <div className="my-6">
            <Image
              src="/mellowmatch.png"
              alt="MellowMatch"
              width={800}
              height={400}
              className="w-full max-w-2xl mx-auto rounded-lg shadow-sm"
            />
          </div>

          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
            <p>
              MellowMatch is an early-stage, completely free connection space
              created by someone living with ME/CFS. It is intentionally designed
              to be slow, calm, and respectful of fluctuating energy levels.
            </p>

            <p>
              Some people use it to find understanding friends, some for
              companionship, and some for dating. Participation is always
              optional, and there is no pressure to engage.
            </p>
          </div>

          {/* CTA Button */}
          <div className="mt-8">
            <a
              href="https://www.mellowmatch.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#007BFF] text-white px-6 py-3 rounded-md font-medium hover:bg-[#0D47A1] transition-colors"
            >
              Learn more about MellowMatch
            </a>
          </div>

          {/* Footer note */}
          <p className="text-sm text-gray-500 mt-8">
            MellowMatch is an independent project and is not operated by
            OpenME/CFS.
          </p>
        </div>
      </div>
    </main>
  );
}

