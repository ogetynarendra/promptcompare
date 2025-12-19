'use client';

interface Result {
  modelId: string;
  modelName: string;
  response: string;
  speed: number;
  cost: number;
  error?: string;
}

interface ResultsDisplayProps {
  results: Result[];
  isLoading: boolean;
}

export default function ResultsDisplay({
  results,
  isLoading,
}: ResultsDisplayProps) {
  if (isLoading) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
        <p className="text-center text-gray-400">
          Select models and enter a prompt to see results
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Comparison Results</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((result) => (
          <div
            key={result.modelId}
            className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-gray-600"
          >
            <h3 className="text-xl font-semibold mb-2">{result.modelName}</h3>
            {result.error ? (
              <p className="text-red-400">Error: {result.error}</p>
            ) : (
              <>
                <div className="text-sm text-gray-300 mb-2">
                  <p>Speed: {result.speed.toFixed(2)}s</p>
                  <p>Cost: ${result.cost.toFixed(4)}</p>
                </div>
                <div className="bg-gray-800 p-3 rounded-lg max-h-60 overflow-y-auto">
                  <p className="text-sm whitespace-pre-wrap">{result.response}</p>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
