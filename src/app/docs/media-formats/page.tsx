'use client';

export default function MediaFormatsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Supported Media Formats</h1>

      <div className="space-y-8">
        {/* Audio & Video Formats */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Audio Formats</h2>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="text-green-400 font-semibold">MP3 (.mp3)</span>
                  <span className="text-xs bg-green-900/30 text-green-300 px-2 py-0.5 rounded">Recommended</span>
                </li>
                <li>WAV (.wav)</li>
                <li>OGG (.ogg)</li>
                <li>WebM (.webm)</li>
                <li>M4A (.m4a)</li>
                <li>AAC (.aac)</li>
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4">Video Formats</h2>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="text-green-400 font-semibold">MP4 (.mp4)</span>
                  <span className="text-xs bg-green-900/30 text-green-300 px-2 py-0.5 rounded">Recommended</span>
                </li>
                <li>WebM (.webm)</li>
                <li>MOV (.mov)</li>
                <li>AVI (.avi)</li>
                <li>MKV (.mkv)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* File Size Recommendations */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-300">File Size Recommendations</h2>
          <div className="space-y-4 text-gray-300">
            <p>
              <strong className="text-white">MP3</strong> and <strong className="text-white">MP4</strong> formats are highly compressed and provide fast processing with smaller file sizes.
            </p>
            <ul className="space-y-2 ml-4 list-disc list-inside">
              <li><strong className="text-green-400">Optimal performance:</strong> Keep files under 500 MB</li>
              <li><strong className="text-yellow-400">Maximum recommended:</strong> 1 GB</li>
              <li><strong className="text-red-400">Warning:</strong> Files over 1 GB may cause slow processing or browser performance issues as all data is processed in-browser memory</li>
            </ul>
          </div>
        </div>

        {/* CSV File Size */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">CSV Transcript Files</h2>
          <p className="text-gray-300">
            Keep CSV files under <strong className="text-white">10 MB</strong> for best performance. Large transcripts with thousands of rows may cause UI lag.
          </p>
        </div>

        {/* Browser Compatibility */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Browser Compatibility</h2>
          <p className="text-gray-400 mb-4">
            Media playback relies on browser HTML5 support. For best compatibility:
          </p>
          <ul className="space-y-2 text-gray-300 list-disc list-inside">
            <li>Use Chrome, Firefox, Safari, or Edge (latest versions)</li>
            <li>MP4 with H.264 codec has the widest support</li>
            <li>MP3 audio is universally supported</li>
            <li>Some older formats (AVI, MKV) may require browser plugins</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
