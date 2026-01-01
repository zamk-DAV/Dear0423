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
    // 성능 최적화: 쿠키나 메타데이터에 couple_id가 있다면 DB 조회 스킵 가능하지만,
    // 확실한 정합성을 위해 여기서는 가벼운 쿼리를 날립니다.
    const { data: profile } = await supabase
      .from('profiles')
      .select('couple_id')
      .eq('id', user.id)
      .single();

    const isConnected = !!profile?.couple_id;

    // 연결 안 됨 -> /connect 페이지로 강제 이동 (단, 이미 거기 있으면 통과)
    if (!isConnected && !isConnectPage) {
      return NextResponse.redirect(new URL('/connect', request.url));
    }

    // 연결 됨 -> /connect 페이지 접근 차단 (홈으로)
    if (isConnected && isConnectPage) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return response;
}
