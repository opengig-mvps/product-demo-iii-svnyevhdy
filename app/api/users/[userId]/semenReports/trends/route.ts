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

    const semenReports = await prisma.semenReport.findMany({
      where: { userId },
      select: {
        createdAt: true,
        count: true,
        motility: true,
      },
    });

    const trends = {
      metrics: [
        {
          metric: 'count',
          dataPoints: semenReports.map(report => ({
            date: report.createdAt.toISOString().split('T')[0],
            value: report.count,
          })),
        },
        {
          metric: 'motility',
          dataPoints: semenReports.map(report => ({
            date: report.createdAt.toISOString().split('T')[0],
            value: report.motility,
          })),
        },
      ],
    };

    return NextResponse.json({
      success: true,
      message: 'Trends fetched successfully!',
      data: trends,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching trends:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}