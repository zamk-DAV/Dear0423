import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; // 주의: 여기선 service_role 키를 쓰는 admin 클라이언트가 필요할 수 있음

export async function GET() {
  try {
    // 3일(72시간) 이전 메시지 삭제
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
    
    // RLS 우회를 위해 Service Role 키 필요하지만, 
    // 여기서는 일단 public access로 가정하거나 추후 admin 클라이언트 도입
    const { error, count } = await supabase
      .from('messages')
      .delete({ count: 'exact' })
      .lt('created_at', threeDaysAgo);

    if (error) throw error;

    return NextResponse.json({ success: true, deleted: count });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
