import type {
  User,
  UserUpdate,
  TokenResponse,
  Post,
  PostCreate,
  Topic,
  TopicCreate,
  Comment,
  CommentCreate,
  Project,
  ProjectCreate,
  Portfolio,
  PortfolioCreate,
  Service,
  Inquiry,
  InquiryCreate,
  InquiryUpdate,
  Order,
  OrderCreate,
  OrderUpdate,
} from "@/lib/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// 常量定义
const USER_KEY = "user";
const TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refreshToken";

// Token 刷新锁，防止同时多个请求刷新 token 导致无限循环
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];
const REFRESH_TIMEOUT_MS = 10000; // 刷新超时 10 秒

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

// API 错误类型
interface ApiError {
  detail?: string;
  message?: string;
}

// Token 响应类型（包含 refresh_token）
interface TokenResponseWithRefresh extends TokenResponse {
  refresh_token: string;
}

// Post 列表响应类型
interface PostListResponse {
  posts: Post[];
  total: number;
  page: number;
  limit: number;
}

// Token 管理
export const tokenManager = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  removeToken: () => localStorage.removeItem(TOKEN_KEY),
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  setRefreshToken: (token: string) => localStorage.setItem(REFRESH_TOKEN_KEY, token),
  removeRefreshToken: () => localStorage.removeItem(REFRESH_TOKEN_KEY),
  clearAll: () => {
    tokenManager.removeToken();
    tokenManager.removeRefreshToken();
    localStorage.removeItem(USER_KEY);
  },
};

// 用户信息管理
export const userManager = {
  getUser: (): User | null => {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },
  setUser: (user: User) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  removeUser: () => localStorage.removeItem(USER_KEY),
};

// 错误提示
export function showError(message: string): void {
  if (typeof window !== "undefined") {
    alert(message);
  }
  console.error(message);
}

export function showSuccess(message: string): void {
  if (typeof window !== "undefined") {
    const toast = document.createElement("div");
    toast.className = "fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50 animate-fade-in";
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }
}

// 获取认证 Header
function getAuthHeaders(): Record<string, string> {
  const token = tokenManager.getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// 刷新 Token
async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = tokenManager.getRefreshToken();
  if (!refreshToken) {
    return false;
  }

  // 如果已经在刷新中，等待刷新完成，带超时保护
  if (isRefreshing) {
    return new Promise((resolve) => {
      const timeoutId = setTimeout(() => {
        // 超时后移除订阅并返回 false
        refreshSubscribers = refreshSubscribers.filter((cb) => cb !== onTokenRefreshed);
        resolve(false);
      }, REFRESH_TIMEOUT_MS);

      subscribeTokenRefresh((newToken) => {
        clearTimeout(timeoutId);
        resolve(true);
      });
    });
  }

  isRefreshing = true;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REFRESH_TIMEOUT_MS);

    const response = await fetch(`${API_BASE}/api/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      tokenManager.setToken(data.access_token);
      onTokenRefreshed(data.access_token);
      return true;
    } else {
      // 刷新失败，清除所有令牌
      tokenManager.clearAll();
      // 延迟重定向，让当前请求完成
      setTimeout(() => {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("auth:logout"));
        }
      }, 100);
      return false;
    }
  } catch {
    return false;
  } finally {
    isRefreshing = false;
  }
}

// 基础请求函数（带自动重试机制和超时控制）
const MAX_REFRESH_RETRIES = 1;
const REQUEST_TIMEOUT_MS = 15000; // 15秒超时

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  refreshRetries: number = MAX_REFRESH_RETRIES
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;

  // 创建超时控制器
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
        ...options.headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

  // 如果是 401 错误，尝试刷新 token 后重试
  if (response.status === 401 && refreshRetries > 0) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      // 重新发起请求，减少重试次数
      return request<T>(endpoint, options, refreshRetries - 1);
    }
  }

  // 如果重试后仍然 401，说明 token 刷新也失败
  if (response.status === 401 && refreshRetries === 0) {
    tokenManager.clearAll();
    setTimeout(() => {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("auth:logout"));
      }
    }, 100);
    throw new Error("登录已过期，请重新登录");
  }

  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({ detail: "请求失败" }));
    const message = error.detail || error.message || "请求失败";
    showError(message);
    throw new Error(message);
  }

  // 处理空响应
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }
  return {} as T;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error("请求超时，请稍后重试");
    }
    throw error;
  }
}

// 认证 API
export const authApi = {
  login: async (email: string, password: string): Promise<TokenResponse> => {
    const response = await request<TokenResponseWithRefresh>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    tokenManager.setToken(response.access_token);
    if (response.refresh_token) {
      tokenManager.setRefreshToken(response.refresh_token);
    }
    return response;
  },

  register: async (email: string, password: string, name: string): Promise<TokenResponse> => {
    const response = await request<TokenResponseWithRefresh>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    });
    tokenManager.setToken(response.access_token);
    if (response.refresh_token) {
      tokenManager.setRefreshToken(response.refresh_token);
    }
    return response;
  },

  logout: (): void => {
    tokenManager.clearAll();
  },

  getCurrentUser: async (): Promise<User> => {
    return request<User>("/api/auth/me");
  },

  refreshToken: async (): Promise<{ access_token: string }> => {
    const refreshToken = tokenManager.getRefreshToken();
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }
    const response = await request<{ access_token: string }>("/api/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    tokenManager.setToken(response.access_token);
    return response;
  },

  isAuthenticated: (): boolean => {
    return !!tokenManager.getToken();
  },

  isAdmin: (): boolean => {
    const user = userManager.getUser();
    return user?.role === "ADMIN";
  },
};

// 博客 API
export const blogApi = {
  list: async (params?: { page?: number; limit?: number; search?: string }): Promise<PostListResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    if (params?.search) searchParams.set("search", params.search);
    const query = searchParams.toString() ? `?${searchParams.toString()}` : "";
    return request<PostListResponse>(`/api/blog/posts${query}`);
  },

  get: async (slug: string): Promise<Post> => {
    return request<Post>(`/api/blog/posts/${slug}`);
  },

  create: async (data: PostCreate): Promise<Post> => {
    return request<Post>("/api/blog/posts", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (slug: string, data: Partial<PostCreate>): Promise<Post> => {
    return request<Post>(`/api/blog/posts/${slug}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (slug: string): Promise<void> => {
    return request<void>(`/api/blog/posts/${slug}`, { method: "DELETE" });
  },
};

