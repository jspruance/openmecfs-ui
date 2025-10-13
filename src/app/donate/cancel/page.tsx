import Link from "next/link";

export default function Cancel() {
  return (
    <main className="min-h-[60vh] flex items-center justify-center">
      <div className="max-w-xl mx-auto px-6 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Donation canceled</h1>
        <p className="mt-3 text-gray-600">
          No charge was made. You can try again anytime.
        </p>
        <Link
          href="/donate"
          className="inline-block mt-6 text-blue-600 hover:underline"
        >
          Go back to Donate
        </Link>
      </div>
    </main>
  );
}
