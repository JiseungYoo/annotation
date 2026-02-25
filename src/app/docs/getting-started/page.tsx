'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

export default function GettingStartedPage() {
  const [showSchemaInfo, setShowSchemaInfo] = useState(false);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Getting Started</h1>

      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Start Guide</h2>
          <ol className="space-y-4 text-gray-300">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">1</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-white">Set up your annotation schema</span>
                  <button
                    onClick={() => setShowSchemaInfo(!showSchemaInfo)}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                  >
                    Do This First
                    {showSchemaInfo ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>

                {showSchemaInfo && (
                  <div className="mt-4 bg-gray-900 border border-blue-500/30 rounded-lg p-6 space-y-6">
                    {/* Why Critical */}
                    <div>
                      <div className="flex items-start gap-2 mb-3">
                        <AlertCircle size={20} className="text-blue-400 mt-0.5 flex-shrink-0" />
                        <h4 className="font-semibold text-lg text-white">Why Schema Setup is Critical</h4>
                      </div>
                      <p className="text-gray-300 leading-relaxed">
                        The schema defines what annotation categories you want to track (e.g., &quot;uptake&quot;, &quot;questioning&quot;, &quot;backchanneling&quot;).
                        <strong className="text-blue-400"> You MUST set up your schema BEFORE loading files.</strong> This enables the tool to properly handle your annotation data.
                      </p>
                    </div>

                    {/* Two Workflows */}
                    <div>
                      <h4 className="font-semibold text-lg text-white mb-4">Two Workflows</h4>

                      {/* Workflow 1 */}
                      <div className="mb-4 bg-gray-800 rounded-lg p-4 border border-gray-700">
                        <h5 className="font-semibold text-blue-400 mb-2">Workflow 1: Loading CSV with Existing Annotations</h5>
                        <ul className="space-y-2 text-sm list-disc list-inside ml-2">
                          <li>Your CSV already has annotation columns (e.g., &quot;uptake&quot;, &quot;questioning&quot;)</li>
                          <li>Set up your schema with <strong>MATCHING column names</strong> first</li>
                          <li>When you load the CSV, the tool automatically matches and loads your existing annotation data</li>
                        </ul>
                        <div className="mt-3 bg-gray-900 rounded p-3 overflow-x-auto">
                          <pre className="text-xs text-gray-400">
{`# Example CSV with existing annotations
turn_id,speaker,start,end,utterance,uptake,questioning
1,S1,0.0,2.5,"Hello, how are you?",1,0
2,S2,3.0,5.2,"I'm doing well, thanks!",0,1`}
                          </pre>
                        </div>
                      </div>

                      {/* Workflow 2 */}
                      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                        <h5 className="font-semibold text-green-400 mb-2">Workflow 2: Starting Fresh (First Time Annotation)</h5>
                        <ul className="space-y-2 text-sm list-disc list-inside ml-2">
                          <li>Your CSV only has the required columns (turn_id, speaker, start, end, utterance)</li>
                          <li>Set up your schema with the annotation categories you want to create</li>
                          <li>The tool <strong>CREATES empty columns</strong> for you to fill in as you annotate</li>
                        </ul>
                        <div className="mt-3 bg-gray-900 rounded p-3 overflow-x-auto">
                          <pre className="text-xs text-gray-400">
{`# Example CSV without annotations (base columns only)
turn_id,speaker,start,end,utterance
1,S1,0.0,2.5,"Hello, how are you?"
2,S2,3.0,5.2,"I'm doing well, thanks!"`}
                          </pre>
                        </div>
                      </div>
                    </div>

                    {/* Step by step */}
                    <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                      <h4 className="font-semibold text-white mb-3">Step-by-Step Instructions</h4>
                      <ol className="space-y-2 text-sm list-decimal list-inside ml-2">
                        <li>Click &quot;Set Up Schema&quot; button <strong>FIRST</strong> (before uploading any files)</li>
                        <li>Define your annotation column names (e.g., &quot;uptake&quot;, &quot;questioning&quot;)</li>
                        <li>Save your schema</li>
                        <li>Upload your media and CSV files</li>
                        <li>If CSV has matching columns, data will load; if not, empty columns will be created</li>
                      </ol>
                    </div>
                  </div>
                )}
              </div>
            </li>

            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">2</span>
              <span>Upload your media file (audio or video) and transcript CSV file (supports drag and drop)</span>
            </li>

            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">3</span>
              <span>Start annotating by clicking on utterances and filling in the annotation fields</span>
            </li>

            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">4</span>
              <span>Export your annotated data when finished</span>
            </li>
          </ol>
        </div>

        {/* Choose Your Mode */}
        <div className="border-t border-gray-700 pt-6">
          <h2 className="text-xl font-semibold mb-4">Choose Your Annotation Mode</h2>
          <p className="text-gray-400 mb-4">
            Select the mode that best fits your annotation workflow:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <h3 className="font-semibold text-blue-400 mb-2">Session Mode</h3>
              <p className="text-sm text-gray-400">Turn-by-turn annotation with synchronized media playback</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <h3 className="font-semibold text-blue-400 mb-2">Context Mode</h3>
              <p className="text-sm text-gray-400">Annotate target turns with surrounding context visible</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <h3 className="font-semibold text-blue-400 mb-2">Pair Mode</h3>
              <p className="text-sm text-gray-400">Compare two turns and select A, B, or Tie</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <h3 className="font-semibold text-blue-400 mb-2">Batch Mode</h3>
              <p className="text-sm text-gray-400">Annotate multiple turns at once in a table view</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
