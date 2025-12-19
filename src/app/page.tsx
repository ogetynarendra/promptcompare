'use client';

import { useState } from 'react';
import ModelSelector from '@/components/ModelSelector';
import PromptInput from '@/components/PromptInput';
import ResultsDisplay from '@/components/ResultsDisplay';

export default function Home() {
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [prompt, setPrompt] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleCompare = async () => {
    if (!prompt || selectedModels.length === 0) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, models: selectedModels }),
      });

      const data = await response.json();
      setResults(data.results);
    } catch (error) {
      console.error('Error comparing models:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-5xl font-bold text-center mb-4">
          PromptCompare
        </h1>
        <p className="text-xl text-center mb-8 text-gray-300">
          Compare 5+ free LLM models side-by-side instantly
        </p>

        <div className="max-w-6xl mx-auto space-y-6">
          <ModelSelector
            selectedModels={selectedModels}
            onModelChange={setSelectedModels}
          />

          <PromptInput
            value={prompt}
            onChange={setPrompt}
            onSubmit={handleCompare}
            isLoading={isLoading}
          />

          <ResultsDisplay results={results} isLoading={isLoading} />
        </div>
      </div>
    </main>
  );
}
