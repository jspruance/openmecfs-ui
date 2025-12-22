import Image from "next/image";

export const metadata = {
  title: "Studio — Open ME/CFS",
  description: "Studio photos",
};

export default function StudioPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Studio</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative aspect-video w-full">
            <Image
              src="/images/studio_a.jpg"
              alt="Studio"
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </main>
  );
}

