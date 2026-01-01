import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest, userAgent } from 'next/server';

export async function middleware(request: NextRequest) {
  // 1. 기기 감지 및 헤더 설정
  const { device } = userAgent(request);
  const viewport = device.type === 'mobile' ? 'mobile' : 'desktop';
  
  // 2. 초기 응답 객체 생성 (헤더 포함)
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
  
  // request 헤더에 설정 (서버 컴포넌트용)
  request.headers.set('x-device-type', viewport);
  // response 헤더에 설정 (클라이언트 전달용 - 필요시)
  response.headers.set('x-device-type', viewport);

  // 3. Supabase 클라이언트 생성
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          
          response = NextResponse.next({
            request,
          });
          
          // response 객체가 새로 만들어졌으므로 헤더 다시 설정
          response.headers.set('x-device-type', viewport);
          
          cookiesToSet.forEach(({ name, value, options }) => 
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 4. 세션 및 커플 연결 확인 로직
  const { data: { user } } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isAuthPage = path.startsWith('/login');
  const isConnectPage = path.startsWith('/connect');
  const isPublicPage = path.startsWith('/_next') || path.startsWith('/static') || path === '/favicon.ico' || path.startsWith('/manifest') || path.endsWith('.png') || path.endsWith('.svg');

  if (isPublicPage) return response;

  // [시나리오 1] 로그인 안 된 유저
  if (!user && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // [시나리오 2] 로그인 된 유저
  if (user) {
    // 2-1. 이미 로그인 페이지에 있다면 홈으로
    if (isAuthPage) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // 2-2. 커플 연결 여부 확인 (DB 조회)
    const { data: profile } = await supabase
      .from('profiles')
      .select('couple_id')
      .eq('id', user.id)
      .single();

    const isConnected = !!profile?.couple_id;

    // A. 연결 안 됨 -> /connect 페이지로만 접근 허용
    if (!isConnected) {
      if (isConnectPage) {
        return response;
      }
      return NextResponse.redirect(new URL('/connect', request.url));
    }

    // B. 연결 됨 -> /connect 페이지 접근 차단
    if (isConnected && isConnectPage) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
