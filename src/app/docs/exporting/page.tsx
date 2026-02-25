'use client';

export default function ExportingPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Exporting Data</h1>

      <div className="space-y-8">
        {/* How to Export */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">How to Export</h2>
          <p className="text-gray-300 mb-4">
            Click the <strong className="text-white">&quot;Export&quot;</strong> or <strong className="text-white">&quot;Save Annotations&quot;</strong> button to download your annotated data as a CSV file.
          </p>
        </div>

        {/* What Gets Exported */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">What Gets Exported</h2>
          <p className="text-gray-300 mb-4">The exported CSV includes:</p>
          <ul className="space-y-2 text-gray-300 list-disc list-inside">
            <li>All original transcript columns (turn_id, speaker, start, end, utterance)</li>
            <li>All annotation columns you defined in your schema</li>
            <li>Your annotation values for each utterance</li>
            <li>Mode-specific columns (context_id, pair_id, batch_id, etc.)</li>
          </ul>
        </div>

        {/* Export File Names */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Export File Names</h2>
          <p className="text-gray-300 mb-4">
            Files are automatically named based on the mode:
          </p>
          <div className="bg-gray-900 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2">
              <code className="bg-gray-800 px-2 py-1 rounded text-blue-400">session_annotated.csv</code>
              <span className="text-gray-400">- Session mode export</span>
            </div>
            <div className="flex items-center gap-2">
              <code className="bg-gray-800 px-2 py-1 rounded text-blue-400">context_annotated.csv</code>
              <span className="text-gray-400">- Context mode export</span>
            </div>
            <div className="flex items-center gap-2">
              <code className="bg-gray-800 px-2 py-1 rounded text-blue-400">pair_annotated.csv</code>
              <span className="text-gray-400">- Pair mode export</span>
            </div>
            <div className="flex items-center gap-2">
              <code className="bg-gray-800 px-2 py-1 rounded text-blue-400">batch_annotated.csv</code>
              <span className="text-gray-400">- Batch mode export</span>
            </div>
          </div>
        </div>

        {/* Pair Mode Export */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Pair Mode Export</h2>
          <p className="text-gray-300 mb-4">
            Pair mode exports include additional columns:
          </p>
          <ul className="space-y-2 text-gray-300 list-disc list-inside">
            <li><code className="bg-gray-900 px-1 rounded">choice</code> - Your selection (A, B, or Tie)</li>
            <li><code className="bg-gray-900 px-1 rounded">note</code> - Optional explanation for your choice</li>
          </ul>
          <div className="mt-4 bg-gray-900 rounded p-3 overflow-x-auto">
            <pre className="text-xs text-gray-400">
{`pair_id,turn_id_a,turn_id_b,choice,note
1,1,2,A,"First question is clearer"
2,3,4,Tie,"Both equally valid"`}
            </pre>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-300">Tips</h2>
          <ul className="space-y-2 text-gray-300 list-disc list-inside">
            <li>Export frequently to save your work</li>
            <li>Exported files can be re-imported to continue annotation</li>
            <li>The original data is preserved - only annotation columns are added/updated</li>
            <li>CSV format is compatible with Excel, Google Sheets, and Python/R</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
