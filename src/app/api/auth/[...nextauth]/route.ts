import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";

interface Credentials {
  email: string;
  password: string;
}

const handler = NextAuth({
  // List of credential providers
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Credentials | undefined) {
        // 1. Find user by email
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
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
        return { id: user.id, username: user.username, email: user.email };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      // Attach user id to session because NextAuth only includes email and username by default,
      // but the id is needed for user-specific features and database queries.
      if (token && session.user) {
        session.user.id = token.sub ?? "";
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
