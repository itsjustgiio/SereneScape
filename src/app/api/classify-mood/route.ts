import { NextRequest, NextResponse } from 'next/server';
import { classifyUserMood } from '@/ai/flows/classify-mood';

export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json();

    if (!input || typeof input !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid input' }, { status: 400 });
    }

    const result = await classifyUserMood({ moodDescription: input });
    return NextResponse.json(result);

  } catch (err: any) {
    console.error('An Error occurred while classifying mood:', err.message);
    return NextResponse.json({ error: 'Failed to classify mood', detail: err.message }, { status: 500 });
  }
}