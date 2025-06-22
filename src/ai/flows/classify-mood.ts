'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Schemas
const ClassifyMoodInputSchema = z.object({
  moodDescription: z
    .string()
    .describe('A free-form text input describing how the user is feeling.'),
});
export type ClassifyMoodInput = z.infer<typeof ClassifyMoodInputSchema>;

const ClassifyMoodOutputSchema = z.object({
  category: z
    .enum(['positive', 'neutral', 'negative'])
    .describe('The classified emotional tone of the input.'),
});
export type ClassifyMoodOutput = z.infer<typeof ClassifyMoodOutputSchema>;

// Exported function
export async function classifyUserMood(
  input: ClassifyMoodInput
): Promise<ClassifyMoodOutput> {
  return classifyMoodFlow(input);
}

// Prompt
const prompt = ai.definePrompt({
  name: 'classifyMoodPrompt',
  input: { schema: ClassifyMoodInputSchema },
  output: { schema: ClassifyMoodOutputSchema },
  prompt: `
You are a mood analysis assistant. Based only on the following mood description from the user, respond with one word: "positive", "neutral", or "negative".

Mood:
{{{moodDescription}}}

❗IMPORTANT:
- Respond with only one word: "positive", "neutral", or "negative".
- Do not include any explanation or extra characters.
- Use your best judgment if the mood is unclear.
- You must return exactly one of the three words, nothing else.

Begin response:
`,
});

// Flow with strict validation
const classifyMoodFlow = ai.defineFlow(
  {
    name: 'classifyMoodFlow',
    inputSchema: ClassifyMoodInputSchema,
    outputSchema: ClassifyMoodOutputSchema,
  },
  async (input) => {
    console.log('📥 Received mood input:', input.moodDescription);

    const { output } = await prompt(input, {
      options: {
        model: 'googleai/gemini-2.0-flash',
        temperature: 0.2,
        topK: 10,
        topP: 0.95,
        maxOutputTokens: 20,
      },
    });

    // Handle if AI goes out of its way
    if (!output || !['positive', 'neutral', 'negative'].includes(output.category)) {
      console.error('❌ Invalid Gemini output:', output);
      throw new Error(`Gemini returned an invalid category: ${JSON.stringify(output)}`);
    }
    
    //Debugging
    const emojiMap = {
        positive: '😊',
        neutral: '😐',
        negative: '😞',
    };

    console.log(`Final classified category: ${output.category} ${emojiMap[output.category]}`);
    return output;
  }
);