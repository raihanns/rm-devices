'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import Link from 'next/link';

export default function TestConnectionPage() {
  const [status, setStatus] = useState('Testing connection...');
  const [details, setDetails] = useState<string[]>([]);

  const supabase = createClient();

  useEffect(() => {
    async function testConnection() {
      const logs: string[] = [];

      try {
        // Test 1: Check if Supabase client is configured
        logs.push('1. Checking Supabase configuration...');
        
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
          setStatus('❌ Environment variables not configured');
          setDetails(['Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY']);
          return;
        }

        logs.push('   ✓ Environment variables found');

        // Test 2: Check session
        logs.push('2. Checking auth session...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          logs.push(`   ⚠ Session check: ${sessionError.message}`);
        } else {
          logs.push(session ? `   ✓ Active session for: ${session.user.email}` : '   ✓ No active session (expected for login)');
        }

        // Test 3: Try to fetch products (public access)
        logs.push('3. Testing database connection...');
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select('*')
          .limit(1);

        if (productsError) {
          logs.push(`   ❌ Database error: ${productsError.message}`);
          logs.push('   Hint: Check if RLS policies allow public SELECT on products table');
          setStatus('❌ Database connection failed');
          setDetails(logs);
          return;
        }

        logs.push(`   ✓ Database connection successful`);
        logs.push(`   ✓ Found ${products?.length || 0} products in database`);

        // Test 4: Check if we can sign in (test with anonymous access first)
        logs.push('4. Testing authentication endpoint...');
        const { error: authError } = await supabase.auth.getUser();
        
        if (authError && authError.message.includes('Auth session missing')) {
          logs.push('   ✓ Auth endpoint accessible (no session - expected)');
        } else if (!authError) {
          logs.push('   ✓ Auth endpoint accessible (user authenticated)');
        } else {
          logs.push(`   ⚠ Auth check: ${authError.message}`);
        }

        setStatus('✅ All Tests Passed! Supabase is configured correctly.');
        setDetails(logs);

      } catch (err) {
        logs.push(`❌ Unexpected error: ${err}`);
        setStatus('❌ Connection test failed');
        setDetails(logs);
      }
    }

    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-2xl w-full">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Supabase Connection Test</h1>
            <p className="text-sm text-gray-600">Verify your Supabase configuration</p>
          </div>
        </div>

        <div className={`p-4 rounded-lg mb-6 ${
          status.includes('✅') 
            ? 'bg-green-50 border border-green-200' 
            : status.includes('❌')
            ? 'bg-red-50 border border-red-200'
            : 'bg-yellow-50 border border-yellow-200'
        }`}>
          <p className={`font-semibold ${
            status.includes('✅') 
              ? 'text-green-900' 
              : status.includes('❌')
              ? 'text-red-900'
              : 'text-yellow-900'
          }`}>
            {status}
          </p>
        </div>

        {details.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 font-mono text-sm">
            {details.map((line, index) => (
              <div key={index} className="text-gray-700 whitespace-pre-wrap">
                {line}
              </div>
            ))}
          </div>
        )}

        <div className="space-y-3 text-sm text-gray-600">
          <h3 className="font-semibold text-gray-900">Next Steps:</h3>
          <ul className="space-y-2">
            <li className="flex items-start space-x-2">
              <span className="text-green-600 mt-0.5">•</span>
              <span>If all tests passed, your Supabase connection is working!</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-green-600 mt-0.5">•</span>
              <span>Create an admin user in Supabase Dashboard → Authentication → Users</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-green-600 mt-0.5">•</span>
              <span>Use those credentials to log in at <Link href="/admin" className="text-blue-600 hover:underline">/admin</Link></span>
            </li>
          </ul>
        </div>

        <div className="mt-6 flex space-x-3">
          <Link
            href="/admin"
            className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-center font-medium"
          >
            Go to Admin Login
          </Link>
          <Link
            href="/"
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center font-medium"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
