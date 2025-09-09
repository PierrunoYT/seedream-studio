"use client";

import { useState } from "react";

export default function Studio() {
  const [apiKey, setApiKey] = useState("");
  const [prompt, setPrompt] = useState("American retro style: a girl wearing a polka-dot dress with sunglasses adorning her head.");
  const [size, setSize] = useState("2048*2048");
  const [seed, setSeed] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState("");
  const [resultUrl, setResultUrl] = useState("");

  const runModel = async () => {
    if (!apiKey) {
      setStatus("Your API_KEY is not set, you can check it in Access Keys");
      return;
    }

    setIsGenerating(true);
    setStatus("Submitting task...");
    setResultUrl("");

    const url = "https://api.wavespeed.ai/api/v3/bytedance/seedream-v4";
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    };
    const payload = {
      "enable_base64_output": false,
      "enable_sync_mode": false,
      "prompt": prompt,
      "size": size,
      ...(seed && { "seed": parseInt(seed) })
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const result = await response.json();
        const requestId = result.data.id;
        setStatus(`Task submitted successfully. Request ID: ${requestId}`);

        while (true) {
          const response = await fetch(
            `https://api.wavespeed.ai/api/v3/predictions/${requestId}/result`,
            {
              headers: {
                "Authorization": `Bearer ${apiKey}`
              }
            });
          const result = await response.json();

          if (response.ok) {
            const data = result.data;
            const status = data.status;

            if (status === "completed") {
              const resultUrl = data.outputs[0];
              setStatus("Task completed!");
              setResultUrl(resultUrl);
              break;
            } else if (status === "failed") {
              setStatus(`Task failed: ${data.error}`);
              break;
            } else {
              setStatus(`Task still processing. Status: ${status}`);
            }
          } else {
            setStatus(`Error: ${response.status} ${JSON.stringify(result)}`);
            break;
          }

          await new Promise(resolve => setTimeout(resolve, 0.1 * 1000));
        }
      } else {
        setStatus(`Error: ${response.status}, ${await response.text()}`);
      }
    } catch (error) {
      setStatus(`Request failed: ${error}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-light text-white text-center mb-8">Seedream Studio</h1>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 space-y-6">
          <div>
            <label className="block text-white mb-2">API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Your Wavespeed API Key"
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40"
            />
          </div>

          <div>
            <label className="block text-white mb-2">Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40"
            />
          </div>

          <div>
            <label className="block text-white mb-2">Size</label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white focus:outline-none focus:border-white/40 hover:bg-white/15 transition-all duration-200 cursor-pointer appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cg==')] bg-no-repeat bg-right bg-[center_right_12px] pr-10"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(8px)'
              }}
            >
              <option value="512*512" style={{ backgroundColor: 'rgba(88, 28, 135, 0.95)', color: 'white' }}>512x512</option>
              <option value="768*768" style={{ backgroundColor: 'rgba(88, 28, 135, 0.95)', color: 'white' }}>768x768</option>
              <option value="1024*1024" style={{ backgroundColor: 'rgba(88, 28, 135, 0.95)', color: 'white' }}>1024x1024</option>
              <option value="1024*1536" style={{ backgroundColor: 'rgba(88, 28, 135, 0.95)', color: 'white' }}>1024x1536 (Portrait)</option>
              <option value="1536*1024" style={{ backgroundColor: 'rgba(88, 28, 135, 0.95)', color: 'white' }}>1536x1024 (Landscape)</option>
              <option value="2048*2048" style={{ backgroundColor: 'rgba(88, 28, 135, 0.95)', color: 'white' }}>2048x2048</option>
            </select>
          </div>

          <div>
            <label className="block text-white mb-2">Seed (Optional)</label>
            <input
              type="number"
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
              placeholder="Leave empty for random seed"
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40"
            />
          </div>

          <button
            onClick={runModel}
            disabled={isGenerating}
            className="w-full py-3 bg-white/20 hover:bg-white/30 disabled:bg-white/10 border border-white/20 rounded-lg text-white font-light tracking-wide transition-all duration-300 backdrop-blur-sm disabled:cursor-not-allowed"
          >
            {isGenerating ? "Generating..." : "Generate Image"}
          </button>

          {status && (
            <div className="p-4 bg-white/10 rounded-lg">
              <p className="text-white text-sm">{status}</p>
            </div>
          )}

          {resultUrl && (
            <div className="text-center">
              <img
                src={resultUrl}
                alt="Generated image"
                className="max-w-full h-auto rounded-lg mx-auto"
              />
              <a
                href={resultUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 px-6 py-2 bg-white/20 hover:bg-white/30 border border-white/20 rounded-lg text-white font-light transition-all duration-300"
              >
                Open Full Size
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
