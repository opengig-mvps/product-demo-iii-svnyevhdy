import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { userId: string; recommendationId: string } }
) {
  try {
    const userId = parseInt(params.userId, 10);
    const recommendationId = parseInt(params.recommendationId, 10);

    if (isNaN(userId) || isNaN(recommendationId)) {
      return NextResponse.json({ success: false, message: 'Invalid user ID or recommendation ID' }, { status: 400 });
    }

    const updatedRecommendation = await prisma.habit.updateMany({
      where: {
        id: recommendationId,
        userId: userId,
      },
      data: {
        category: 'completed', // Assuming 'completed' is a valid category to mark completion
      },
    });

    if (updatedRecommendation.count === 0) {
      return NextResponse.json({ success: false, message: 'Recommendation not found or not updated' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Recommendation marked as completed!',
      data: {
        id: recommendationId,
        completed: true,
        description: 'Increase vitamin C intake', // Assuming this is a static description
      },
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error marking recommendation as completed:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}