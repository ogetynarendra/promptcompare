import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// Type definitions
interface ModelResult {
  modelId: string;
  modelName: string;
  response?: string;
  error?: string;
  speed: number;
  cost: number;
  tokens?: number;
  provider: string;
}

interface ModelConfig {
  id: string;
  name: string;
  provider: string;
  apiKey: string | undefined;
  handler: (prompt: string) => Promise<{ response: string; tokens: number }>;
}

// Initialize API clients
const groqClient = process.env.GROQ_API_KEY ? new Groq({
  apiKey: process.env.GROQ_API_KEY,
}) : null;

// Pricing per 1M tokens (approximate)
const MODEL_PRICING: Record<string, { input: number; output: number }> = {
  'groq-llama': { input: 0.05, output: 0.10 },
  'groq-mixtral': { input: 0.27, output: 0.27 },
  'gemini-pro': { input: 0.50, output: 1.50 },
  'gpt-3.5-turbo': { input: 0.50, output: 1.50 },
  'gpt-4-turbo': { input: 10.00, output: 30.00 },
  'claude-instant': { input: 0.80, output: 2.40 },
  'claude-2': { input: 8.00, output: 24.00 },
  'mistral-7b': { input: 0.25, output: 0.25 },
};

// Calculate cost based on token usage
function calculateCost(modelId: string, tokens: number): number {
  const pricing = MODEL_PRICING[modelId] || { input: 0, output: 0 };
  // Assume 50/50 split between input and output tokens for simplicity
  const avgPrice = (pricing.input + pricing.output) / 2;
  return (tokens / 1000000) * avgPrice;
}

// Groq API handler
async function callGroqAPI(prompt: string, model: string): Promise<{ response: string; tokens: number }> {
  if (!groqClient) {
    throw new Error('Groq API key not configured');
  }

  const completion = await groqClient.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: model,
    temperature: 0.7,
    max_tokens: 1024,
  });

  const response = completion.choices[0]?.message?.content || 'No response';
  const tokens = completion.usage?.total_tokens || 0;

  return { response, tokens };
}

// Mock API handler for providers without keys
async function mockAPICall(prompt: string, modelName: string): Promise<{ response: string; tokens: number }> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  const mockResponses: Record<string, string> = {
    'Gemini Pro': `[MOCK] Gemini Pro response to: "${prompt.substring(0, 50)}..."`,
    'GPT-3.5 Turbo': `[MOCK] GPT-3.5 Turbo response to: "${prompt.substring(0, 50)}..."`,
    'GPT-4 Turbo': `[MOCK] GPT-4 Turbo response to: "${prompt.substring(0, 50)}..."`,
    'Claude Instant': `[MOCK] Claude Instant response to: "${prompt.substring(0, 50)}..."`,
    'Claude 2': `[MOCK] Claude 2 response to: "${prompt.substring(0, 50)}..."`,
    'Mistral 7B': `[MOCK] Mistral 7B response to: "${prompt.substring(0, 50)}..."`,
    'Mixtral 8x7B': `[MOCK] Mixtral 8x7B response to: "${prompt.substring(0, 50)}..."`,
    'Cohere Command': `[MOCK] Cohere Command response to: "${prompt.substring(0, 50)}..."`,
    'Meta Llama 2 70B': `[MOCK] Meta Llama 2 70B response to: "${prompt.substring(0, 50)}..."`,
    'PaLM 2': `[MOCK] PaLM 2 response to: "${prompt.substring(0, 50)}..."`,
    'Yi 34B': `[MOCK] Yi 34B response to: "${prompt.substring(0, 50)}..."`,
    'DeepSeek Coder': `[MOCK] DeepSeek Coder response to: "${prompt.substring(0, 50)}..."`,
  };

  return {
    response: mockResponses[modelName] || `[MOCK] ${modelName} response`,
    tokens: Math.floor(200 + Math.random() * 300),
  };
}

