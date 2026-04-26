// 网络请求工具函数

interface FetchOptions extends RequestInit {
  timeout?: number;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/**
 * 发送 HTTP 请求
 */
export async function apiCall<T = any>(
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

    const data = await response.json();

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
          error: "请求超时，请检查网络连接",
        };
      }
      return {
        success: false,
        error: error.message || "网络请求失败",
      };
    }
    return {
      success: false,
      error: "未知错误",
    };
  }
}

/**
 * GET 请求
 */
export async function get<T = any>(
  url: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  return apiCall<T>(url, {
    ...options,
    method: "GET",
  });
}

/**
 * POST 请求
 */
export async function post<T = any>(
  url: string,
  body?: any,
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

/**
 * PUT 请求
 */
export async function put<T = any>(
  url: string,
  body?: any,
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

/**
 * DELETE 请求
 */
export async function del<T = any>(
  url: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  return apiCall<T>(url, {
    ...options,
    method: "DELETE",
  });
}

/**
 * 检查网络连接
 */
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
