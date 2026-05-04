'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface Company {
  id: string;
  name: string;
  slug: string;
  plan: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/signin');
      return;
    }

    const userData = localStorage.getItem('user');
    const companyData = localStorage.getItem('company');

    if (userData) setUser(JSON.parse(userData));
    if (companyData) setCompany(JSON.parse(companyData));
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('company');
    router.push('/signin');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              Rize
            </h1>
            <span className="bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded text-xs font-medium">
              {company?.plan || 'Free'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-500">{user?.name}</span>
            <button onClick={handleLogout} className="btn-secondary text-sm">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-semibold mb-2">Welcome to Rize</h2>
        <p className="text-gray-500 mb-8">Your AI work OS for enterprises</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/agents" className="card hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-4">🤖</div>
            <h3 className="font-semibold mb-2">Build Your Agent</h3>
            <p className="text-gray-500 text-sm">Create custom AI agents using Langflow visual builder</p>
          </Link>

          <Link href="/rag" className="card hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-4">📚</div>
            <h3 className="font-semibold mb-2">Knowledge RAG</h3>
            <p className="text-gray-500 text-sm">Build your own RAG with AnythingLLM</p>
          </Link>

          <Link href="/developer" className="card hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-4">💻</div>
            <h3 className="font-semibold mb-2">Developer Agent</h3>
            <p className="text-gray-500 text-sm">Your own developer using OpenHands</p>
          </Link>

          <Link href="/notebook" className="card hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-4">📓</div>
            <h3 className="font-semibold mb-2">Notebook</h3>
            <p className="text-gray-500 text-sm">Your own notebook using Open Notebook</p>
          </Link>

          <Link href="/chat" className="card hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-4">💬</div>
            <h3 className="font-semibold mb-2">Chat</h3>
            <p className="text-gray-500 text-sm">Unified chat using LibreChat</p>
          </Link>

          <div className="card">
            <div className="text-3xl mb-4">🐳</div>
            <h3 className="font-semibold mb-2">Local MCPs</h3>
            <p className="text-gray-500 text-sm">Run MCPs and models locally with Podman</p>
          </div>
        </div>
      </main>
    </div>
  );
}