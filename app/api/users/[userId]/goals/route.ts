import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type GoalRequestBody = {
  metric: string;
  targetValue: number;
};

export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = parseInt(params.userId, 10);
    if (isNaN(userId)) {
      return NextResponse.json({ success: false, message: 'Invalid user ID' }, { status: 400 });
    }

    const body: GoalRequestBody = await request.json();
    const { metric, targetValue } = body;

    if (!metric || targetValue === undefined) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const goal = await prisma.goal.create({
      data: {
        userId,
        metric,
        targetValue,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Goal created successfully!',
      data: {
        id: goal.id,
        metric: goal.metric,
        achieved: goal.achieved,
        createdAt: goal.createdAt.toISOString(),
        updatedAt: goal.updatedAt.toISOString(),
        targetValue: goal.targetValue,
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating goal:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = parseInt(params.userId, 10);
    if (isNaN(userId)) {
      return NextResponse.json({ success: false, message: 'Invalid user ID' }, { status: 400 });
    }

    const goals = await prisma.goal.findMany({
      where: { userId },
      select: {
        id: true,
        metric: true,
        targetValue: true,
        achieved: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Goals fetched successfully!',
      data: goals,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching goals:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}