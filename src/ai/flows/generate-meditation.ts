'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MeditationPresetInputSchema = z.object({
  moodDescription: z.string().describe('A natural language description of how the user is feeling.'),
});
export type MeditationPresetInput = z.infer<typeof MeditationPresetInputSchema>;

const MeditationPresetOutputSchema = z.object({
  suggestion: z.string().describe('A personalized meditation type or approach to help the user.'),
});
export type MeditationPresetOutput = z.infer<typeof MeditationPresetOutputSchema>;

const prompt = ai.definePrompt({
  name: 'generateMeditationPresetPrompt',
  input: { schema: MeditationPresetInputSchema },
  output: { schema: MeditationPresetOutputSchema },
  prompt: `
You're an assistant helping users choose a guided meditation that fits their current mood.

Only choose from one of these sessions:
- Morning Gratitude
- Stress Reduction
- Body Scan

Consider:
- If the user is feeling anxious or overwhelmed → suggest "Stress Reduction"
- If the user feels down or stuck → suggest "Morning Gratitude"
- If the user feels scattered or tense in their body → suggest "Body Scan"

Your response should be:
- Friendly, short (1-2 sentences)
- Explain **why** that meditation is a good fit
- Include the **exact name** of the meditation so we can match it in the UI

User's mood:
{{{moodDescription}}}

Respond with only the suggestion.
Do not include any extra text or formatting.
`,
});

const generateMeditationPresetFlow = ai.defineFlow(
  {
    name: 'generateMeditationPresetFlow',
    inputSchema: MeditationPresetInputSchema,
    outputSchema: MeditationPresetOutputSchema,
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

    return output!;
  }
);

export const generateMeditationPreset = generateMeditationPresetFlow;