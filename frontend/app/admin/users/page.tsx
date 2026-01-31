"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import { Search, Shield, Trash2, Mail, Calendar, Loader2 } from "lucide-react";
import { usersApi, showError, showSuccess } from "@/lib/api-client";
import type { User } from "@/lib/types";

interface ApiError {
  message?: string;
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<number | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await usersApi.list();
      setUsers(data);
    } catch (error) {
      showError("获取用户列表失败");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    (user.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    if (!confirm("确定要删除这个用户吗？")) return;

    setProcessing(id);
    try {
      await usersApi.delete(id);
      setUsers(users.filter(u => u.id !== id));
      showSuccess("用户已删除");
    } catch (error) {
      const apiError = error as ApiError;
      showError(apiError.message || "删除失败");
    } finally {
      setProcessing(null);
    }
  };

  const handleUpdateRole = async (id: number, newRole: string) => {
    setProcessing(id);
    try {
      await usersApi.updateRole(id, newRole);
      setUsers(users.map(u =>
        u.id === id ? { ...u, role: newRole as "USER" | "ADMIN" } : u
      ));
      showSuccess("角色已更新");
    } catch (error) {
      const apiError = error as ApiError;
      showError(apiError.message || "更新失败");
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* 标题 */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">用户管理</h1>
        <p className="text-muted-foreground mt-1">管理注册用户</p>
      </div>

      {/* 搜索 */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索用户..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 input-glow"
          />
        </div>
      </div>

      {/* 用户列表 */}
      <Card className="gradient-border">
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{user.name}</span>
                      <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                        {user.role === "ADMIN" ? (
                          <span className="flex items-center gap-1">
                            <Shield className="h-3 w-3" />
                            管理员
                          </span>
                        ) : (
                          "用户"
                        )}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(user.created_at)}
                      </span>
                    </div>
                    {user.bio && (
                      <p className="text-sm text-muted-foreground mt-1 truncate">{user.bio}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  {user.role !== "ADMIN" && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUpdateRole(user.id, "ADMIN")}
                        disabled={processing === user.id}
                      >
                        {processing === user.id ? (
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <Shield className="h-4 w-4 mr-1" />
                        )}
                        设为管理员
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(user.id)}
                        disabled={processing === user.id}
                      >
                        {processing === user.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 text-destructive" />
                        )}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          没有找到相关用户
        </div>
      )}
    </div>
  );
}
