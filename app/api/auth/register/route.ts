import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const { fullname, phone, email, password } = await request.json();

  const ifUserExist = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!ifUserExist) {
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: 'Email already exist, try another',
      }),
      { status: 409 }
    );
  }

  try {
    if (!process.env.JWT_SECRET) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: 'JWT Secret not found',
        })
      );
    }
    const encryptedPw = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: fullname,
        phone: phone,
        email: email,
        password: encryptedPw,
      },
    });
    console.log(user);

    if (user) {
      const payload = { email: email, id: user.id };
      const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
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
      return new Error('accessToken not found');
    }

    return new NextResponse(
      JSON.stringify({
        success: false,
        message: 'process exited with no response',
      })
    );
  } catch (err) {
    console.error(err);
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: `Internal Server Error`,
      })
    );
  }
}
