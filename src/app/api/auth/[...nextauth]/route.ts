import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";

interface Credentials {
  username: string;
  password: string;
}

export const authOptions: NextAuthOptions = {
  // List of credential providers
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Credentials | undefined) {
        // 1. Find user by username
        const user = await prisma.user.findUnique({
          where: { username: credentials?.username },
        });

        // 2. If no user or password doesn't match, return null
        if (
          !user ||
          (credentials &&
            !(await compare(credentials.password, user.password_hash)))
        ) {
          return null;
        }

        // 3. Return user object (omit password)
        return { id: user.id, username: user.username };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = (user as unknown as { username: string }).username;
      }
      return token;
    },
    async session({ session, token }) {
      // Attach user id to session because NextAuth only includes email and username by default,
      // but the id is needed for user-specific features and database queries.
      if (token && session.user) {
        session.user.id = token.sub ?? "";
        session.user.username =
          typeof token.username === "string" ? token.username : "";
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
