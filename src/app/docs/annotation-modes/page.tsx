'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, FileText, Layers, GitCompare, Database } from 'lucide-react';

export default function AnnotationModesPage() {
  const [expandedMode, setExpandedMode] = useState<string | null>(null);

  const toggleMode = (mode: string) => {
    setExpandedMode(expandedMode === mode ? null : mode);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Annotation Modes</h1>
      <p className="text-gray-400 mb-8">
        The tool supports four different annotation modes, each designed for specific use cases.
        Choose the mode that best fits your annotation workflow.
      </p>

      {/* Session Mode */}
      <div className="mb-4">
        <button
          onClick={() => toggleMode('session')}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg p-4 flex items-center justify-between hover:bg-gray-750 transition-colors"
        >
          <div className="flex items-center gap-3">
            <FileText size={24} className="text-blue-400" />
            <div className="text-left">
              <h3 className="font-semibold text-lg">Session Mode</h3>
              <p className="text-sm text-gray-400">Single session annotation with synchronized media playback</p>
            </div>
          </div>
          {expandedMode === 'session' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        {expandedMode === 'session' && (
          <div className="bg-gray-800 border border-t-0 border-gray-700 rounded-b-lg p-6 -mt-1 space-y-4">
            <div>
              <h4 className="font-semibold text-white mb-2">What is Session Mode?</h4>
              <p className="text-gray-300">
                Session mode is the classic annotation interface where you annotate each utterance (turn)
                in a transcript one at a time while playing synchronized audio/video. This is ideal for
                detailed, turn-by-turn annotation of conversations or lectures.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-2">When to Use</h4>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                <li>Annotating every turn in a transcript</li>
                <li>When you need to hear/see the media for each annotation</li>
                <li>Detailed discourse analysis</li>
                <li>Quality checking existing annotations</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-2">Required CSV Columns</h4>
              <code className="bg-gray-900 px-2 py-1 rounded text-sm">turn_id, speaker, start, end, utterance</code>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-2">How It Works</h4>
              <ol className="list-decimal list-inside text-gray-300 space-y-1">
                <li>Load your CSV and media file</li>
                <li>Click any row to play that segment</li>
                <li>Fill in annotation columns on the right panel</li>
                <li>The current playing turn is highlighted automatically</li>
              </ol>
            </div>

            <div className="flex gap-3">
              <Link href="/run/session" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors">
                Go to Session Mode
              </Link>
              <Link href="/demo/session" className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors">
                Try Demo
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Context Mode */}
      <div className="mb-4">
        <button
          onClick={() => toggleMode('context')}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg p-4 flex items-center justify-between hover:bg-gray-750 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Layers size={24} className="text-blue-400" />
            <div className="text-left">
              <h3 className="font-semibold text-lg">Context Mode</h3>
              <p className="text-sm text-gray-400">Annotate target turns with surrounding context</p>
            </div>
          </div>
          {expandedMode === 'context' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        {expandedMode === 'context' && (
          <div className="bg-gray-800 border border-t-0 border-gray-700 rounded-b-lg p-6 -mt-1 space-y-4">
            <div>
              <h4 className="font-semibold text-white mb-2">What is Context Mode?</h4>
              <p className="text-gray-300">
                Context mode groups turns by a <code className="bg-gray-900 px-1 rounded">context_id</code> and
                highlights one turn as the <strong>target</strong> for annotation. You can see the surrounding
                context (previous turns) to make informed annotation decisions, but only annotate the target turn.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-2">When to Use</h4>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                <li>When context matters for your annotation decision</li>
                <li>Annotating specific types of utterances (questions, responses, etc.)</li>
                <li>When you only need to annotate certain turns, not all</li>
                <li>Teacher questioning analysis with prior context</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-2">Required CSV Columns</h4>
              <code className="bg-gray-900 px-2 py-1 rounded text-sm">turn_id, speaker, start, end, utterance, context_id, target</code>
              <p className="text-gray-400 text-sm mt-2">
                <code className="bg-gray-900 px-1 rounded">target</code> column should be <code className="bg-gray-900 px-1 rounded">1</code> or <code className="bg-gray-900 px-1 rounded">true</code> for the turn to annotate
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-2">Example CSV Structure</h4>
              <div className="bg-gray-900 rounded p-3 overflow-x-auto">
                <pre className="text-xs text-gray-400">
{`turn_id,speaker,start,end,utterance,context_id,target
1,Teacher,0,2,"Today we learn about plants.",1,
2,Teacher,3,6,"Plants need sunlight.",1,
3,Teacher,7,9,"How do they grow?",1,1
4,Student,10,12,"With water!",2,
5,Teacher,13,15,"Exactly right!",2,1`}
                </pre>
              </div>
              <p className="text-gray-400 text-sm mt-2">
                Context 1 has 3 turns, with turn 3 as target. Context 2 has 2 turns, with turn 5 as target.
              </p>
            </div>

            <div className="flex gap-3">
              <Link href="/run/context" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors">
                Go to Context Mode
              </Link>
              <Link href="/demo/context" className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors">
                Try Demo
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Pair Mode */}
      <div className="mb-4">
        <button
          onClick={() => toggleMode('pair')}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg p-4 flex items-center justify-between hover:bg-gray-750 transition-colors"
        >
          <div className="flex items-center gap-3">
            <GitCompare size={24} className="text-blue-400" />
            <div className="text-left">
              <h3 className="font-semibold text-lg">Pair Mode</h3>
              <p className="text-sm text-gray-400">Compare two turns and select A, B, or Tie</p>
            </div>
          </div>
          {expandedMode === 'pair' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        {expandedMode === 'pair' && (
          <div className="bg-gray-800 border border-t-0 border-gray-700 rounded-b-lg p-6 -mt-1 space-y-4">
            <div>
              <h4 className="font-semibold text-white mb-2">What is Pair Mode?</h4>
              <p className="text-gray-300">
                Pair mode presents two turns side-by-side (A and B) for comparison. You select which
                turn is better, or mark them as a Tie. This is useful for preference annotation,
                quality comparison, or ranking tasks.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-2">When to Use</h4>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                <li>Comparing two responses or utterances</li>
                <li>Preference or quality ranking tasks</li>
                <li>A/B testing annotation</li>
                <li>Pairwise comparison studies</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-2">Required CSV Columns</h4>
              <code className="bg-gray-900 px-2 py-1 rounded text-sm">turn_id, speaker, start, end, utterance, pair_id</code>
              <p className="text-gray-400 text-sm mt-2">
                Each <code className="bg-gray-900 px-1 rounded">pair_id</code> should have exactly 2 rows. First row becomes A, second becomes B.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-2">Example CSV Structure</h4>
              <div className="bg-gray-900 rounded p-3 overflow-x-auto">
                <pre className="text-xs text-gray-400">
{`turn_id,speaker,start,end,utterance,pair_id
1,Teacher,0,2,"What is photosynthesis?",1
2,Teacher,3,6,"How do plants make food?",1
3,Student,7,9,"Plants use sunlight.",2
4,Student,10,12,"They need water and sun.",2`}
                </pre>
              </div>
              <p className="text-gray-400 text-sm mt-2">
                Pair 1 compares turn 1 (A) vs turn 2 (B). Pair 2 compares turn 3 (A) vs turn 4 (B).
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-2">Annotation Output</h4>
              <p className="text-gray-300">
                For each pair, you select <strong className="text-blue-400">A</strong>, <strong className="text-purple-400">B</strong>, or <strong className="text-yellow-400">Tie</strong>,
                and optionally add a note explaining your choice.
              </p>
            </div>

            <div className="flex gap-3">
              <Link href="/run/pair" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors">
                Go to Pair Mode
              </Link>
              <Link href="/demo/pair" className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors">
                Try Demo
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Batch Mode */}
      <div className="mb-4">
        <button
          onClick={() => toggleMode('batch')}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg p-4 flex items-center justify-between hover:bg-gray-750 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Database size={24} className="text-blue-400" />
            <div className="text-left">
              <h3 className="font-semibold text-lg">Batch Mode</h3>
              <p className="text-sm text-gray-400">Annotate multiple turns at once in a table view</p>
            </div>
          </div>
          {expandedMode === 'batch' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        {expandedMode === 'batch' && (
          <div className="bg-gray-800 border border-t-0 border-gray-700 rounded-b-lg p-6 -mt-1 space-y-4">
            <div>
              <h4 className="font-semibold text-white mb-2">What is Batch Mode?</h4>
              <p className="text-gray-300">
                Batch mode groups turns by <code className="bg-gray-900 px-1 rounded">batch_id</code> and
                displays them in a table format. You can annotate multiple turns at once, seeing all
                turns in the batch simultaneously. This is efficient for high-volume annotation tasks.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-2">When to Use</h4>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                <li>High-volume annotation tasks</li>
                <li>When turns in a group share similar characteristics</li>
                <li>Quick labeling of multiple utterances</li>
                <li>Spreadsheet-style annotation workflow</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-2">Required CSV Columns</h4>
              <code className="bg-gray-900 px-2 py-1 rounded text-sm">turn_id, speaker, start, end, utterance, batch_id</code>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-2">Example CSV Structure</h4>
              <div className="bg-gray-900 rounded p-3 overflow-x-auto">
                <pre className="text-xs text-gray-400">
{`turn_id,speaker,start,end,utterance,batch_id
1,Teacher,0,2,"Welcome to class.",batch_001
2,Teacher,3,6,"Today's topic is plants.",batch_001
3,Teacher,7,9,"Open your textbooks.",batch_001
4,Student,10,12,"Page 42?",batch_002
5,Teacher,13,15,"Yes, page 42.",batch_002`}
                </pre>
              </div>
              <p className="text-gray-400 text-sm mt-2">
                Batch 1 has 3 turns to annotate together. Batch 2 has 2 turns.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-2">Table Interface</h4>
              <p className="text-gray-300">
                All turns in a batch are shown in a table with inline annotation inputs.
                Click on a row to play that segment. Use Tab to navigate between annotation fields.
              </p>
            </div>

            <div className="flex gap-3">
              <Link href="/run/batch" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors">
                Go to Batch Mode
              </Link>
              <Link href="/demo/batch" className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors">
                Try Demo
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Mode Comparison Table */}
      <div className="mt-8 bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h2 className="font-semibold text-xl mb-4">Mode Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-left">Mode</th>
                <th className="px-4 py-2 text-left">Best For</th>
                <th className="px-4 py-2 text-left">Required Columns</th>
                <th className="px-4 py-2 text-left">Annotation Style</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              <tr>
                <td className="px-4 py-3 font-medium">Session</td>
                <td className="px-4 py-3 text-gray-400">Turn-by-turn analysis</td>
                <td className="px-4 py-3 text-gray-400">Base columns only</td>
                <td className="px-4 py-3 text-gray-400">One turn at a time</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Context</td>
                <td className="px-4 py-3 text-gray-400">Context-dependent annotation</td>
                <td className="px-4 py-3 text-gray-400">+ context_id, target</td>
                <td className="px-4 py-3 text-gray-400">Target with context</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Pair</td>
                <td className="px-4 py-3 text-gray-400">Comparison/ranking</td>
                <td className="px-4 py-3 text-gray-400">+ pair_id</td>
                <td className="px-4 py-3 text-gray-400">A vs B selection</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Batch</td>
                <td className="px-4 py-3 text-gray-400">High-volume annotation</td>
                <td className="px-4 py-3 text-gray-400">+ batch_id</td>
                <td className="px-4 py-3 text-gray-400">Table/spreadsheet</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
