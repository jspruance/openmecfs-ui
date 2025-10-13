export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-gray-50">
      {/* Upper Lane — Built with Love */}
      <div className="border-b border-gray-200 bg-white text-center py-4 text-sm text-gray-600">
        <span className="inline-flex items-center justify-center gap-1">
          Built with <span className="text-red-500">❤</span> for the&nbsp;
          <strong>ME/CFS community</strong>.
        </span>
      </div>

      {/* Lower Lane — Footer Links */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 text-sm text-gray-500 max-w-6xl mx-auto">
        {/* Left Side: Copyright */}
        <div>
          © {new Date().getFullYear()} <strong>Open ME/CFS</strong>.
        </div>

        {/* Right Side: Footer Links */}
        <div className="flex gap-4 mt-2 sm:mt-0">
          <a href="/terms" className="hover:text-gray-700 transition-colors">
            Terms
          </a>
          <a href="/privacy" className="hover:text-gray-700 transition-colors">
            Privacy
          </a>
          <a href="/contact" className="hover:text-gray-700 transition-colors">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
