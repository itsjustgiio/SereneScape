'use server';

export type GenerateAffirmationsInput = {
  goals: string;
  challenges: string;
};

export type GenerateAffirmationsOutput = {
  affirmations: string;
};

/**
 * Generates unique affirmations by randomly adjusting tone, language style, and request phrasing.
 */
export async function generatePersonalizedAffirmations(
  input: GenerateAffirmationsInput
): Promise<GenerateAffirmationsOutput> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  // 🎨 A list of prompt styles to introduce real variation in tone
  const styles = [
    'Use a poetic and introspective tone.',
    'Write as a gentle but confident coach.',
    'Imagine these are mantras written on sticky notes.',
    'Keep the tone relaxed, conversational, and emotionally honest.',
    'Use expressive language — but stay short and meaningful.',
    'Each affirmation should sound like it belongs in a meditation app.',
    'Affirmations should feel calming, present-focused, and self-loving.',
  ];

  const randomStyle = styles[Math.floor(Math.random() * styles.length)];

  // 🧠 Prompt dynamically varies in structure and style every time
  const prompt = `
You are an expert affirmation generator. Based on the user's input, write 5 affirmations that are supportive, original, and emotionally resonant.

GOALS: ${input.goals}
CHALLENGES: ${input.challenges}

STYLE: ${randomStyle}

Respond with 5 short affirmations, one per line.
Do not include explanations or commentary.
Seed: ${Date.now()}
`;

  const result = await tryFetchGemini(baseUrl, prompt);

  return {
    affirmations:
      result ?? 'Unexpected error. Please try again with different input.',
  };
}

async function tryFetchGemini(baseUrl: string, inputPrompt: string): Promise<string | null> {
  try {
    const response = await fetch(`${baseUrl}/api/gemini`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
body: JSON.stringify({ input: inputPrompt }),
    });

    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
  } catch (error) {
    console.error('Gemini fetch error:', error);
    return null;
  }
}
