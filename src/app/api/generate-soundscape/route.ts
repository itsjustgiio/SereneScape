import { NextRequest, NextResponse } from 'next/server';
import { generateSoundscapePreset } from '@/ai/flows/generate-soundscape';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const result = await generateSoundscapePreset({
      moodDescription: body.input,
    });

    return NextResponse.json({ suggestion: result.suggestion });
  } catch (err) {
    console.error('❌ Error generating soundscape preset:', err);
    return NextResponse.json({ error: 'Failed to generate soundscape suggestion' }, { status: 500 });
  }
}
