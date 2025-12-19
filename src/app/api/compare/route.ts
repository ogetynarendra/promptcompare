import { NextRequest, NextResponse } from 'next/server';

// Mock API function - replace with actual API calls
async function callModelAPI(modelId: string, prompt: string) {
  const startTime = Date.now();
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  const endTime = Date.now();
  const speed = (endTime - startTime) / 1000;
  
  // Mock responses
  const responses: Record<string, string> = {
    'groq-llama': 'This is a mock response from Groq Llama 3. In production, this would be replaced with actual API calls.',
    'gemini-pro': 'This is a mock response from Gemini Pro. In production, this would be replaced with actual API calls.',
    'mistral-7b': 'This is a mock response from Mistral 7B. In production, this would be replaced with actual API calls.',
    'claude-instant': 'This is a mock response from Claude Instant. In production, this would be replaced with actual API calls.',
    'gpt-3.5-turbo': 'This is a mock response from GPT-3.5 Turbo. In production, this would be replaced with actual API calls.',
  };

  return {
    response: responses[modelId] || 'Unknown model',
    speed,
    cost: Math.random() * 0.01, // Mock cost
  };
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, models } = await request.json();

    if (!prompt || !models || models.length === 0) {
      return NextResponse.json(
        { error: 'Prompt and models are required' },
        { status: 400 }
      );
    }

    // Call all models in parallel
    const results = await Promise.all(
      models.map(async (modelId: string) => {
        try {
          const { response, speed, cost } = await callModelAPI(modelId, prompt);
          
          const modelNames: Record<string, string> = {
            'groq-llama': 'Groq Llama 3',
            'gemini-pro': 'Gemini Pro',
            'mistral-7b': 'Mistral 7B',
            'claude-instant': 'Claude Instant',
            'gpt-3.5-turbo': 'GPT-3.5 Turbo',
          };

          return {
            modelId,
            modelName: modelNames[modelId] || modelId,
            response,
            speed,
            cost,
          };
        } catch (error) {
          return {
            modelId,
            modelName: modelId,
            error: 'Failed to fetch response',
            speed: 0,
            cost: 0,
          };
        }
      })
    );

    return NextResponse.json({ results });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
