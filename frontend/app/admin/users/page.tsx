"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { usersApi } from "@/lib/api-client";
import { formatDate } from "@/lib/utils";
import { Users as UsersIcon, Shield, User } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await usersApi.list();
        setUsers(data as any[]);
      } catch (error) {
        console.error("获取用户失败:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">用户管理</h1>
        <p className="text-muted-foreground">查看注册用户</p>
      </div>

      {loading ? (
        <div className="loading-spinner" />
      ) : users.length > 0 ? (
        <Card className="card-base">
          <div className="divide-y divide-border/50">
            {users.map((user) => (
              <div key={user.id} className="p-4 sm:p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="icon-box">
                    {user.role?.toLowerCase() === "admin" 
                      ? <Shield className="h-6 w-6 text-primary" />
                      : <User className="h-6 w-6 text-primary" />
                    }
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{user.name || "未命名"}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`badge ${user.role?.toLowerCase() === "admin" ? "bg-primary/10 text-primary" : ""}`}>
                    {user.role?.toLowerCase() === "admin" ? "管理员" : "用户"}
                  </span>
                  <span className="text-sm text-muted-foreground">{formatDate(user.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <Card className="card-base p-12 text-center">
          <div className="icon-box mx-auto mb-4 w-16 h-16">
            <UsersIcon className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-2">暂无用户</h3>
        </Card>
      )}
    </div>
  );
}
