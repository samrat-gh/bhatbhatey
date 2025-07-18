import type { DefaultSession, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string;
    user: {
      id?: string | null;
      name?: string | null;
      email?: string | null;
      password?: string | null;
      image?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    accessToken?: string;
    rememberMe?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    user?: {
      id?: string;
      name?: string;
      email?: string;
      [key: string]: unknown;
    };
    rememberMe?: boolean;
  }
}

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET is not set");
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        rememberMe: {},
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("creds are null");
          return null;
        }

        const res = await fetch(`${process.env.BACKEND_URL}/user/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        if (!res.ok) {
          console.log("error fetching user");
          return null;
        }

        const user = await res.json();
        console.log("user", user);

        if (user && user.accessToken) {
          // Store the access token in the user object to be handled by JWT callback
          return {
            ...user,
            accessToken: user.accessToken,
            rememberMe: credentials.rememberMe,
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.user = {
          id: user.id || undefined,
          name: user.name || undefined,
          email: user.email || undefined,
        };
        token.rememberMe = user.rememberMe;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.user && token.accessToken) {
        try {
          const res = await fetch(`${process.env.BACKEND_URL}/user/details`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token.accessToken}`,
            },
          });

          if (res.ok) {
            const userDetails = await res.json();
            console.log("returned user", userDetails);
            session.user = userDetails.data || token.user;
            session.accessToken = token.accessToken as string;
          } else {
            console.log("user fetch failed");
            session.user = token.user;
          }
        } catch (error) {
          console.log("Error fetching user details:", error);
          session.user = token.user;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    newUser: "/signup",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

export default authOptions;
