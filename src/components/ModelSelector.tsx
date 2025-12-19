'use client';

import { useState } from 'react';

interface ModelSelectorProps {
  selectedModels: string[];
  onModelChange: (models: string[]) => void;
}

const AVAILABLE_MODELS = [
  { id: 'groq-llama', name: 'Groq Llama 3', provider: 'Groq' },
  { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google' },
  { id: 'mistral-7b', name: 'Mistral 7B', provider: 'Mistral' },
  { id: 'claude-instant', name: 'Claude Instant', provider: 'Anthropic' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI' },
];

export default function ModelSelector({
  selectedModels,
  onModelChange,
}: ModelSelectorProps) {
  const toggleModel = (modelId: string) => {
    if (selectedModels.includes(modelId)) {
      onModelChange(selectedModels.filter((id) => id !== modelId));
    } else {
      onModelChange([...selectedModels, modelId]);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Select Models to Compare</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {AVAILABLE_MODELS.map((model) => (
          <button
            key={model.id}
            onClick={() => toggleModel(model.id)}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedModels.includes(model.id)
                ? 'border-blue-500 bg-blue-500/20'
                : 'border-gray-400 hover:border-gray-300'
            }`}
          >
            <div className="text-lg font-semibold">{model.name}</div>
            <div className="text-sm text-gray-300">{model.provider}</div>
          </button>
        ))}
      </div>
      <p className="mt-4 text-sm text-gray-400">
        {selectedModels.length} model(s) selected
      </p>
    </div>
  );
}
