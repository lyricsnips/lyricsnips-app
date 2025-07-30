import { fetcher } from "@/lib/fetcher";

export async function getShares() {
  try {
    const res = await fetcher<{ data?: any }>(`api/shares`, {
      method: "GET",
    });
    return { data: res, error: null };
  } catch (e: any) {
    return { data: null, error: e.message || "Unknown error" };
  }
}

export async function deleteShare(shareId: string) {
  try {
    const res = await fetcher<{ data?: any }>(`api/shares/${shareId}`, {
      method: "DELETE",
    });
    return { data: res, error: null };
  } catch (e: any) {
    return { data: null, error: e.message || "Unknown error" };
  }
}
