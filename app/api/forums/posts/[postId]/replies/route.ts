import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type ReplyRequestBody = {
  content: string;
};

export async function POST(
  request: Request,
  { params }: { params: { postId: string, userId: string } }
) {
  try {
    const postId = parseInt(params.postId, 10);
    const userId = parseInt(params.userId, 10);

    if (isNaN(postId) || isNaN(userId)) {
      return NextResponse.json({ success: false, message: 'Invalid post ID or user ID' }, { status: 400 });
    }

    const body: ReplyRequestBody = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json({ success: false, message: 'Content is required' }, { status: 400 });
    }

    const post = await prisma.forumPost.findFirst({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ success: false, message: 'Post not found' }, { status: 404 });
    }

    const reply = await prisma.forumReply.create({
      data: {
        content,
        postId,
        userId,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Reply created successfully!',
      data: {
        id: reply.id,
        postId: reply.postId,
        userId: reply.userId,
        content: reply.content,
        createdAt: reply.createdAt.toISOString(),
        updatedAt: reply.updatedAt.toISOString(),
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating reply:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}