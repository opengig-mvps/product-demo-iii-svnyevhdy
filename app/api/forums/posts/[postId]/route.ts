import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const postId = parseInt(params.postId, 10);
    if (isNaN(postId)) {
      return NextResponse.json({ success: false, message: 'Invalid post ID' }, { status: 400 });
    }

    const forumPost = await prisma.forumPost.findFirst({
      where: { id: postId },
      include: {
        replies: {
          select: {
            id: true,
            postId: true,
            userId: true,
            content: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!forumPost) {
      return NextResponse.json({ success: false, message: 'Forum post not found' }, { status: 404 });
    }

    const responseData = {
      id: forumPost.id,
      userId: forumPost.userId,
      content: forumPost.content,
      replies: forumPost.replies,
      createdAt: forumPost.createdAt.toISOString(),
      updatedAt: forumPost.updatedAt.toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: 'Forum post retrieved successfully!',
      data: responseData,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error retrieving forum post:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}