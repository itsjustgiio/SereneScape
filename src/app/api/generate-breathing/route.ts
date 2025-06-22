import { generateBreathingPreset } from '@/ai/flows/generate-breathing';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const result = await generateBreathingPreset(body);

    return NextResponse.json(result);
  } catch (error) {
    console.error('❌ API error in /api/generate-breathing:', error);
    return NextResponse.json({ error: 'Failed to generate breathing preset' }, { status: 500 });
  }
}