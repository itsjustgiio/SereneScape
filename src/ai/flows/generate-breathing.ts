'use server';

import { z } from 'genkit';
import { ai } from '@/ai/genkit';

// 1. Define input schema
const BreathingPresetInputSchema = z.object({
  moodDescription: z
    .string()
    .describe('A natural language description of how the user is feeling.'),
});
export type BreathingPresetInput = z.infer<typeof BreathingPresetInputSchema>;

// 2. Define output schema
const BreathingPresetOutputSchema = z.object({
  suggestion: z
    .string()
    .describe('A suggested breathing technique based on the user\'s mood.'),
});
export type BreathingPresetOutput = z.infer<typeof BreathingPresetOutputSchema>;

// 3. Define prompt
const prompt = ai.definePrompt({
  name: 'generateBreathingPresetPrompt',
  input: { schema: BreathingPresetInputSchema },
  output: { schema: BreathingPresetOutputSchema },
  prompt: `
You're a mindful breathing coach helping users select the most suitable breathing technique and interval durations based on their current emotional state.

Techniques available:
- Box Breathing: Equal inhale, hold, exhale, hold (e.g., 4s each).
- 4-7-8 Breathing: Inhale 4s, hold 7s, exhale 8s.
- Deep Abdominal Breathing: Inhale deeply, then exhale slowly (e.g., inhale 5s, exhale 7s).

Instructions:
- Recommend **only one** breathing technique.
- Mention the technique **by name**.
- Suggest **personalized durations** for the breathing steps (inhale, hold, exhale) based on the user's emotional state.
- Format your response as **one warm and calming sentence** that includes the name of the technique and the suggested durations.
- Keep the tone gentle and soothing.
- Do **not** list all the techniques.
- Do **not** explain how each technique works.
- Do **not** include any formatting or lists.

User's mood:
{{{moodDescription}}}

Respond with only the suggestion sentence, nothing else.
`,
});
// 4. Define flow
const generateBreathingPresetFlow = ai.defineFlow(
  {
    name: 'generateBreathingPresetFlow',
    inputSchema: BreathingPresetInputSchema,
    outputSchema: BreathingPresetOutputSchema,
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

// 5. Export
export const generateBreathingPreset = generateBreathingPresetFlow;