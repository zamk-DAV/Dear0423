'use server';

import { createNotionClient } from '@/lib/notion';
import { createClient } from '@/lib/supabase/server'; 

export interface FeedItem {
  id: string;
  title: string;
  preview?: string;
  imageUrl?: string;
  date: string;
  writer: string;
  likes: number;
}

// 헬퍼: 현재 유저의 커플 노션 정보 가져오기
async function getCoupleNotionInfo() {
  const supabase = await createClient();
  
  // 1. 유저 확인
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('로그인이 필요합니다.');

  // 2. 프로필 -> 커플 ID 확인
  const { data: profile } = await supabase
    .from('profiles')
    .select('couple_id')
    .eq('id', user.id)
    .single();
  
  if (!profile?.couple_id) throw new Error('커플 연결이 필요합니다.');

  // 3. 커플 테이블 -> 노션 키 확인
  const { data: couple } = await supabase
    .from('couples')
    .select('notion_api_key, notion_database_id')
    .eq('id', profile.couple_id)
    .single();

  if (!couple?.notion_api_key || !couple?.notion_database_id) {
    throw new Error('Notion 연결 정보가 없습니다.');
  }

  return {
    client: createNotionClient(couple.notion_api_key),
    dbId: couple.notion_database_id
  };
}

// 1. 최신 피드 글 가져오기
export const getRecentFeeds = async (limit = 5): Promise<FeedItem[]> => {
  try {
    const { client, dbId } = await getCoupleNotionInfo();

    const response = await (client.databases as any).query({
      database_id: dbId,
      page_size: limit,
      sorts: [
        {
          property: 'dear23_작성날짜',
          direction: 'descending',
        },
      ],
    });

    return response.results.map((page: any) => {
      const props = page.properties;
      
      let imageUrl = '';
      if (props.dear23_대표이미지?.files?.length > 0) {
        imageUrl = props.dear23_대표이미지.files[0].file?.url || props.dear23_대표이미지.files[0].external?.url;
      }

      return {
        id: page.id,
        title: props.이름?.title[0]?.plain_text || '제목 없음',
        preview: props.dear23_내용미리보기?.rich_text[0]?.plain_text || '',
        imageUrl,
        date: props.dear23_작성날짜?.date?.start || new Date().toISOString(),
        writer: 'Partner', 
        likes: props.dear23_좋아요?.checkbox ? 1 : 0,
      };
    });
  } catch (error) {
    console.error('Notion Fetch Error:', error);
    return [];
  }
};

// 2. 새 글 작성하기
export const createFeed = async (content: string, imageUrl?: string) => {
  try {
    const { client, dbId } = await getCoupleNotionInfo();
    const title = content.length > 20 ? content.slice(0, 20) + '...' : content;

    const properties: any = {
      '이름': {
        title: [{ text: { content: title } }],
      },
      'dear23_내용미리보기': {
        rich_text: [{ text: { content: content } }],
      },
      'dear23_작성날짜': {
        date: { start: new Date().toISOString() },
      },
    };

    if (imageUrl) {
      properties['dear23_대표이미지'] = {
        files: [
          {
            name: 'cover',
            type: 'external',
            external: { url: imageUrl },
          },
        ],
      };
    }

    await client.pages.create({
      parent: { database_id: dbId },
      properties: properties,
    });

    return { success: true };
  } catch (error) {
    console.error('Notion Create Error:', error);
    throw new Error('글 작성에 실패했습니다.');
  }
};