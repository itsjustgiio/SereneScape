'use server';

import { z } from 'genkit';
import { ai } from '@/ai/genkit';

// 1. Define input schema (local only, no export)
const SoundscapePresetInputSchema = z.object({
  moodDescription: z
    .string()
    .describe("A natural language description of how the user is feeling."),
});
type SoundscapePresetInput = z.infer<typeof SoundscapePresetInputSchema>;

// 2. Define output schema (local only, no export)
const SoundscapePresetOutputSchema = z.object({
  suggestion: z
    .string()
    .describe("A suggested ambient soundscape based on the user's mood."),
});
type SoundscapePresetOutput = z.infer<typeof SoundscapePresetOutputSchema>;

// 3. Create the prompt
const prompt = ai.definePrompt({
  name: 'generateSoundscapePresetPrompt',
  input: { schema: SoundscapePresetInputSchema },
  output: { schema: SoundscapePresetOutputSchema },
  prompt: `
You're a sound therapist helping users create a calming ambient environment.

Available ambient sounds:
- Ocean Waves
- Forest Ambience
- Gentle Rain
- Morning Birds
- Night Crickets
- Cafe Buzz

Suggest 2 to 4 of these to match the user's emotional state.

Instructions:
- Be warm, supportive, and concise (1-2 sentences)
- Use the **exact sound names** as listed above
- Recommend **specific volume levels from 1-100%**
  (e.g., “Ocean Waves at 30% volume” or “Cafe Buzz at 10% volume”)
- Combine sounds that complement each other
- Do **not** list sounds irrelevant to the user's state

User's mood:
{{{moodDescription}}}

Respond with only the sound suggestions and their volume settings.
Do not include extra labels, explanation, or formatting.
`,
});

// 4. Define the flow
const generateSoundscapePresetFlow = ai.defineFlow(
  {
    name: 'generateSoundscapePresetFlow',
    inputSchema: SoundscapePresetInputSchema,
    outputSchema: SoundscapePresetOutputSchema,
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

// 5. Exported async function (valid under `"use server"`)
export async function generateSoundscapePreset(
  input: SoundscapePresetInput
): Promise<SoundscapePresetOutput> {
  return generateSoundscapePresetFlow(input);
}
