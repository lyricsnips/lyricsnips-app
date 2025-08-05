import { fetcher } from "@/lib/fetcher";

interface UserData {
  username: string;
  password: string;
}

interface ApiResponse<T> {
  data?: T;
}

interface ErrorResponse {
  message: string;
}

const baseUrl = "/api/users";

export async function createUser(userData: UserData) {
  try {
    const res = await fetcher<ApiResponse<{ success: boolean }>>(baseUrl, {
      method: "POST",
      body: userData,
    });

    console.log(res);
    return { data: res.data, error: null };
  } catch (e: unknown) {
    const error = e as ErrorResponse;
    return { data: null, error: error.message || "Unknown error" };
  }
}
