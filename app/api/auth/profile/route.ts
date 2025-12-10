import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

import { getAuthToken } from '@/lib/cookies';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
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
          _count: {
            select: {
              orders: true,
              rentals: true,
            },
          },
        },
      });

      if (user) {
        return new NextResponse(
          JSON.stringify({
            success: true,
            message: 'Profile fetched successfully',
            user,
          })
        );
      } else {
        return new NextResponse(
          JSON.stringify({
            success: false,
            message: "Couldn't fetch user profile",
          }),
          { status: 404 }
        );
      }
    } else {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: 'Invalid token',
        }),
        { status: 401 }
      );
    }
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

export async function PUT(request: NextRequest) {
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

    const body = await request.json();
    const { name, phone } = body;

    if (!name || !phone) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: 'Name and phone are required',
        }),
        { status: 400 }
      );
    }

    if (unsignedUser.email) {
      const updatedUser = await prisma.user.update({
        where: {
          email: unsignedUser.email,
        },
        data: {
          name,
          phone,
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          createdAt: true,
          _count: {
            select: {
              orders: true,
              rentals: true,
            },
          },
        },
      });

      return new NextResponse(
        JSON.stringify({
          success: true,
          message: 'Profile updated successfully',
          user: updatedUser,
        })
      );
    } else {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: 'Invalid token',
        }),
        { status: 401 }
      );
    }
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
