import { Client } from '@notionhq/client';

// 정적 클라이언트 (빌드 타임 에러 방지)
export const notion = new Client({
  auth: process.env.NOTION_API_KEY || 'secret_placeholder',
});

export const DATABASE_ID = process.env.NOTION_DATABASE_ID || 'placeholder_id';

// 동적 클라이언트 생성기 (각 커플별 키 사용)
export const createNotionClient = (apiKey: string) => {
  return new Client({ auth: apiKey });
};
