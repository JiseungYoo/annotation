'use client';

export default function KeyboardShortcutsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Keyboard Shortcuts</h1>

      <div className="space-y-8">
        {/* Playback Controls */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Playback Controls</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-700">
              <span className="text-gray-300">Play / Pause</span>
              <kbd className="px-3 py-1 bg-gray-700 border border-gray-600 rounded text-sm">Space</kbd>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Navigation (Context / Pair / Batch Modes)</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-700">
              <span className="text-gray-300">Next item</span>
              <kbd className="px-3 py-1 bg-gray-700 border border-gray-600 rounded text-sm">Enter</kbd>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-700">
              <span className="text-gray-300">Previous item</span>
              <div className="flex gap-1">
                <kbd className="px-3 py-1 bg-gray-700 border border-gray-600 rounded text-sm">Shift</kbd>
                <span className="text-gray-500">+</span>
                <kbd className="px-3 py-1 bg-gray-700 border border-gray-600 rounded text-sm">Enter</kbd>
              </div>
            </div>
          </div>
          <p className="text-gray-400 text-sm mt-4">
            Note: Keyboard navigation only works when not typing in an input field.
          </p>
        </div>

        {/* Form Navigation */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Form Navigation</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-700">
              <span className="text-gray-300">Move to next annotation field</span>
              <kbd className="px-3 py-1 bg-gray-700 border border-gray-600 rounded text-sm">Tab</kbd>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-700">
              <span className="text-gray-300">Move to previous annotation field</span>
              <div className="flex gap-1">
                <kbd className="px-3 py-1 bg-gray-700 border border-gray-600 rounded text-sm">Shift</kbd>
                <span className="text-gray-500">+</span>
                <kbd className="px-3 py-1 bg-gray-700 border border-gray-600 rounded text-sm">Tab</kbd>
              </div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-300">Tips for Efficient Annotation</h2>
          <ul className="space-y-2 text-gray-300 list-disc list-inside">
            <li>Use <kbd className="px-2 py-0.5 bg-gray-700 rounded text-xs">Space</kbd> to quickly play/pause while annotating</li>
            <li>Use <kbd className="px-2 py-0.5 bg-gray-700 rounded text-xs">Tab</kbd> to move between annotation fields without using the mouse</li>
            <li>In Context/Pair/Batch modes, use <kbd className="px-2 py-0.5 bg-gray-700 rounded text-xs">Enter</kbd> to move to the next item after completing your annotation</li>
            <li>Click on a row to jump to that segment in the media</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
