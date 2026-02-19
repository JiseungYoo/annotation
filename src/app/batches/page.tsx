import { Layers, Upload, Settings, Zap, AlertCircle } from 'lucide-react';

export default function BatchesPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header with Beta Badge */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-4xl font-bold">Batch Processing</h1>
            <span className="px-3 py-1 text-sm bg-blue-600 text-white rounded-full">Beta</span>
          </div>
          <p className="text-xl text-gray-400">
            Process multiple files at once with automated annotation workflows
          </p>
        </div>

        {/* Beta Notice */}
        <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-6 mb-12 flex items-start gap-4">
          <AlertCircle size={24} className="text-blue-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-lg mb-2 text-blue-200">Beta Feature</h3>
            <p className="text-blue-300">
              This feature is currently in beta and under active development. Some functionality may change or be limited.
              We appreciate your feedback as we continue to improve this feature.
            </p>
          </div>
        </div>

        {/* Overview */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Layers size={24} className="text-blue-400" />
            Overview
          </h2>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 space-y-4">
            <p className="text-gray-300">
              Batch processing allows you to annotate multiple transcript files at once using predefined schemas
              and automation rules. This is ideal for large-scale annotation projects where consistency and
              efficiency are critical.
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Planned Features</h2>
          <div className="grid gap-4">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-700 rounded-lg">
                  <Upload size={24} className="text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Bulk Upload</h3>
                  <p className="text-gray-400">
                    Upload multiple media and transcript files at once. The system will automatically match
                    corresponding files based on naming conventions.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-700 rounded-lg">
                  <Settings size={24} className="text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Schema Templates</h3>
                  <p className="text-gray-400">
                    Save and reuse annotation schemas across multiple batches. Create templates for different
                    types of annotation tasks.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-700 rounded-lg">
                  <Zap size={24} className="text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Automated Annotation</h3>
                  <p className="text-gray-400">
                    Apply rule-based annotations automatically based on patterns in the transcript data.
                    Reduce manual annotation time for repetitive tasks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Use Cases</h2>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2 text-blue-400">Research Projects</h3>
                <p className="text-gray-400">
                  Process large corpora of conversational data with consistent annotation schemas.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-blue-400">Quality Assurance</h3>
                <p className="text-gray-400">
                  Review and annotate multiple customer service calls or meetings in bulk.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-blue-400">Training Data Creation</h3>
                <p className="text-gray-400">
                  Generate labeled datasets for machine learning models at scale.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Coming Soon */}
        <section>
          <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-700 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
            <p className="text-gray-300 mb-6">
              We're actively developing batch processing features. Check back soon for updates,
              or use the individual annotation player for now.
            </p>
            <a
              href="/run"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
            >
              Try the Annotation Player
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
