import Link from 'next/link';
import { Play, FileText, Layers } from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: Play,
      title: 'Interactive Player',
      description: 'Play audio/video with synchronized transcript highlighting and annotation capabilities.',
      href: '/run',
    },
    {
      icon: FileText,
      title: 'Documentation',
      description: 'Learn how to use the annotation tool, CSV format requirements, and best practices.',
      href: '/docs',
    },
    {
      icon: Layers,
      title: 'Batch Processing',
      description: 'Process multiple files at once with automated annotation workflows.',
      href: '/batches',
      badge: 'Beta',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Multimodal Annotation Tool
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            A powerful web-based tool for analyzing conversations with synchronized media playback,
            transcript viewing, and collaborative annotation capabilities.
          </p>
          <div className="max-w-4xl mx-auto mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-base text-green-800 font-medium text-center whitespace-nowrap">
              🔒 100% Local & Private — Load and download the app locally. No data is saved on any backend servers.
            </p>
          </div>
          <Link
            href="/run"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors text-white"
          >
            <Play size={20} />
            Get Started
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.href}
                href={feature.href}
                className="bg-white border border-gray-300 rounded-lg p-6 hover:border-blue-500 transition-colors group shadow-sm"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-gray-100 rounded-lg group-hover:bg-blue-600 transition-colors">
                    <Icon size={24} />
                  </div>
                  {feature.badge && (
                    <span className="px-2 py-1 text-xs bg-blue-600 text-white rounded">
                      {feature.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Link>
            );
          })}
        </div>

        {/* Partner Logos */}
        <div className="mb-20">
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {/* Add your logo images here */}
            <img src="/logos/logo1.png" alt="Partner 1" className="h-12" />
            <img src="/logos/logo2.png" alt="Partner 2" className="h-12" />
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Multimodal Annotation Tool. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
