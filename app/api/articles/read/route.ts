import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type ArticleReadRequestBody = {
  userId: number;
  articleId: number;
};

export async function POST(request: Request) {
  try {
    const body: ArticleReadRequestBody = await request.json();

    const { userId, articleId } = body;

    if (!userId || !articleId) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const articleRead = await prisma.articleRead.create({
      data: {
        userId,
        articleId,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Article marked as read successfully!',
      data: {
        id: articleRead.id,
        userId: articleRead.userId,
        articleId: articleRead.articleId,
        createdAt: articleRead.createdAt.toISOString(),
        updatedAt: articleRead.updatedAt.toISOString(),
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error marking article as read:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}