import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

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
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 1. 사용자 세션 확인
  const { data: { user } } = await supabase.auth.getUser();

  // 2. 현재 경로 확인
  const path = request.nextUrl.pathname;
  const isAuthPage = path.startsWith('/login');
  const isConnectPage = path.startsWith('/connect');
  const isPublicPage = path.startsWith('/_next') || path.startsWith('/static') || path === '/favicon.ico';

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
    // 미들웨어에서 DB 조회는 비용이 들지만, 보안을 위해 필수적임.
    const { data: profile } = await supabase
      .from('profiles')
      .select('couple_id')
      .eq('id', user.id)
      .single();

    const isConnected = !!profile?.couple_id;

    // A. 연결 안 됨 -> /connect 페이지로만 접근 허용
    if (!isConnected) {
      // 이미 /connect 페이지에 있다면 통과
      if (isConnectPage) {
        return response;
      }
      // 다른 페이지(홈 등)로 가려하면 /connect로 납치
      return NextResponse.redirect(new URL('/connect', request.url));
    }

    // B. 연결 됨 -> /connect 페이지 접근 차단 (이미 커플이니까)
    if (isConnected && isConnectPage) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return response;
}
