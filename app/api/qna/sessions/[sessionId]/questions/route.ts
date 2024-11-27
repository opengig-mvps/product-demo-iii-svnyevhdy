import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type QuestionRequestBody = {
  question: string;
};

export async function POST(
  request: Request,
  { params }: { params: { sessionId: string } }
) {
  try {
    const sessionId = parseInt(params.sessionId, 10);
    if (isNaN(sessionId)) {
      return NextResponse.json({ success: false, message: 'Invalid session ID' }, { status: 400 });
    }

    const body: QuestionRequestBody = await request.json();
    const question = String(body.question);

    if (!question) {
      return NextResponse.json({ success: false, message: 'Question is required' }, { status: 400 });
    }

    const session = await prisma.qnASession.findFirst({
      where: { id: sessionId },
    });

    if (!session) {
      return NextResponse.json({ success: false, message: 'Session not found' }, { status: 404 });
    }

    const newQuestion = await prisma.qnASession.create({
      data: {
        title: question,
        description: '',
        scheduledDate: new Date(),
        userId: session.userId,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Question submitted successfully!',
      data: {
        id: newQuestion.id,
        userId: newQuestion.userId,
        question: newQuestion.title,
        createdAt: newQuestion.createdAt.toISOString(),
        sessionId: sessionId,
        updatedAt: newQuestion.updatedAt.toISOString(),
      },
    }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}