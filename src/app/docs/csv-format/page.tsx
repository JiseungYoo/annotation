'use client';

export default function CsvFormatPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">CSV Format Requirements</h1>

      <div className="space-y-8">
        {/* Base Required Columns */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Base Required Columns (All Modes)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left">Column</th>
                  <th className="px-4 py-2 text-left">Type</th>
                  <th className="px-4 py-2 text-left">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                <tr>
                  <td className="px-4 py-2"><code className="bg-gray-900 px-1 rounded">turn_id</code></td>
                  <td className="px-4 py-2 text-gray-400">integer</td>
                  <td className="px-4 py-2 text-gray-400">Unique identifier for each utterance</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="bg-gray-900 px-1 rounded">speaker</code></td>
                  <td className="px-4 py-2 text-gray-400">string</td>
                  <td className="px-4 py-2 text-gray-400">Speaker identifier (e.g., &quot;Teacher&quot;, &quot;S1&quot;)</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="bg-gray-900 px-1 rounded">start</code></td>
                  <td className="px-4 py-2 text-gray-400">float</td>
                  <td className="px-4 py-2 text-gray-400">Start time in seconds</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="bg-gray-900 px-1 rounded">end</code></td>
                  <td className="px-4 py-2 text-gray-400">float</td>
                  <td className="px-4 py-2 text-gray-400">End time in seconds</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="bg-gray-900 px-1 rounded">utterance</code></td>
                  <td className="px-4 py-2 text-gray-400">string</td>
                  <td className="px-4 py-2 text-gray-400">The spoken text</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Mode-Specific Columns */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Mode-Specific Columns</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left">Column</th>
                  <th className="px-4 py-2 text-left">Mode</th>
                  <th className="px-4 py-2 text-left">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                <tr>
                  <td className="px-4 py-2"><code className="bg-gray-900 px-1 rounded">context_id</code></td>
                  <td className="px-4 py-2 text-gray-400">Context</td>
                  <td className="px-4 py-2 text-gray-400">Groups turns into contexts</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="bg-gray-900 px-1 rounded">target</code></td>
                  <td className="px-4 py-2 text-gray-400">Context</td>
                  <td className="px-4 py-2 text-gray-400">1 or true for the turn to annotate</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="bg-gray-900 px-1 rounded">pair_id</code></td>
                  <td className="px-4 py-2 text-gray-400">Pair</td>
                  <td className="px-4 py-2 text-gray-400">Groups 2 turns for comparison</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="bg-gray-900 px-1 rounded">batch_id</code></td>
                  <td className="px-4 py-2 text-gray-400">Batch</td>
                  <td className="px-4 py-2 text-gray-400">Groups turns into batches</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Example CSV */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Example CSV (All Columns)</h2>
          <p className="text-gray-400 mb-4">
            A single CSV file can include all mode-specific columns, allowing you to use the same file
            with different annotation modes:
          </p>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`turn_id,speaker,start,end,utterance,context_id,target,pair_id,batch_id
1,Teacher,0.0,2.5,"Hello class",1,,1,batch_001
2,Teacher,3.0,5.2,"Today's topic",1,1,1,batch_001
3,Student,6.1,8.9,"I have a question",2,,2,batch_001
4,Teacher,9.0,11.0,"Yes, go ahead",2,1,2,batch_002`}
            </pre>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-300">Tips</h2>
          <ul className="space-y-2 text-gray-300 list-disc list-inside">
            <li>Time values (start, end) should be in seconds with decimal precision</li>
            <li>Use double quotes around utterances containing commas</li>
            <li>Empty cells are allowed for mode-specific columns you don&apos;t need</li>
            <li>The <code className="bg-gray-900 px-1 rounded">target</code> column accepts: 1, true, TRUE, or empty</li>
            <li>Keep CSV files under 10 MB for best performance</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
