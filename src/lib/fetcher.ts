export interface FetcherOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
  responseType?: "json" | "blob";
}

export async function fetcher<T>(
  url: RequestInfo,
  options: FetcherOptions = {}
): Promise<T> {
  const { method = "GET", body, headers = {}, responseType = "json" } = options;

  const fetchOptions: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  if (body !== undefined) {
    fetchOptions.body = typeof body === "string" ? body : JSON.stringify(body);
  }

  const res = await fetch(url, fetchOptions);

  if (!res.ok) {
    let errorMsg = `Fetch error: ${res.status} ${res.statusText}`;
    try {
      const errorData = await res.json();
      if (errorData.error) errorMsg = errorData.error;
    } catch (e) {
      console.error("Error parsing error response:", e);
    }
    throw new Error(errorMsg);
  }

  if (responseType === "blob") {
    return (await res.blob()) as T;
  }
  return await res.json();
}
