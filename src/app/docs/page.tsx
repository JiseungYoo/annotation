'use client';

import { useState } from 'react';
import { FileSpreadsheet, Upload, Play, Download, Keyboard, MousePointer, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

export default function DocsPage() {
  const [showSchemaInfo, setShowSchemaInfo] = useState(false);
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Documentation</h1>
          <p className="text-xl text-gray-400">
            Learn how to use the Multimodal Annotation Tool effectively
          </p>
        </div>

        {/* Getting Started */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Play size={24} className="text-blue-400" />
            Getting Started
          </h2>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Quick Start Guide</h3>
              <ol className="space-y-3 text-gray-300 list-decimal list-inside">
                <li className="font-semibold text-blue-400">
                  <span className="text-white">Set up your annotation schema (click &quot;Set Up Schema&quot; button)</span>
                  <button
                    onClick={() => setShowSchemaInfo(!showSchemaInfo)}
                    className="ml-3 inline-flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                  >
                    Do This First
                    {showSchemaInfo ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>

                  {showSchemaInfo && (
                    <div className="mt-4 ml-6 bg-gray-900 border border-blue-500/30 rounded-lg p-6 space-y-6 text-gray-300 font-normal text-base">
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
                        <div className="mb-6 bg-gray-800 rounded-lg p-4 border border-gray-700">
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
                </li>
                <li>Upload your media file (audio or video) and transcript CSV file (supports drag and drop)</li>
                <li>Start annotating by clicking on utterances and filling in the annotation fields</li>
                <li>Export your annotated data when finished</li>
              </ol>
            </div>
          </div>
        </section>

        {/* CSV Format */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <FileSpreadsheet size={24} className="text-blue-400" />
            CSV Format Requirements
          </h2>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-3">Required Columns</h3>
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
                      <td className="px-4 py-2 text-gray-400">Speaker identifier (e.g., "S1", "S2")</td>
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

            <div>
              <h3 className="font-semibold text-lg mb-3">Example CSV</h3>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-300">
{`turn_id,speaker,start,end,utterance
1,S1,0.0,2.5,"Hello, how are you?"
2,S2,3.0,5.2,"I'm doing well, thanks!"
3,S1,6.1,8.9,"That's great to hear."`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Supported Formats */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Upload size={24} className="text-blue-400" />
            Supported Media Formats
          </h2>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-3">Audio Formats</h3>
                <ul className="space-y-1 text-gray-300">
                  <li>WAV (.wav)</li>
                  <li>MP3 (.mp3)</li>
                  <li>OGG (.ogg)</li>
                  <li>WebM (.webm)</li>
                  <li>M4A (.m4a)</li>
                  <li>AAC (.aac)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3">Video Formats</h3>
                <ul className="space-y-1 text-gray-300">
                  <li>MP4 (.mp4)</li>
                  <li>WebM (.webm)</li>
                  <li>MOV (.mov)</li>
                  <li>AVI (.avi)</li>
                  <li>MKV (.mkv)</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Keyboard Shortcuts */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Keyboard size={24} className="text-blue-400" />
            Keyboard Shortcuts
          </h2>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Play / Pause</span>
                <kbd className="px-3 py-1 bg-gray-700 border border-gray-600 rounded text-sm">Space</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Navigate annotations</span>
                <kbd className="px-3 py-1 bg-gray-700 border border-gray-600 rounded text-sm">Tab</kbd>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <MousePointer size={24} className="text-blue-400" />
            Features
          </h2>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="grid gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Schema Customization</h3>
                <p className="text-gray-400">
                  Define custom annotation columns with your own labels. Set up your schema before loading data
                  for automatic column matching.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Synchronized Playback</h3>
                <p className="text-gray-400">
                  The transcript automatically highlights the current utterance during playback. Click any
                  utterance to jump directly to that point in the media.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Drag and Drop</h3>
                <p className="text-gray-400">
                  Simply drag media and CSV files directly onto the window for quick loading.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Export Annotations</h3>
                <p className="text-gray-400">
                  Export your annotated data as a CSV file, preserving all original columns plus your annotations.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Resizable Panels</h3>
                <p className="text-gray-400">
                  Adjust the layout by dragging panel dividers to customize your workspace.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Export */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Download size={24} className="text-blue-400" />
            Exporting Data
          </h2>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 space-y-4">
            <p className="text-gray-300">
              Click the "Save Annotations" button to export your annotated data. The exported CSV will include:
            </p>
            <ul className="space-y-2 text-gray-300 list-disc list-inside">
              <li>All original transcript columns</li>
              <li>All annotation columns you defined</li>
              <li>Your annotation values for each utterance</li>
            </ul>
            <p className="text-gray-400 text-sm">
              The exported file will be named <code className="bg-gray-900 px-1 rounded">original_filename_annotated.csv</code>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
