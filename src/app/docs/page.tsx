'use client';

import Link from 'next/link';
import {
  Play, FileSpreadsheet, Upload, Keyboard, MousePointer, Download, Layers, ArrowRight
} from 'lucide-react';

const sections = [
  {
    href: '/docs/getting-started',
    label: 'Getting Started',
    icon: Play,
    description: 'Quick start guide and schema setup instructions'
  },
  {
    href: '/docs/annotation-modes',
    label: 'Annotation Modes',
    icon: Layers,
    description: 'Learn about Session, Context, Pair, and Batch modes'
  },
  {
    href: '/docs/csv-format',
    label: 'CSV Format',
    icon: FileSpreadsheet,
    description: 'Required columns and data structure'
  },
  {
    href: '/docs/media-formats',
    label: 'Media Formats',
    icon: Upload,
    description: 'Supported audio and video formats'
  },
  {
    href: '/docs/keyboard-shortcuts',
    label: 'Keyboard Shortcuts',
    icon: Keyboard,
    description: 'Keyboard navigation and controls'
  },
  {
    href: '/docs/features',
    label: 'Features',
    icon: MousePointer,
    description: 'Tool capabilities and functionality'
  },
  {
    href: '/docs/exporting',
    label: 'Exporting Data',
    icon: Download,
    description: 'How to export your annotations'
  },
];

export default function DocsPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Documentation</h1>
      <p className="text-xl text-gray-400 mb-8">
        Learn how to use the Multimodal Annotation Tool effectively
      </p>

      <div className="grid gap-4">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Link
              key={section.href}
              href={section.href}
              className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-blue-500 hover:bg-gray-750 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gray-700 rounded-lg group-hover:bg-blue-600 transition-colors">
                    <Icon size={24} className="text-blue-400 group-hover:text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold group-hover:text-blue-400 transition-colors">
                      {section.label}
                    </h2>
                    <p className="text-sm text-gray-400">{section.description}</p>
                  </div>
                </div>
                <ArrowRight size={20} className="text-gray-500 group-hover:text-blue-400 transition-colors" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
