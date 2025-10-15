import Link from "next/link";

const handleDonateClick = () => {
  if (typeof window !== "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).umami?.track?.("donate_cancel_click");
  }
};

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
          onClick={handleDonateClick}
          className="inline-block mt-6 text-blue-600 hover:underline"
        >
          Go back to Donate
        </Link>
      </div>
    </main>
  );
}
