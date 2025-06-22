import { NextRequest, NextResponse } from 'next/server';
import { generateMoodRecap } from '@/ai/flows/generate-mood-recap';

export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json();

    if (!input || typeof input !== 'string') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const result = await generateMoodRecap({ moodDescription: input });
    return NextResponse.json(result);

  } catch (err: any) {
    console.error("❌ Error in /api/generate-mood-recap:", err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}