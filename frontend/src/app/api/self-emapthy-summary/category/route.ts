import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await fetch('http://43.202.198.184:8080/api/self-empathy-summary/category', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      return NextResponse.json({ error: '카테고리 요청 실패' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('카테고리 요청 중 오류:', error);
    return NextResponse.json({ error: '카테고리 요청 중 오류가 발생했습니다.' }, { status: 500 });
  }
} 