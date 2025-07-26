import { cookies } from 'next/headers';
import type { DefaultSession, NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    accessToken?: string;
    user: {
      id?: string | null;
      name?: string | null;
      email?: string | null;
      password?: string | null;
      image?: string | null;
    } & DefaultSession['user'];
  }
}

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('NEXTAUTH_SECRET is not set');
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        rememberMe: {},
      },
      async authorize(credentials) {
        const cookieStore = await cookies();

        if (!credentials?.email || !credentials?.password) {
          console.log('creds are null');
          return null;
        }

        const res = await fetch(
          `${process.env.HOST_URL}/api/auth/login?email=${credentials.email}&password=${credentials.password}`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        );

        if (!res.ok) {
          console.log('error fetching user');
        }
        const user = await res.json();
        console.log('user', user);
        if (user) {
          if (credentials.rememberMe) {
            cookieStore.set('token', `${user?.token}`, {
              maxAge: 24 * 60 * 60 * 30,
            });
          } else {
            cookieStore.set('token', `${user?.token}`, {
              maxAge: 2 * 60 * 60, //2 hours session
            });
          }
          return user;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      const cookieStore = await cookies();

      const accessToken = cookieStore.get('token')?.value;
      // console.log('token2', token.user?.token ?? '');
      // console.log('token1', accessToken);
      // console.log('Bearer', `Bearer ${accessToken ?? token.token}`);

      if (accessToken || token.user) {
        // console.log(accessToken, token.user);
        const res = await fetch(`${process.env.HOST_URL}/api/auth/me`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken ?? token.user?.token}`,
          },
        });

        if (!res.ok) {
          console.log('user fetch failed');
        }

        const user = await res.json();

        session.user = token.user;
        return {
          ...session,
          user: {
            ...user.user,
          },
        };
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    newUser: '/signup',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

export default authOptions;
