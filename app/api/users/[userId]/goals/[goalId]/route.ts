import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type GoalRequestBody = {
  metric: string;
  targetValue: number;
};

export async function PATCH(
  request: Request,
  { params }: { params: { userId: string; goalId: string } }
) {
  try {
    const userId = parseInt(params.userId, 10);
    const goalId = parseInt(params.goalId, 10);

    if (isNaN(userId) || isNaN(goalId)) {
      return NextResponse.json({ success: false, message: 'Invalid user ID or goal ID' }, { status: 400 });
    }

    const body: GoalRequestBody = await request.json();
    const { metric, targetValue } = body;

    if (!metric || targetValue === undefined) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const updatedGoals = await prisma.goal.updateMany({
      where: {
        id: goalId,
        userId: userId,
      },
      data: {
        metric,
        targetValue,
        updatedAt: new Date(),
      },
    });

    if (updatedGoals.count === 0) {
      return NextResponse.json({ success: false, message: 'Goal not found or not updated' }, { status: 404 });
    }

    const updatedGoal = await prisma.goal.findFirst({
      where: {
        id: goalId,
        userId: userId,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Goal updated successfully!',
      data: {
        id: updatedGoal?.id,
        metric: updatedGoal?.metric,
        achieved: updatedGoal?.achieved,
        createdAt: updatedGoal?.createdAt.toISOString(),
        updatedAt: updatedGoal?.updatedAt.toISOString(),
        targetValue: updatedGoal?.targetValue,
      },
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error updating goal:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { userId: string, goalId: string } }
) {
  try {
    const userId = parseInt(params.userId, 10);
    const goalId = parseInt(params.goalId, 10);

    if (isNaN(userId) || isNaN(goalId)) {
      return NextResponse.json({ success: false, message: 'Invalid user ID or goal ID' }, { status: 400 });
    }

    const goal = await prisma.goal.findFirst({
      where: {
        id: goalId,
        userId: userId,
      },
    });

    if (!goal) {
      return NextResponse.json({ success: false, message: 'Goal not found' }, { status: 404 });
    }

    await prisma.goal.delete({
      where: {
        id: goalId,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Goal deleted successfully!',
      data: {
        id: goal.id,
        metric: goal.metric,
        achieved: goal.achieved,
        createdAt: goal.createdAt.toISOString(),
        updatedAt: goal.updatedAt.toISOString(),
        targetValue: goal.targetValue,
      },
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error deleting goal:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}