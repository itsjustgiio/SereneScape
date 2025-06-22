'use server';

/**
 * @fileOverview Generates personalized affirmations based on user-provided goals and challenges using Gemini.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateAffirmationsInputSchema = z.object({
  goals: z
    .string()
    .describe('User-specified goals for their mindfulness journey.'),
  challenges: z
    .string()
    .describe('Challenges the user faces in achieving their goals.'),
});
export type GenerateAffirmationsInput = z.infer<typeof GenerateAffirmationsInputSchema>;

const GenerateAffirmationsOutputSchema = z.object({
  affirmations: z
    .string()
    .describe('Personalized affirmations generated based on the user goals and challenges.'),
});
export type GenerateAffirmationsOutput = z.infer<typeof GenerateAffirmationsOutputSchema>;

export async function generatePersonalizedAffirmations(
  input: GenerateAffirmationsInput
): Promise<GenerateAffirmationsOutput> {
  return generateAffirmationsFlow(input);
}

const toneModifiers = [
  'Keep the tone grounded and encouraging.',
  'Write like a calm inner voice that supports daily change.',
  'Use clear, direct, emotionally supportive language.',
  'Keep affirmations short and practical — easy to say and remember.',
  'Sound like a wise friend, not a poet.',
];
const randomTone = toneModifiers[Math.floor(Math.random() * toneModifiers.length)];

const prompt = ai.definePrompt({
  name: 'generateAffirmationsPrompt',
  input: { schema: GenerateAffirmationsInputSchema },
  output: { schema: GenerateAffirmationsOutputSchema },
  prompt: `You are an AI affirmation coach. Based on the user's personal goals and challenges, generate 5 short, unique affirmations.

GOALS: {{{goals}}}
CHALLENGES: {{{challenges}}}

STYLE: ${randomTone}

❗IMPORTANT:
- Do NOT say "I'm sorry" or "I cannot generate..."
- Always return 5 affirmations.
- Do not include commentary or explanation.
- Each affirmation must be on a new line.

Begin response:
Affirmations:

`,
});

// Flow function that executes the prompt
const generateAffirmationsFlow = ai.defineFlow(
  {
    name: 'generateAffirmationsFlow',
    inputSchema: GenerateAffirmationsInputSchema,
    outputSchema: GenerateAffirmationsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input, {
  options: {
    model: 'googleai/gemini-2.0-flash',
    temperature: 0.95,
    topK: 40,
    topP: 1,
    maxOutputTokens: 300,
  },
});
    return output!;
  }
);