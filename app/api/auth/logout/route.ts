import { NextResponse } from 'next/server';

import { removeAuthToken } from '@/lib/cookies';

export async function POST() {
  try {
    await removeAuthToken();

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: 'Logged out successfully',
      }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: 'Failed to logout',
      }),
      { status: 500 }
    );
  }
}
