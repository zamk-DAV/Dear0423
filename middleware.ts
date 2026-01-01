import { type NextRequest, NextResponse, userAgent } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const { device } = userAgent(request);
  const viewport = device.type === 'mobile' ? 'mobile' : 'desktop';
  
  // 헤더에 기기 정보 추가
  request.headers.set('x-device-type', viewport);

  // 기존 세션 체크 로직 실행 (response 객체에 헤더가 전달되도록 처리)
  const response = await updateSession(request);
  
  // updateSession이 리다이렉트나 응답을 반환할 경우 헤더를 심어서 보냄
  response.headers.set('x-device-type', viewport);
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
