'use server';

import { cookies } from 'next/headers';

export async function setAuthToken(token: string, rememberMe: boolean = false) {
  const cookieStore = await cookies();

  if (rememberMe) {
    cookieStore.set('token', token, {
      maxAge: 24 * 60 * 60 * 30, // 30 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
  } else {
    cookieStore.set('token', token, {
      maxAge: 2 * 60 * 60, // 2 hours
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
  }
}

export async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get('token')?.value;
}

export async function removeAuthToken() {
  const cookieStore = await cookies();
  cookieStore.delete('token');
}
