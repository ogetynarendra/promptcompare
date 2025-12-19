'use client';

import { useState } from 'react';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export default function PromptInput({
  value,
  onChange,
  onSubmit,
  isLoading,
}: PromptInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      onSubmit();
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Enter Your Prompt</h2>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Type your prompt here... (Ctrl+Enter to submit)"
        className="w-full h-40 p-4 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-blue-500 focus:outline-none resize-none"
        disabled={isLoading}
      />
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-gray-400">
          Press Ctrl+Enter to submit, or click the button
        </p>
        <button
          onClick={onSubmit}
          disabled={isLoading || !value.trim()}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Comparing...' : 'Compare Models'}
        </button>
      </div>
    </div>
  );
}
