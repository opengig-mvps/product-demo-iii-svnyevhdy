import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type ReminderRequestBody = {
  snoozed: boolean;
  dateTime: string;
  description: string;
};

export async function PUT(
  request: Request,
  { params }: { params: { userId: string; reminderId: string } }
) {
  try {
    const userId = parseInt(params.userId, 10);
    const reminderId = parseInt(params.reminderId, 10);

    if (isNaN(userId) || isNaN(reminderId)) {
      return NextResponse.json({ success: false, message: 'Invalid user ID or reminder ID' }, { status: 400 });
    }

    const body: ReminderRequestBody = await request.json();
    const { snoozed, dateTime, description } = body;

    const updatedReminder = await prisma.reminder.update({
      where: {
        id: reminderId,
        userId: userId,
      },
      data: {
        snoozed: snoozed,
        dateTime: new Date(dateTime),
        description: description,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Reminder updated successfully!',
      data: updatedReminder,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error updating reminder:', error);
    return NextResponse.json({ success: false, message: 'Internal server error', data: error }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { userId: string, reminderId: string } }
) {
  try {
    const userId = parseInt(params.userId, 10);
    const reminderId = parseInt(params.reminderId, 10);

    if (isNaN(userId) || isNaN(reminderId)) {
      return NextResponse.json({ success: false, message: 'Invalid user ID or reminder ID' }, { status: 400 });
    }

    const reminder = await prisma.reminder.findFirst({
      where: {
        id: reminderId,
        userId: userId,
      },
    });

    if (!reminder) {
      return NextResponse.json({ success: false, message: 'Reminder not found' }, { status: 404 });
    }

    await prisma.reminder.delete({
      where: {
        id: reminderId,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Reminder deleted successfully!',
      data: {
        id: reminder.id,
        userId: reminder.userId,
        snoozed: reminder.snoozed,
        dateTime: reminder.dateTime.toISOString(),
        createdAt: reminder.createdAt.toISOString(),
        updatedAt: reminder.updatedAt.toISOString(),
        description: reminder.description,
      },
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error deleting reminder:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}