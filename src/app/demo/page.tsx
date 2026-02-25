'use client';

import Link from 'next/link';
import { FileText, Layers, GitCompare, Database } from 'lucide-react';

export default function DemoPage() {
  const demoModes = [
    {
      name: 'Session',
      href: '/demo/session',
      icon: FileText,
      description: 'Single session annotation with synchronized media playback',
    },
    {
      name: 'Context',
      href: '/demo/context',
      icon: Layers,
      description: 'Context-based annotation',
    },
    {
      name: 'Pair',
      href: '/demo/pair',
      icon: GitCompare,
      description: 'Paired comparison annotation',
    },
    {
      name: 'Batch',
      href: '/demo/batch',
      icon: Database,
      description: 'Annotate multiple turns in batches',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Demo</h1>
        <p className="text-gray-400 mb-8">
          Try different annotation modes with sample data. No file upload required.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {demoModes.map((mode) => {
            const Icon = mode.icon;
            return (
              <Link
                key={mode.href}
                href={mode.href}
                className="block p-6 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-750 hover:border-gray-600 transition-colors"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Icon size={24} className="text-blue-400" />
                  <h2 className="text-xl font-semibold">{mode.name}</h2>
                </div>
                <p className="text-gray-400 text-sm">{mode.description}</p>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
          <p className="text-sm text-gray-400">
            Ready to use your own data?{' '}
            <Link href="/run" className="text-blue-400 hover:text-blue-300 underline">
              Go to Run page
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
