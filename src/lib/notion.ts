import { Client } from '@notionhq/client';

// 정적 클라이언트 (삭제 예정 또는 마이그레이션용)
export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export const DATABASE_ID = process.env.NOTION_DATABASE_ID!;

// 동적 클라이언트 생성기 (각 커플별 키 사용)
export const createNotionClient = (apiKey: string) => {
  return new Client({ auth: apiKey });
};