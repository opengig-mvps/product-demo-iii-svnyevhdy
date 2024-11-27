import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Define the type for the request body
type ForumPostRequestBody = {
  content: string;
};

// Define the POST method handler for creating a forum post
export async function POST(request: Request) {
  try {
    // Parse the request body
    const body: ForumPostRequestBody = await request.json();

    // Validate the content
    const { content } = body;
    if (!content) {
      return NextResponse.json({ success: false, message: 'Content is required' }, { status: 400 });
    }

    // Assuming userId is obtained from session or authentication context
    const userId = 123; // Replace with actual userId retrieval logic

    // Create the forum post
    const forumPost = await prisma.forumPost.create({
      data: {
        content,
        userId,
      },
    });

    // Send a success response with the created forum post object
    return NextResponse.json({
      success: true,
      message: 'Forum post created successfully!',
      data: {
        id: forumPost.id,
        userId: forumPost.userId,
        content: forumPost.content,
        createdAt: forumPost.createdAt.toISOString(),
        updatedAt: forumPost.updatedAt.toISOString(),
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating forum post:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}