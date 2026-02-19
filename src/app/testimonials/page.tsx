'use client';

import { useState, useEffect } from 'react';
import { Testimonial } from '@/types';

const mockTestimonials: Testimonial[] = [
  {
    id: '1',
    customer_name: 'Michael Chen',
    rating: 5,
    comment:
      "Absolutely thrilled with my iPhone 15 Pro! The ordering process was smooth, and the device arrived in perfect condition. RM Devices is now my go-to for premium tech.",
    date: '2024-01-15',
  },
  {
    id: '2',
    customer_name: 'Sarah Johnson',
    rating: 5,
    comment:
      "Best prices I found for the Galaxy S24 Ultra. The phone was brand new as described, and shipping was incredibly fast. Highly recommend!",
    date: '2024-01-10',
  },
  {
    id: '3',
    customer_name: 'David Martinez',
    rating: 5,
    comment:
      "I was hesitant to buy such an expensive device online, but RM Devices made the experience seamless. The Grade A+ condition was accurate - my iPhone 14 looks brand new!",
    date: '2024-01-05',
  },
  {
    id: '4',
    customer_name: 'Emily Thompson',
    rating: 5,
    comment:
      "Outstanding service! I purchased a Galaxy Z Fold 5 and couldn't be happier. The device was exactly as described, and customer support was very helpful.",
    date: '2023-12-28',
  },
  {
    id: '5',
    customer_name: 'James Wilson',
    rating: 5,
    comment:
      "Fast delivery and excellent product quality. I've bought two iPhones from RM Devices now, and both experiences have been flawless. Will definitely buy again!",
    date: '2023-12-20',
  },
  {
    id: '6',
    customer_name: 'Lisa Anderson',
    rating: 5,
    comment:
      "The transparency about device conditions is refreshing. My Samsung Galaxy was in mint condition, and the price was unbeatable. Thank you, RM Devices!",
    date: '2023-12-15',
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex space-x-1">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${
            i < rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading - will be replaced with Supabase fetch
    setTimeout(() => {
      setTestimonials(mockTestimonials);
      setIsLoading(false);
    }, 500);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">
            Customer Testimonials
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-center">
            Don't just take our word for it. Here's what our customers have to 
            say about their experience with RM Devices.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-gray-400">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">4.9/5</div>
              <div className="text-gray-400">Average Rating</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-gray-400">Devices Sold</div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 animate-pulse"
              >
                <div className="flex space-x-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="w-5 h-5 bg-gray-200 rounded" />
                  ))}
                </div>
                <div className="space-y-3 mb-4">
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-24" />
                    <div className="h-3 bg-gray-200 rounded w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <StarRating rating={testimonial.rating} />
                <p className="text-gray-700 mt-4 mb-6 leading-relaxed">
                  "{testimonial.comment}"
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-900 to-gray-700 rounded-full flex items-center justify-center text-white font-semibold">
                    {testimonial.customer_name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.customer_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(testimonial.date).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Join Our Happy Customers?
          </h2>
          <p className="text-gray-600 mb-8">
            Browse our catalog and find your perfect device today.
          </p>
          <a
            href="/catalog"
            className="inline-flex px-8 py-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
          >
            View Catalog
            <svg
              className="ml-2 w-5 h-5"
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
          </a>
        </div>
      </div>
    </div>
  );
}
