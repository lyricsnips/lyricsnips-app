import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Add id property
      username?: string | null;
    } & DefaultSession["user"];
  }
}
