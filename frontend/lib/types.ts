// API 类型定义

// 用户
export interface User {
  id: number;
  email: string;
  name: string | null;
  bio: string | null;
  image: string | null;
  role: UserRole;
  created_at: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface UserUpdate {
  name?: string | null;
  bio?: string | null;
  image?: string | null;
}

// 博客
export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  cover_image: string | null;
  published: boolean;
  author_id: number;
  author?: User;
  created_at: string;
  updated_at: string;
}

export interface PostCreate {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  cover_image?: string;
  published?: boolean;
}

// 论坛
export interface Topic {
  id: number;
  title: string;
  content: string;
  author_id: number;
  author?: User;
  views: number;
  created_at: string;
  updated_at: string;
  comments_count?: number;
  topics?: Comment[];
}

export interface TopicListResponse {
  topics: Topic[];
  total: number;
  page: number;
  limit: number;
}

export interface TopicCreate {
  title: string;
  content: string;
}

export interface Comment {
  id: number;
  content: string;
  author_id: number;
  author?: User;
  topic_id: number;
  likes: number;
  created_at: string;
}

export interface CommentCreate {
  content: string;
}

// 项目
export interface Project {
  id: number;
  name: string;
  slug: string;
  description: string;
  content: string | null;
  cover_image: string | null;
  tech_stack: string[];
  github_url: string | null;
  demo_url: string | null;
  featured: boolean;
  sort_order: number;
  author_id: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectCreate {
  name: string;
  slug: string;
  description: string;
  content?: string;
  cover_image?: string;
  tech_stack?: string[];
  github_url?: string;
  demo_url?: string;
  featured?: boolean;
  sort_order?: number;
}

// 作品集
export interface Portfolio {
  id: number;
  title: string;
  category: string;
  description: string | null;
  image_url: string | null;
  link_url: string | null;
  sort_order: number;
  created_at: string;
}

export interface PortfolioCreate {
  title: string;
  category: string;
  description?: string;
  image_url?: string;
  link_url?: string;
  sort_order?: number;
}

// 服务
export interface Service {
  id: number;
  name: string;
  slug: string;
  description: string;
  content: string | null;
  price_type: "fixed" | "hourly" | "custom";
  price_from: number | null;
  price_to: number | null;
  icon: string | null;
  features: string[] | null;
  estimated_days: number | null;
  sort_order: number;
  active: boolean;
  created_at: string;
}

export interface ServiceCreate {
  name: string;
  slug: string;
  description: string;
  content?: string;
  price_type: "fixed" | "hourly" | "custom";
  price_from?: number;
  price_to?: number;
  icon?: string;
  features?: string[];
  estimated_days?: number;
  sort_order?: number;
  active?: boolean;
}

// 联系
export interface Contact {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// 询价状态
export type InquiryStatus = "pending" | "contacted" | "quoted" | "closed";

// 订单状态
export type OrderStatus = "pending" | "confirmed" | "working" | "reviewing" | "completed" | "cancelled";

// 用户角色
export type UserRole = "USER" | "ADMIN" | "admin";

// 询价
export interface Inquiry {
  id: number;
  client_name: string;
  client_email: string;
  client_phone: string | null;
  service_id: number | null;
  service?: Service;
  project_type: string;
  budget: string | null;
  timeline: string | null;
  description: string;
  status: InquiryStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface InquiryCreate {
  client_name: string;
  client_email: string;
  client_phone?: string;
  service_id?: number;
  project_type: string;
  budget?: string;
  timeline?: string;
  description: string;
}

export interface InquiryUpdate {
  status?: InquiryStatus;
  notes?: string;
  budget?: string;
  timeline?: string;
}

// 订单
export interface Order {
  id: number;
  order_no: string;
  client_id: number;
  client?: User;
  service_id: number;
  service?: Service;
  status: OrderStatus;
  total_amount: number;
  deposit: number;
  description: string;
  requirements: string | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderCreate {
  service_id: number;
  total_amount: number;
  deposit?: number;
  description: string;
  requirements?: string;
}

export interface OrderUpdate {
  status?: OrderStatus;
  notes?: string;
  total_amount?: number;
  deposit?: number;
}
