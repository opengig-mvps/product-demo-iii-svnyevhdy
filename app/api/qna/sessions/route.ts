import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const sessions = await prisma.qnASession.findMany({
      select: {
        id: true,
        title: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        description: true,
        scheduledDate: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Q&A sessions retrieved successfully!",
      data: sessions,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error retrieving Q&A sessions:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
    }, { status: 500 });
  }
}