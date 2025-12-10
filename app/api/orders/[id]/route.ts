import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

import { getAuthToken } from '@/lib/cookies';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let token = request.headers.get('Authorization')?.split(' ')[1];

  // If no token in header, try to get from cookies
  if (!token) {
    token = await getAuthToken();
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: 'JWT Secret not found',
        }),
        { status: 500 }
      );
    }

    if (!token) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: 'Token not found',
        }),
        { status: 401 }
      );
    }

    const unsignedUser = jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
    };

    if (!unsignedUser.email) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: 'Invalid token',
        }),
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: unsignedUser.email,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: 'User not found',
        }),
        { status: 404 }
      );
    }

    const body = await request.json();
    const { action } = body;

    if (action !== 'cancel') {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: 'Invalid action',
        }),
        { status: 400 }
      );
    }

    // Check if order exists and belongs to user

    const orderId = (await params).id;
    const order = await prisma.orders.findFirst({
      where: {
        id: orderId,
        userId: user.id,
      },
      include: {
        rental: true,
      },
    });

    if (!order) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: 'Order not found',
        }),
        { status: 404 }
      );
    }

    if (order.status !== 'PENDING') {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: 'Order cannot be cancelled',
        }),
        { status: 400 }
      );
    }

    // Update order and rental status
    await prisma.$transaction(async (tx) => {
      await tx.orders.update({
        where: { id: orderId },
        data: { status: 'CANCELLED' },
      });

      await tx.rental.update({
        where: { id: order.rentalId },
        data: { status: 'CANCELLED' },
      });
    });

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: 'Order cancelled successfully',
      })
    );
  } catch (err: any) {
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: err?.message || 'Something went wrong!',
      }),
      { status: 500 }
    );
  }
}
