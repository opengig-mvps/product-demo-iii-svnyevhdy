import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = parseInt(params.userId, 10);
    if (isNaN(userId)) {
      return NextResponse.json({ success: false, message: 'Invalid user ID' }, { status: 400 });
    }

    const semenReport = await prisma.semenReport.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        count: true,
        motility: true,
        morphology: true,
      },
    });

    if (!semenReport) {
      return NextResponse.json({ success: false, message: 'No semen health metrics found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Semen health metrics fetched successfully!',
      data: {
        count: semenReport.count,
        motility: semenReport.motility,
        morphology: semenReport.morphology,
      },
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching semen health metrics:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}