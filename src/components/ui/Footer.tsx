import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">RM</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">RM Devices</span>
            </div>
            <p className="text-gray-600 max-w-md">
              Premium Tech, Delivered. Your trusted source for high-end mobile devices 
              from Apple and Samsung.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/catalog" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Catalog
                </Link>
              </li>
              <li>
                <Link href="/testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-600">
              <li>support@rmdevices.com</li>
              <li>1-800-RM-DEVICES</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} RM Devices. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
