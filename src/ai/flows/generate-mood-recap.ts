'use server';

/**
 * @fileOverview Generates a user-friendly mood recap message based on a free-form description using Gemini.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Input: same as your classifier — raw mood text
const GenerateMoodRecapInputSchema = z.object({
  moodDescription: z
    .string()
    .describe('A free-form text input describing how the user is feeling.'),
});
export type GenerateMoodRecapInput = z.infer<typeof GenerateMoodRecapInputSchema>;

// Output: recap message for the user
const GenerateMoodRecapOutputSchema = z.object({
  message: z
    .string()
    .describe('A friendly, empathetic message reflecting the user’s mood.'),
});
export type GenerateMoodRecapOutput = z.infer<typeof GenerateMoodRecapOutputSchema>;

// Exported function to use in your API or frontend
export async function generateMoodRecap(
  input: GenerateMoodRecapInput
): Promise<GenerateMoodRecapOutput> {
  return generateMoodRecapFlow(input);
}

// Prompt definition for Gemini
const prompt = ai.definePrompt({
  name: 'generateMoodRecapPrompt',
  input: { schema: GenerateMoodRecapInputSchema },
  output: { schema: GenerateMoodRecapOutputSchema },
  prompt: `
You're a calm and emotionally intelligent guide helping users reflect on their current mood.

Write a short, natural-sounding message that:
- Acknowledges the emotional tone of the user's description
- Feels supportive, grounded, and human — like a wise friend
- Does NOT sound overly enthusiastic or robotic
- Avoids repeating the user's exact words
- Ends with a gentle and relevant suggestion to continue their experience in the app(Do not include anything about a next page)

Mood description:
{{{moodDescription}}}

Respond with just one clear, friendly message. Do not include any headings, labels, or formatting.
`,
});

// Flow function to execute the prompt
const generateMoodRecapFlow = ai.defineFlow(
  {
    name: 'generateMoodRecapFlow',
    inputSchema: GenerateMoodRecapInputSchema,
    outputSchema: GenerateMoodRecapOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input, {
      options: {
        model: 'googleai/gemini-2.0-flash',
        temperature: 0.85,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 150,
      },
    });

    console.log('📝 Recap message generated:', output?.message);

    return output!;
  }
);