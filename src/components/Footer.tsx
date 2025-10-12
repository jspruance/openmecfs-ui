export default function Footer() {
  return (
    <footer className="mt-20 border-t border-gray-200 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
        <p className="mb-3 md:mb-0 text-center md:text-left">
          © 2025 <span className="font-medium text-gray-700">Open ME/CFS</span>.{" "}
          Built with <span className="text-red-500">♥</span> for the ME/CFS
          community.
        </p>
        <div className="flex gap-6 text-gray-500">
          <a href="/terms" className="hover:text-gray-900 transition-colors">
            Terms
          </a>
          <a href="/privacy" className="hover:text-gray-900 transition-colors">
            Privacy
          </a>
          <a href="/contact" className="hover:text-gray-900 transition-colors">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
