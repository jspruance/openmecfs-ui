export const metadata = {
  title: "Donate — Open ME/CFS",
  description:
    "Support Open ME/CFS and help advance public access to ME/CFS research.",
};

export default function DonatePage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16 text-gray-800 text-center">
      <h1 className="text-3xl font-bold mb-4 text-gray-900">
        Support Open ME/CFS
      </h1>
      <p className="mb-6 text-lg leading-relaxed">
        Your donation helps us maintain the Open ME/CFS platform and continue
        developing tools that make ME/CFS research more accessible and
        understandable for everyone.
      </p>

      <div className="mt-8">
        <a
          href="https://www.paypal.com/donate"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold shadow-md hover:bg-blue-700 hover:shadow-lg transition"
        >
          Donate via PayPal
        </a>
      </div>

      <p className="mt-6 text-sm text-gray-500">
        All contributions go toward hosting, development, and ME/CFS research
        initiatives.
      </p>
    </main>
  );
}
