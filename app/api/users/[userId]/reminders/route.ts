import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type ReminderRequestBody = {
  dateTime: string;
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

    const body: ReminderRequestBody = await request.json();
    const { dateTime, description } = body;
    if (!dateTime || !description) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const reminder = await prisma.reminder.create({
      data: {
        userId,
        dateTime: new Date(dateTime),
        description,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Reminder created successfully!',
      data: {
        id: reminder.id,
        userId: reminder.userId,
        snoozed: reminder.snoozed,
        dateTime: reminder.dateTime.toISOString(),
        createdAt: reminder.createdAt.toISOString(),
        updatedAt: reminder.updatedAt.toISOString(),
        description: reminder.description,
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating reminder:', error);
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

    const reminders = await prisma.reminder.findMany({
      where: { userId: userId },
      select: {
        id: true,
        userId: true,
        snoozed: true,
        dateTime: true,
        createdAt: true,
        updatedAt: true,
        description: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Reminders fetched successfully!',
      data: reminders,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching reminders:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}