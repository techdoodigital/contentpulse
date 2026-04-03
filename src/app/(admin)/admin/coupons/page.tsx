"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Trash2, Power, X, Shuffle } from "lucide-react";

interface Coupon {
  id: string;
  code: string;
  discount: number;
  maxUses: number;
  currentUses: number;
  active: boolean;
  expiresAt: string | null;
  createdAt: string;
}

function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "CP-";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    discount: 10,
    maxUses: 0,
    expiresAt: "",
  });
  const [creating, setCreating] = useState(false);

  const fetchCoupons = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/coupons");
      const data = await res.json();
      setCoupons(data.coupons || []);
    } catch {
      console.error("Failed to fetch coupons");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  async function handleCreate() {
    if (!formData.code) return;
    setCreating(true);
    try {
      await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: formData.code,
          discount: formData.discount,
          maxUses: formData.maxUses,
          expiresAt: formData.expiresAt || null,
        }),
      });
      setFormData({ code: "", discount: 10, maxUses: 0, expiresAt: "" });
      setShowForm(false);
      fetchCoupons();
    } catch {
      console.error("Failed to create coupon");
    } finally {
      setCreating(false);
    }
  }

  async function handleToggle(id: string, currentActive: boolean) {
    try {
      await fetch("/api/admin/coupons", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, active: !currentActive }),
      });
      fetchCoupons();
    } catch {
      console.error("Failed to toggle coupon");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this coupon code?")) return;
    try {
      await fetch("/api/admin/coupons", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchCoupons();
    } catch {
      console.error("Failed to delete coupon");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Coupon Management</h1>
          <p className="text-sm text-slate-400 mt-1">
            Create and manage discount codes
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-orange-500 transition-colors"
        >
          {showForm ? (
            <>
              <X className="h-4 w-4" /> Cancel
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" /> Create Coupon
            </>
          )}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-4">
          <h2 className="text-sm font-semibold text-white">New Coupon Code</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">
                Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="e.g. SAVE20"
                  className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:border-orange-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, code: generateCode() })
                  }
                  className="rounded-lg border border-slate-700 px-2.5 py-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                  title="Auto-generate"
                >
                  <Shuffle className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">
                Discount %
              </label>
              <input
                type="number"
                min={1}
                max={100}
                value={formData.discount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    discount: parseInt(e.target.value, 10) || 0,
                  })
                }
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 focus:border-orange-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">
                Max Uses (0 = unlimited)
              </label>
              <input
                type="number"
                min={0}
                value={formData.maxUses}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxUses: parseInt(e.target.value, 10) || 0,
                  })
                }
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 focus:border-orange-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">
                Expiry Date (optional)
              </label>
              <input
                type="date"
                value={formData.expiresAt}
                onChange={(e) =>
                  setFormData({ ...formData, expiresAt: e.target.value })
                }
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>
          <button
            onClick={handleCreate}
            disabled={creating || !formData.code}
            className="rounded-lg bg-orange-600 px-5 py-2 text-sm font-medium text-white hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {creating ? "Creating..." : "Create Coupon"}
          </button>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-left">
                <th className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Discount
                </th>
                <th className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Uses
                </th>
                <th className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Expires
                </th>
                <th className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Created
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
              ) : coupons.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-slate-500"
                  >
                    No coupons created yet
                  </td>
                </tr>
              ) : (
                coupons.map((coupon, i) => (
                  <tr
                    key={coupon.id}
                    className={i % 2 === 1 ? "bg-slate-800/30" : ""}
                  >
                    <td className="px-4 py-3">
                      <code className="rounded bg-slate-800 px-2 py-0.5 text-xs font-mono text-orange-300">
                        {coupon.code}
                      </code>
                    </td>
                    <td className="px-4 py-3 text-slate-200">
                      {coupon.discount}%
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {coupon.currentUses}
                      {coupon.maxUses > 0 ? ` / ${coupon.maxUses}` : " / unlimited"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          coupon.active
                            ? "text-green-400 bg-green-500/10"
                            : "text-red-400 bg-red-500/10"
                        }`}
                      >
                        {coupon.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400">
                      {coupon.expiresAt
                        ? new Date(coupon.expiresAt).toLocaleDateString()
                        : "Never"}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400">
                      {new Date(coupon.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() =>
                            handleToggle(coupon.id, coupon.active)
                          }
                          className={`rounded-lg p-1.5 transition-colors ${
                            coupon.active
                              ? "text-green-400 hover:bg-green-500/10"
                              : "text-slate-500 hover:bg-slate-700"
                          }`}
                          title={
                            coupon.active ? "Deactivate" : "Activate"
                          }
                        >
                          <Power className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(coupon.id)}
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
