import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="glass-dark text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2.5 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-white to-gray-300 rounded-xl flex items-center justify-center">
                <span className="text-gray-900 font-bold text-lg">RM</span>
              </div>
              <span className="text-xl font-semibold">RM Devices</span>
            </div>
            <p className="text-gray-300 max-w-md leading-relaxed">
              Premium Tech, Delivered. Your trusted source for high-end mobile devices 
              from Apple and Samsung.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-white/90">Quick Links</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/catalog" className="text-gray-300 hover:text-white transition-colors">
                  Catalog
                </Link>
              </li>
              <li>
                <Link href="/testimonials" className="text-gray-300 hover:text-white transition-colors">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-gray-300 hover:text-white transition-colors">
                  Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4 text-white/90">Contact</h3>
            <ul className="space-y-2.5 text-gray-300">
              <li>support@rmdevices.com</li>
              <li>1-800-RM-DEVICES</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} RM Devices. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
