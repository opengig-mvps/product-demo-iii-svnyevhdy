import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type HabitRequestBody = {
  category: string;
  description: string;
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

    const body: HabitRequestBody = await request.json();
    const { category, description } = body;

    if (!category || !description) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const habit = await prisma.habit.create({
      data: {
        userId,
        category,
        description,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Habit logged successfully!',
      data: {
        id: habit.id,
        userId: habit.userId,
        category: habit.category,
        description: habit.description,
        createdAt: habit.createdAt.toISOString(),
        updatedAt: habit.updatedAt.toISOString(),
        dateLogged: habit.dateLogged.toISOString(),
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error logging habit:', error);
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

    const habits = await prisma.habit.findMany({
      where: { userId },
      select: {
        id: true,
        userId: true,
        category: true,
        description: true,
        dateLogged: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Habits fetched successfully!',
      data: habits,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching habits:', error);
    return NextResponse.json({ success: false, message: 'Internal server error', data: error }, { status: 500 });
  }
}