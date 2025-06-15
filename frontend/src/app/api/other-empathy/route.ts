import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 백엔드 API 호출
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/other-empathy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!backendResponse.ok) {
      throw new Error(`Backend API error: ${backendResponse.status}`);
    }

    const data = await backendResponse.json();

    return NextResponse.json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error('Other empathy API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}
