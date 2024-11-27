import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type SemenReportRequestBody = {
  count: number;
  notes?: string;
  motility: number;
  morphology: number;
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

    const body: SemenReportRequestBody = await request.json();

    const { count, notes, motility, morphology } = body;
    if (count === undefined || motility === undefined || morphology === undefined) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const semenReport = await prisma.semenReport.create({
      data: {
        userId,
        count,
        motility,
        morphology,
        notes,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Semen report logged successfully!',
      data: {
        id: semenReport.id,
        count: semenReport.count,
        notes: semenReport.notes,
        userId: semenReport.userId,
        motility: semenReport.motility,
        createdAt: semenReport.createdAt.toISOString(),
        updatedAt: semenReport.updatedAt.toISOString(),
        morphology: semenReport.morphology,
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating semen report:', error);
    return NextResponse.json({ success: false, message: 'Internal server error', data: error }, { status: 500 });
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

    const semenReports = await prisma.semenReport.findMany({
      where: { userId: userId },
      select: {
        id: true,
        count: true,
        motility: true,
        morphology: true,
        notes: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Semen reports fetched successfully!',
      data: semenReports,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching semen reports:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}