import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest, userAgent } from 'next/server';

export async function middleware(request: NextRequest) {
  try {
    // 1. 기기 감지 및 헤더 설정
    const { device } = userAgent(request);
    const viewport = device.type === 'mobile' ? 'mobile' : 'desktop';
    
    // 2. 초기 응답 객체 생성
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
    
    response.headers.set('x-device-type', viewport);

    // [방어 코드] 환경 변수가 없거나 가짜(Placeholder)라면 미들웨어 로직 건너뜀 (사이트 다운 방지)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
      return response;
    }

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
            response = NextResponse.next({ request });
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
      if (isAuthPage) {
        return NextResponse.redirect(new URL('/', request.url));
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('couple_id')
        .eq('id', user.id)
        .single();

      const isConnected = !!profile?.couple_id;

      if (!isConnected) {
        if (isConnectPage) return response;
        return NextResponse.redirect(new URL('/connect', request.url));
      }

      if (isConnected && isConnectPage) {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }

    return response;
  } catch (e) {
    // 미들웨어 에러 발생 시 500 대신 로그인 페이지로 안전하게 이동하거나 통과시킴
    console.error('Middleware Error:', e);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
