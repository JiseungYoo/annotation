'use client';

export default function FeaturesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Features</h1>

      <div className="space-y-6">
        {/* Schema Customization */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-3">Schema Customization</h2>
          <p className="text-gray-300 mb-4">
            Define custom annotation columns with your own labels. The schema system allows you to:
          </p>
          <ul className="space-y-2 text-gray-400 list-disc list-inside">
            <li>Create any number of annotation columns</li>
            <li>Name columns to match your research needs (e.g., &quot;uptake&quot;, &quot;questioning&quot;)</li>
            <li>Automatically match columns from existing CSV files</li>
            <li>Create empty columns for new annotations</li>
          </ul>
        </div>

        {/* Synchronized Playback */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-3">Synchronized Playback</h2>
          <p className="text-gray-300 mb-4">
            The transcript automatically highlights the current utterance during playback:
          </p>
          <ul className="space-y-2 text-gray-400 list-disc list-inside">
            <li>Current turn is highlighted as media plays</li>
            <li>Click any utterance to jump to that point in the media</li>
            <li>Segment-based playback for precise annotation</li>
            <li>Works with both audio and video files</li>
          </ul>
        </div>

        {/* Drag and Drop */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-3">Drag and Drop</h2>
          <p className="text-gray-300">
            Simply drag media and CSV files directly onto the window for quick loading. No need to use file dialogs.
          </p>
        </div>

        {/* Progress Tracking */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-3">Progress Tracking</h2>
          <p className="text-gray-300 mb-4">
            Keep track of your annotation progress:
          </p>
          <ul className="space-y-2 text-gray-400 list-disc list-inside">
            <li>Completed items show a checkmark in the sidebar</li>
            <li>Visual progress indicators for each mode</li>
            <li>Quickly identify which items still need annotation</li>
          </ul>
        </div>

        {/* Resizable Panels */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-3">Resizable Panels</h2>
          <p className="text-gray-300">
            Adjust the layout by dragging panel dividers to customize your workspace. Make the transcript larger for reading or expand the annotation panel for complex schemas.
          </p>
        </div>

        {/* Multiple Annotation Modes */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-3">Multiple Annotation Modes</h2>
          <p className="text-gray-300 mb-4">
            Choose from four specialized modes to match your workflow:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-900 rounded p-3">
              <h3 className="font-semibold text-blue-400">Session</h3>
              <p className="text-sm text-gray-400">Turn-by-turn annotation</p>
            </div>
            <div className="bg-gray-900 rounded p-3">
              <h3 className="font-semibold text-blue-400">Context</h3>
              <p className="text-sm text-gray-400">Annotate with context visible</p>
            </div>
            <div className="bg-gray-900 rounded p-3">
              <h3 className="font-semibold text-blue-400">Pair</h3>
              <p className="text-sm text-gray-400">A/B comparison annotation</p>
            </div>
            <div className="bg-gray-900 rounded p-3">
              <h3 className="font-semibold text-blue-400">Batch</h3>
              <p className="text-sm text-gray-400">Table-based bulk annotation</p>
            </div>
          </div>
        </div>

        {/* Demo Mode */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-3">Demo Mode</h2>
          <p className="text-gray-300">
            Try each annotation mode with pre-loaded sample data. No need to upload files to explore the tool&apos;s capabilities.
          </p>
        </div>
      </div>
    </div>
  );
}
