import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*', // 프론트엔드에서 /api/로 시작하는 요청을
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`, // 배포된 백엔드로 프록시
      },
    ];
  },
  // 개발 환경에서 허용할 오리진을 명시적으로 설정
  allowedDevOrigins: ['192.168.0.28'],
  /* config options here */
};

export default nextConfig;