// Main API call function
async function callModelAPI(modelId: string, prompt: string): Promise<ModelResult> {
  const startTime = Date.now();

  const modelMap: Record<string, { name: string; provider: string; handler: () => Promise<{ response: string; tokens: number }> }> = {
    'groq-llama': {
      name: 'Groq Llama 3',
      provider: 'Groq',
      handler: () => groqClient ? callGroqAPI(prompt, 'llama3-8b-8192') : mockAPICall(prompt, 'Groq Llama 3'),
    },
    'groq-mixtral': {
      name: 'Mixtral 8x7B',
      provider: 'Groq',
      handler: () => groqClient ? callGroqAPI(prompt, 'mixtral-8x7b-32768') : mockAPICall(prompt, 'Mixtral 8x7B'),
    },
    'gemini-pro': {
      name: 'Gemini Pro',
      provider: 'Google',
      handler: () => mockAPICall(prompt, 'Gemini Pro'),
    },
    'mistral-7b': {
      name: 'Mistral 7B',
      provider: 'Mistral',
      handler: () => mockAPICall(prompt, 'Mistral 7B'),
    },
    'claude-instant': {
      name: 'Claude Instant',
      provider: 'Anthropic',
      handler: () => mockAPICall(prompt, 'Claude Instant'),
    },
    'gpt-3.5-turbo': {
      name: 'GPT-3.5 Turbo',
      provider: 'OpenAI',
      handler: () => mockAPICall(prompt, 'GPT-3.5 Turbo'),
    },
    'cohere-command': {
      name: 'Cohere Command',
      provider: 'Cohere',
      handler: () => mockAPICall(prompt, 'Cohere Command'),
    },
    'meta-llama': {
      name: 'Meta Llama 2 70B',
      provider: 'Meta',
      handler: () => mockAPICall(prompt, 'Meta Llama 2 70B'),
    },
    'palm-2': {
      name: 'PaLM 2',
      provider: 'Google',
      handler: () => mockAPICall(prompt, 'PaLM 2'),
    },
    'gpt-4-turbo': {
      name: 'GPT-4 Turbo',
      provider: 'OpenAI',
      handler: () => mockAPICall(prompt, 'GPT-4 Turbo'),
    },
    'claude-2': {
      name: 'Claude 2',
      provider: 'Anthropic',
      handler: () => mockAPICall(prompt, 'Claude 2'),
    },
    'yi-34b': {
      name: 'Yi 34B',
      provider: '01.AI',
      handler: () => mockAPICall(prompt, 'Yi 34B'),
    },
    'deepseek-coder': {
      name: 'DeepSeek Coder',
      provider: 'DeepSeek',
      handler: () => mockAPICall(prompt, 'DeepSeek Coder'),
    },
  };

  const model = modelMap[modelId];
  if (!model) {
    throw new Error(`Unknown model: ${modelId}`);
  }

  try {
    const { response, tokens } = await model.handler();
    const endTime = Date.now();
    const speed = (endTime - startTime) / 1000;
    const cost = calculateCost(modelId, tokens);

    return {
      modelId,
      modelName: model.name,
      provider: model.provider,
      response,
      speed,
      cost,
      tokens,
    };
  } catch (error) {
    const endTime = Date.now();
    const speed = (endTime - startTime) / 1000;
    
    return {
      modelId,
      modelName: model.name,
      provider: model.provider,
      error: error instanceof Error ? error.message : 'Failed to fetch response',
      speed,
      cost: 0,
      tokens: 0,
    };
  }
}

// POST endpoint
export async function POST(request: NextRequest) {
  try {
    const { prompt, models } = await request.json();

    // Validation
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Valid prompt is required' },
        { status: 400 }
      );
    }

    if (!models || !Array.isArray(models) || models.length === 0) {
      return NextResponse.json(
        { error: 'At least one model must be selected' },
        { status: 400 }
      );
    }

    if (models.length > 10) {
      return NextResponse.json(
        { error: 'Maximum 10 models can be compared at once' },
        { status: 400 }
      );
    }

    // Call all models in parallel
    const results = await Promise.all(
      models.map((modelId: string) => callModelAPI(modelId, prompt))
    );

    return NextResponse.json({ 
      results,
      timestamp: new Date().toISOString(),
      prompt_length: prompt.length,
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// GET endpoint for health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    version: '2.0.0',
    features: {
      groq: !!groqClient,
      google: false,
      openai: false,
      anthropic: false,
      mistral: false,
    },
    supported_models: [
      'groq-llama',
      'groq-mixtral',
      'gemini-pro',
      'mistral-7b',
      'claude-instant',
      'claude-2',
      'gpt-3.5-turbo',
      'gpt-4-turbo',
      'cohere-command',
      'meta-llama',
      'palm-2',
      'yi-34b',
      'deepseek-coder',
    ],
  });
}
