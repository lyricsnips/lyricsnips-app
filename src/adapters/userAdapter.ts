import { fetcher } from "@/lib/fetcher";
import { signIn } from "next-auth/react";

interface userData {
  username: string;
  email: string;
  password: string;
}

const baseUrl = "api/users";

export async function createUser(userData: userData) {
  try {
    const res = await fetcher<{ data?: any }>(baseUrl, {
      method: "POST",
      body: userData,
    });
    return { data: res.data, error: null };
  } catch (e: any) {
    return { data: null, error: e.message || "Unknown error" };
  }
}
