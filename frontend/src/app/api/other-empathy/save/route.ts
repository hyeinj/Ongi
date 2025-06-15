export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/other-empathy/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error('타인공감 저장에 실패했습니다.');
    }

    const data = await response.json();

    return Response.json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error('타인공감 저장 오류:', error);
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '타인공감 저장에 실패했습니다.',
      },
      { status: 500 }
    );
  }
}
