import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const email = req?.nextUrl.searchParams.get('email');
  const password = req?.nextUrl.searchParams.get('password');

  const cookieStore = await cookies();

  if (!email || !password) {
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: `Email or Password doesn't exist`,
      })
    );
  }

  const ifUserExist = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!ifUserExist) {
    console.log('NO User Exist');
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "User doesn't exist",
      }),
      { status: 404 }
    );
  } else {
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (user) {
      const isPasswordMatched = await bcrypt.compare(
        password,
        user?.password ?? ''
      );

      if (!isPasswordMatched) {
        console.log(`password doesn't match`);
        return new NextResponse(
          JSON.stringify({
            success: false,
            message: 'invalid password, try again',
          })
        );
      }

      const JWT_SECRET = process.env.JWT_SECRET;

      if (!JWT_SECRET) {
        throw new Error('JWT Secret not found');
      }
      const payload = { email: email, id: user.id };
      const access_token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: '7d',
      });

      if (access_token) {
        cookieStore.set('token', access_token);
        return new NextResponse(
          JSON.stringify({
            success: true,
            user: user,
            token: access_token,
          })
        );
      }
    } else {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: 'Access token not found',
        }),
        { status: 500 }
      );
    }
  }
}
