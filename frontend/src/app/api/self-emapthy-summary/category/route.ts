import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // 클라이언트에서 받은 요청 본문 파싱
    const requestBody = await request.json();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/self-empathy-summary/category`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error || '서버 응답이 올바르지 않습니다.' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Category API 처리 실패:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
