interface FetchOptions extends RequestInit {
  timeout?: number;
}

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

type ErrorBody = {
  message?: string;
};

export async function apiCall<T = unknown>(
  url: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  const { timeout = 10000, ...fetchOptions } = options;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = (await response.json()) as T & ErrorBody;

    if (!response.ok) {
      return {
        success: false,
        error: data.message || `HTTP Error: ${response.status}`,
        message: data.message,
      };
    }

    return {
      success: true,
      data,
      message: data.message,
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        return {
          success: false,
          error: "Request timed out. Please check your connection.",
        };
      }

      return {
        success: false,
        error: error.message || "Request failed",
      };
    }

    return {
      success: false,
      error: "Unknown error",
    };
  }
}

export async function get<T = unknown>(
  url: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  return apiCall<T>(url, {
    ...options,
    method: "GET",
  });
}

export async function post<T = unknown>(
  url: string,
  body?: unknown,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  return apiCall<T>(url, {
    ...options,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function put<T = unknown>(
  url: string,
  body?: unknown,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  return apiCall<T>(url, {
    ...options,
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function del<T = unknown>(
  url: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  return apiCall<T>(url, {
    ...options,
    method: "DELETE",
  });
}

export async function checkConnection(): Promise<boolean> {
  try {
    const response = await fetch("/api/health", {
      method: "HEAD",
      cache: "no-store",
    });
    return response.ok;
  } catch {
    return false;
  }
}
