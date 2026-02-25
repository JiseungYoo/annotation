'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Play, FileSpreadsheet, Upload, Keyboard, MousePointer, Download, Layers
} from 'lucide-react';

const navItems = [
  { href: '/docs/getting-started', label: 'Getting Started', icon: Play },
  { href: '/docs/annotation-modes', label: 'Annotation Modes', icon: Layers },
  { href: '/docs/csv-format', label: 'CSV Format', icon: FileSpreadsheet },
  { href: '/docs/media-formats', label: 'Media Formats', icon: Upload },
  { href: '/docs/keyboard-shortcuts', label: 'Keyboard Shortcuts', icon: Keyboard },
  { href: '/docs/features', label: 'Features', icon: MousePointer },
  { href: '/docs/exporting', label: 'Exporting Data', icon: Download },
];

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 border-r border-gray-700 flex-shrink-0">
        <div className="p-6 border-b border-gray-700">
          <Link href="/docs" className="text-xl font-bold hover:text-blue-400 transition-colors">
            Documentation
          </Link>
        </div>
        <nav className="p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Back to app link */}
        <div className="absolute bottom-0 left-0 w-64 p-4 border-t border-gray-700">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
          >
            ← Back to App
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-8 py-12">
          {children}
        </div>
      </main>
    </div>
  );
}
