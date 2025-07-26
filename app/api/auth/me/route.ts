import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const token = request.headers.get('Authorization')?.split(' ')[1];

  try {
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: 'JWT Secret not found',
        })
      );
    }

    if (!token) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: 'token not found',
        })
      );
    }

    const unsignedUser = (await jwt.verify(token, JWT_SECRET)) as {
      id: string;
      email: string;
    };

    if (unsignedUser.email) {
      const user = await prisma.user.findUnique({
        where: {
          email: unsignedUser.email,
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          createdAt: true,
        },
      });

      if (user) {
        return new NextResponse(
          JSON.stringify({
            success: true,
            message: 'user fetched successfully',
            user,
          })
        );
      } else {
        return new NextResponse(
          JSON.stringify({
            success: false,
            message: `couldn't fetch user, try again`,
          }),
          { status: 409 }
        );
      }
    } else {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: 'invalid token',
        })
      );
    }
  } catch (err: any) {
    console.log('Error', err);
    return {
      success: false,
      messsage: err?.message || 'something went wrong!',
    };
  }
}
