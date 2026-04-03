"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, Trash2, UserCircle } from "lucide-react";

interface AdminUser {
  id: string;
  name: string | null;
  email: string;
  role: string;
  plan: string;
  sitesCount: number;
  alertCount: number;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "20",
      });
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/users?${params}`);
      const data = await res.json();
      setUsers(data.users || []);
      setTotalPages(data.totalPages || 1);
    } catch {
      console.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  async function handleDelete(userId: string) {
    if (!confirm("Are you sure you want to delete this user? This cannot be undone.")) {
      return;
    }
    setDeleting(userId);
    try {
      await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      fetchUsers();
    } catch {
      console.error("Failed to delete user");
    } finally {
      setDeleting(null);
    }
  }

  function getPlanBadge(plan: string) {
    switch (plan) {
      case "pro":
        return "text-green-400 bg-green-500/10";
      case "starter":
        return "text-orange-400 bg-orange-500/10";
      default:
        return "text-slate-400 bg-slate-700/50";
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">User Management</h1>
        <p className="text-sm text-slate-400 mt-1">
          View and manage all registered users
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-left">
                <th className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Sites
                </th>
                <th className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Alerts
                </th>
                <th className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <div className="flex justify-center">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-slate-500"
                  >
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user, i) => (
                  <tr
                    key={user.id}
                    className={i % 2 === 1 ? "bg-slate-800/30" : ""}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <UserCircle className="h-8 w-8 text-slate-600 shrink-0" />
                        <div>
                          <p className="font-medium text-slate-200">
                            {user.name || "No name"}
                          </p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          user.role === "admin"
                            ? "text-orange-400 bg-orange-500/10"
                            : "text-slate-400 bg-slate-700/50"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${getPlanBadge(
                          user.plan
                        )}`}
                      >
                        {user.plan}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {user.sitesCount}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {user.alertCount}
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(user.id)}
                        disabled={
                          deleting === user.id || user.role === "admin"
                        }
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title={
                          user.role === "admin"
                            ? "Cannot delete admin"
                            : "Delete user"
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-800 px-4 py-3">
            <p className="text-xs text-slate-500">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-400 hover:bg-slate-800 disabled:opacity-30"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-400 hover:bg-slate-800 disabled:opacity-30"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
