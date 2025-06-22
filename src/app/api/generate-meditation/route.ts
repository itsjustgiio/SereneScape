import { generateMeditationPreset } from '@/ai/flows/generate-meditation';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { input } = await req.json();

  try {
    const result = await generateMeditationPreset({ moodDescription: input });
    return NextResponse.json(result);
  } catch (err) {
    console.error('❌ Meditation generation failed:', err);
    return NextResponse.json({ error: 'Failed to generate meditation suggestion.' }, { status: 500 });
  }
}