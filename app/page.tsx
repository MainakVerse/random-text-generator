'use client';

import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [wordCount, setWordCount] = useState(500);

  const generateText = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text: input,
          wordCount: wordCount
        }),
      });

      const data = await response.json();
      // Handle the response data directly without array access
      setResult(data.generated_text);
    } catch (error) {
      console.error('Error:', error);
      setResult('Error generating text');
    } finally {
      setLoading(false);
    }
  };

  const getBackgroundSize = () => {
    return {
      backgroundSize: `${((wordCount - 50) * 100) / (5000 - 50)}% 100%`
    };
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-3xl">
      <style jsx>{`
        input[type="range"] {
          -webkit-appearance: none;
          height: 6px;
          background: #ddd;
          border-radius: 5px;
          background-image: linear-gradient(#3b82f6, #3b82f6);
          background-repeat: no-repeat;
        }

        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          box-shadow: 0 0 2px 0 rgba(0,0,0,0.25);
          transition: background .3s ease-in-out;
        }

        input[type="range"]::-webkit-slider-thumb:hover {
          background: #2563eb;
        }

        input[type="range"]::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 2px 0 rgba(0,0,0,0.25);
          transition: background .3s ease-in-out;
        }

        input[type="range"]::-moz-range-thumb:hover {
          background: #2563eb;
        }

        input[type="range"]::-ms-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          box-shadow: 0 0 2px 0 rgba(0,0,0,0.25);
          transition: background .3s ease-in-out;
        }

        input[type="range"]::-ms-thumb:hover {
          background: #2563eb;
        }
      `}</style>

      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-center">
          Random Text Generator
        </h1>

        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium text-gray-700">
            <span>Word Count: {wordCount}</span>
            <span>{wordCount} words</span>
          </div>
          <input
            type="range"
            min="50"
            max="5000"
            step="50"
            value={wordCount}
            onChange={(e) => setWordCount(Number(e.target.value))}
            className="w-full"
            style={getBackgroundSize()}
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>50</span>
            <span>5000</span>
          </div>
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your text here..."
          rows={4}
          className="w-full p-2 border rounded-md"
        />

        <button
          onClick={generateText}
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300 hover:bg-blue-600 transition-colors"
        >
          {loading ? 'Generating...' : 'Generate'}
        </button>

        {result && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Generated Text:</h2>
            <p className="p-4 text-black bg-gray-100 rounded">{result}</p>
          </div>
        )}
      </div>
    </main>
  );
}