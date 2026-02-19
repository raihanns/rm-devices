import Link from 'next/link';

export default function Home() {
  return (
    <>
      {/* Hero Section with Glass Effect */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-mesh">
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-100/40 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-50/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          {/* Glass Badge */}
          <div className="inline-flex items-center px-4 py-2 glass-card rounded-full mb-8 animate-fade-in">
            <span className="text-sm font-medium text-gray-700">✨ Premium Tech, Delivered</span>
          </div>

          {/* Hero Title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 animate-slide-up">
            <span className="text-gradient">Premium Tech,</span>
            <br />
            <span className="text-gray-400">Delivered.</span>
          </h1>

          {/* Hero Subtitle */}
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Your trusted source for high-end mobile devices from Apple and Samsung.
            Quality guaranteed, competitive prices.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link
              href="/catalog"
              className="group inline-flex items-center justify-center px-8 py-4 btn-primary rounded-xl font-semibold"
            >
              Browse Catalog
              <svg
                className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
            <Link
              href="/testimonials"
              className="inline-flex items-center justify-center px-8 py-4 btn-glass rounded-xl font-semibold"
            >
              Read Testimonials
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <div className="w-6 h-10 glass-card rounded-full p-1">
            <div className="w-1 h-2 bg-gray-400 rounded-full mx-auto animate-shimmer" />
          </div>
        </div>
      </section>

      {/* Featured Brands */}
      <section className="py-24 bg-gradient-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Premium Brands
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              We partner with only the most trusted manufacturers to bring you
              the best devices on the market.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Apple Card */}
            <Link href="/catalog?brand=Apple" className="group glass-card rounded-3xl p-8 glass-card-hover">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-3xl font-bold text-gray-900">Apple</h3>
                <div className="w-16 h-16 glass-card rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-gray-900" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-.8 1.94-.8s.16 1.09-.75 2.15c-.91 1.08-2.06 1.03-2.06 1.03s-.17-1.23.87-2.38z"/>
                  </svg>
                </div>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                iPhone 15 Pro, iPhone 14, iPhone 13 and more. Experience the
                pinnacle of smartphone technology.
              </p>
              <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                View Apple Devices
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            {/* Samsung Card */}
            <Link href="/catalog?brand=Samsung" className="group glass-card rounded-3xl p-8 glass-card-hover">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-3xl font-bold text-gray-900">Samsung</h3>
                <div className="w-16 h-16 glass-card rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                  </svg>
                </div>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Galaxy S24 Ultra, Galaxy Z Fold, Galaxy Z Flip. Innovation that
                pushes the boundaries of mobile technology.
              </p>
              <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                View Samsung Devices
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-mesh">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose RM Devices?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              We're committed to providing the best shopping experience for
              premium mobile devices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Quality Guaranteed */}
            <div className="glass-card rounded-3xl p-8 text-center glass-card-hover">
              <div className="w-16 h-16 glass-card rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Quality Guaranteed
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Every device is thoroughly inspected and comes with a warranty.
              </p>
            </div>

            {/* Competitive Pricing */}
            <div className="glass-card rounded-3xl p-8 text-center glass-card-hover">
              <div className="w-16 h-16 glass-card rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Competitive Pricing
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Best market prices with regular updates to reflect current trends.
              </p>
            </div>

            {/* Fast Updates */}
            <div className="glass-card rounded-3xl p-8 text-center glass-card-hover">
              <div className="w-16 h-16 glass-card rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Fast Updates
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Real-time inventory updates so you always see what's available.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-subtle">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass-card rounded-3xl p-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Ready to Find Your Perfect Device?
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Browse our complete catalog of premium mobile devices from Apple and Samsung.
            </p>
            <Link
              href="/catalog"
              className="group inline-flex items-center px-8 py-4 btn-primary rounded-xl font-semibold"
            >
              View Full Catalog
              <svg
                className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