// 论坛 API
export const forumApi = {
  listTopics: async (params?: { page?: number; limit?: number }): Promise<Topic[]> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    const query = searchParams.toString() ? `?${searchParams.toString()}` : "";
    return request<Topic[]>(`/api/forum/topics${query}`);
  },

  getTopic: async (id: number): Promise<Topic> => {
    return request<Topic>(`/api/forum/topics/${id}`);
  },

  createTopic: async (data: TopicCreate): Promise<Topic> => {
    return request<Topic>("/api/forum/topics", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getComments: async (topicId: number): Promise<Comment[]> => {
    return request<Comment[]>(`/api/forum/topics/${topicId}/comments`);
  },

  addComment: async (topicId: number, data: CommentCreate): Promise<Comment> => {
    return request<Comment>(`/api/forum/topics/${topicId}/comments`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // 管理员端点
  adminListTopics: async (search?: string): Promise<Topic[]> => {
    const searchParams = new URLSearchParams();
    if (search) searchParams.set("search", search);
    const query = searchParams.toString() ? `?${searchParams.toString()}` : "";
    return request<Topic[]>(`/api/forum/admin/topics${query}`);
  },

  adminDeleteTopic: async (id: number): Promise<void> => {
    return request<void>(`/api/forum/admin/topics/${id}`, { method: "DELETE" });
  },

  adminListComments: async (): Promise<Comment[]> => {
    return request<Comment[]>("/api/forum/admin/comments");
  },

  adminDeleteComment: async (id: number): Promise<void> => {
    return request<void>(`/api/forum/admin/comments/${id}`, { method: "DELETE" });
  },
};

// 项目 API
export const projectApi = {
  list: async (params?: { featured?: boolean }): Promise<Project[]> => {
    const searchParams = new URLSearchParams();
    if (params?.featured !== undefined) {
      searchParams.set("featured", String(params.featured));
    }
    const query = searchParams.toString() ? `?${searchParams.toString()}` : "";
    return request<Project[]>(`/api/projects${query}`);
  },

  get: async (slug: string): Promise<Project> => {
    return request<Project>(`/api/projects/${slug}`);
  },

  create: async (data: ProjectCreate): Promise<Project> => {
    return request<Project>("/api/projects", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (slug: string, data: Partial<ProjectCreate>): Promise<Project> => {
    return request<Project>(`/api/projects/${slug}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (slug: string): Promise<void> => {
    return request<void>(`/api/projects/${slug}`, { method: "DELETE" });
  },
};

// 作品集 API
export const portfolioApi = {
  list: async (params?: { category?: string }): Promise<Portfolio[]> => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set("category", params.category);
    const query = searchParams.toString() ? `?${searchParams.toString()}` : "";
    return request<Portfolio[]>(`/api/portfolio${query}`);
  },

  get: async (id: number): Promise<Portfolio> => {
    return request<Portfolio>(`/api/portfolio/${id}`);
  },

  create: async (data: PortfolioCreate): Promise<Portfolio> => {
    return request<Portfolio>("/api/portfolio", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (id: number, data: Partial<PortfolioCreate>): Promise<Portfolio> => {
    return request<Portfolio>(`/api/portfolio/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (id: number): Promise<void> => {
    return request<void>(`/api/portfolio/${id}`, { method: "DELETE" });
  },
};

// 服务 API
export const serviceApi = {
  list: async (): Promise<Service[]> => {
    return request<Service[]>("/api/services");
  },

  get: async (slug: string): Promise<Service> => {
    return request<Service>(`/api/services/${slug}`);
  },

  create: async (data: ServiceCreate): Promise<Service> => {
    return request<Service>("/api/services", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (slug: string, data: Partial<Service>): Promise<Service> => {
    return request<Service>(`/api/services/${slug}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (slug: string): Promise<void> => {
    return request<void>(`/api/services/${slug}`, { method: "DELETE" });
  },
};

// 询价 API
export const inquiryApi = {
  list: async (): Promise<Inquiry[]> => {
    return request<Inquiry[]>("/api/services/inquiries");
  },

  get: async (id: number): Promise<Inquiry> => {
    return request<Inquiry>(`/api/services/inquiries/${id}`);
  },

  create: async (data: InquiryCreate): Promise<Inquiry> => {
    return request<Inquiry>("/api/services/inquiries", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (id: number, data: InquiryUpdate): Promise<Inquiry> => {
    return request<Inquiry>(`/api/services/inquiries/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (id: number): Promise<void> => {
    return request<void>(`/api/services/inquiries/${id}`, { method: "DELETE" });
  },
};

// 订单 API
export const orderApi = {
  list: async (): Promise<Order[]> => {
    return request<Order[]>("/api/services/orders");
  },

  get: async (id: number): Promise<Order> => {
    return request<Order>(`/api/services/orders/${id}`);
  },

  create: async (data: OrderCreate): Promise<Order> => {
    return request<Order>("/api/services/orders", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (id: number, data: OrderUpdate): Promise<Order> => {
    return request<Order>(`/api/services/orders/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
};

// 联系 API
export const contactApi = {
  send: async (data: { name: string; email: string; subject: string; message: string }): Promise<void> => {
    return request<void>("/api/contact", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};

// 用户管理 API
export const usersApi = {
  list: async (search?: string): Promise<User[]> => {
    const searchParams = new URLSearchParams();
    if (search) searchParams.set("search", search);
    const query = searchParams.toString() ? `?${searchParams.toString()}` : "";
    return request<User[]>(`/api/users${query}`);
  },

  get: async (id: number): Promise<User> => {
    return request<User>(`/api/users/${id}`);
  },

  update: async (id: number, data: UserUpdate): Promise<User> => {
    return request<User>(`/api/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  updateRole: async (id: number, role: string): Promise<void> => {
    return request<void>(`/api/users/${id}/role`, {
      method: "PUT",
      body: JSON.stringify({ role }),
    });
  },

  delete: async (id: number): Promise<void> => {
    return request<void>(`/api/users/${id}`, { method: "DELETE" });
  },

  stats: async (): Promise<{ total: number; admins: number; regular_users: number }> => {
    return request<{ total: number; admins: number; regular_users: number }>("/api/users/stats/count");
  },
};

// API 客户端类型定义
interface ApiClientType {
  auth: typeof authApi;
  blog: typeof blogApi;
  forum: typeof forumApi;
  projects: typeof projectApi;
  portfolio: typeof portfolioApi;
  services: typeof serviceApi;
  inquiries: typeof inquiryApi;
  orders: typeof orderApi;
  contact: typeof contactApi;
  users: typeof usersApi;
}

// 导出完整的 API 对象
export const api: ApiClientType = {
  auth: authApi,
  blog: blogApi,
  forum: forumApi,
  projects: projectApi,
  portfolio: portfolioApi,
  services: serviceApi,
  inquiries: inquiryApi,
  orders: orderApi,
  contact: contactApi,
  users: usersApi,
};
