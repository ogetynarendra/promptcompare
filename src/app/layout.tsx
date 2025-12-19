import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PromptCompare - Compare LLM Models',
  description: 'Compare 5+ free LLM models side-by-side. Test prompts across Groq, Gemini, Mistral, and more - see speed, cost, and quality instantly. 100% free to start.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
