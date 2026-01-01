'use server';

import { notion, DATABASE_ID } from '@/lib/notion';

export interface FeedItem {
  id: string;
  title: string;
  preview?: string;
  imageUrl?: string;
  date: string;
  writer: string;
  likes: number; // 노션 체크박스 여부 (true=1, false=0)
}

// 1. 최신 피드 글 가져오기
export const getRecentFeeds = async (limit = 5): Promise<FeedItem[]> => {
  try {
    const response = await (notion.databases as any).query({
      database_id: DATABASE_ID,
      page_size: limit,
      sorts: [
        {
          property: 'dear23_작성날짜', // 날짜 기준 내림차순
          direction: 'descending',
        },
      ],
      // 필터: 피드 타입만 가져오기 (Type 속성이 있다면)
      // filter: { property: 'Type', select: { equals: 'Feed' } } 
    });

    return response.results.map((page: any) => {
      const props = page.properties;
      
      // 이미지 URL 추출 (Files & Media 속성)
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
        writer: 'Partner', // 작성자 구분 로직은 추후 고도화
        likes: props.dear23_좋아요?.checkbox ? 1 : 0,
      };
    });
  } catch (error) {
    console.error('Notion Fetch Error:', error);
    return [];
  }
};

// 2. 새 글 작성하기 (피드/일기)
export const createFeed = async (content: string, imageUrl?: string) => {
  try {
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
      // Type 속성은 노션 DB에 미리 만들어둬야 함
      // 'Type': { select: { name: 'Feed' } }, 
    };

    // 이미지가 있다면 속성에 추가
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

    await notion.pages.create({
      parent: { database_id: DATABASE_ID },
      properties: properties,
    });

    return { success: true };
  } catch (error) {
    console.error('Notion Create Error:', error);
    throw new Error('글 작성에 실패했습니다.');
  }
};
