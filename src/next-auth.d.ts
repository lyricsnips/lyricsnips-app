import NextAuth, { DefaultSession } from "next-auth";

// Extend the default session type
declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Add id property
      name?: string | null;
      email?: string | null;
      // ...add any other properties you need
    } & DefaultSession["user"];
  }
}
