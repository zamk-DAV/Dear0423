import { supabase } from '@/lib/supabase';
import { nanoid } from 'nanoid';

// 초대 코드 생성 (난수 6자리) + Notion 정보 임시 저장
export const createInvitation = async (userId: string, notionApiKey: string, notionDatabaseId: string) => {
  const code = nanoid(6).toUpperCase(); // 예: 'X7K9P2'
  
  const { data, error } = await supabase
    .from('invitations')
    .insert({
      code,
      sender_id: userId,
      notion_api_key: notionApiKey,
      notion_database_id: notionDatabaseId,
      // 10분 뒤 만료
      expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString()
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// 초대 코드 입력 및 커플 연결 (트랜잭션급 처리)
export const joinCouple = async (userId: string, code: string) => {
  // 1. 코드 검증
  const { data: invite, error: inviteError } = await supabase
    .from('invitations')
    .select('*')
    .eq('code', code.toUpperCase())
    .gt('expires_at', new Date().toISOString()) // 만료 안 된 것만
    .single();

  if (inviteError || !invite) throw new Error('유효하지 않거나 만료된 코드입니다.');
  if (invite.sender_id === userId) throw new Error('자신의 코드는 입력할 수 없습니다.');

  // 2. 새 커플 행 생성 (초대장에 있던 노션 정보 이관)
  const { data: newCouple, error: coupleError } = await supabase
    .from('couples')
    .insert({
      d_day: new Date().toISOString(), // 오늘부터 1일
      notion_api_key: invite.notion_api_key,
      notion_database_id: invite.notion_database_id
    })
    .select()
    .single();

  if (coupleError) throw coupleError;

  // 3. 두 사용자의 profile 업데이트 (couple_id 할당)
  // A (초대자) 업데이트
  await supabase.from('profiles').update({ couple_id: newCouple.id, status: 'COUPLED' }).eq('id', invite.sender_id);
  // B (참여자) 업데이트
  await supabase.from('profiles').update({ couple_id: newCouple.id, status: 'COUPLED' }).eq('id', userId);

  // 4. 사용된 초대장 삭제
  await supabase.from('invitations').delete().eq('id', invite.id);

  return newCouple;
};
