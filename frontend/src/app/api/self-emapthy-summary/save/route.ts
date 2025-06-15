import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 백엔드로 요청 전송
    const response = await fetch('http://43.202.198.184:8080/api/self-empathy-summary/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error || '서버 응답이 올바르지 않습니다.' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // 성공 시 localStorage에 저장 (브라우저가 아닌 서버 환경이므로 클라이언트에서 처리해야 함)
    return NextResponse.json({
      ...data,
      shouldSaveToLocalStorage: true, // 클라이언트에서 처리할 플래그 추가
    });
  } catch (error) {
    console.error('Self-empathy save API 처리 실패:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
