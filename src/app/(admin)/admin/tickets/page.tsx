"use client";

import { useEffect, useState, useCallback } from "react";
import { Filter, ChevronDown, ChevronUp, Send } from "lucide-react";

interface TicketUser {
  name: string | null;
  email: string;
}

interface AdminTicket {
  id: string;
  subject: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  response: string | null;
  createdAt: string;
  user: TicketUser;
}

const statusOptions = ["all", "open", "in-progress", "resolved"];

function getPriorityColor(priority: string) {
  switch (priority) {
    case "high":
      return "text-red-400 bg-red-500/10";
    case "medium":
      return "text-yellow-400 bg-yellow-500/10";
    default:
      return "text-green-400 bg-green-500/10";
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "open":
      return "text-blue-400 bg-blue-500/10";
    case "in-progress":
      return "text-orange-400 bg-orange-500/10";
    case "resolved":
      return "text-green-400 bg-green-500/10";
    default:
      return "text-slate-400 bg-slate-700/50";
  }
}

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<AdminTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [responseText, setResponseText] = useState("");
  const [responseStatus, setResponseStatus] = useState("in-progress");
  const [submitting, setSubmitting] = useState(false);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      const res = await fetch(`/api/admin/tickets?${params}`);
      const data = await res.json();
      setTickets(data.tickets || []);
    } catch {
      console.error("Failed to fetch tickets");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  async function handleRespond(ticketId: string) {
    if (!responseText.trim()) return;
    setSubmitting(true);
    try {
      await fetch("/api/admin/tickets", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketId,
          status: responseStatus,
          response: responseText,
        }),
      });
      setResponseText("");
      setExpandedId(null);
      fetchTickets();
    } catch {
      console.error("Failed to respond");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Ticket Management</h1>
        <p className="text-sm text-slate-400 mt-1">
          View and respond to all support tickets
        </p>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <Filter className="h-4 w-4 text-slate-500" />
        <div className="flex gap-2">
          {statusOptions.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                statusFilter === status
                  ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                  : "text-slate-400 border border-slate-700 hover:bg-slate-800"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
          </div>
        ) : tickets.length === 0 ? (
          <p className="text-sm text-slate-500 py-12 text-center">
            No tickets found
          </p>
        ) : (
          <div className="divide-y divide-slate-800">
            {tickets.map((ticket) => {
              const isExpanded = expandedId === ticket.id;
              return (
                <div key={ticket.id}>
                  <button
                    onClick={() =>
                      setExpandedId(isExpanded ? null : ticket.id)
                    }
                    className="w-full px-4 py-3.5 flex items-center gap-4 text-left hover:bg-slate-800/30 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium text-slate-200 truncate">
                          {ticket.subject}
                        </p>
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${getPriorityColor(
                            ticket.priority
                          )}`}
                        >
                          {ticket.priority}
                        </span>
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${getStatusColor(
                            ticket.status
                          )}`}
                        >
                          {ticket.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {ticket.user.name || ticket.user.email} - {ticket.category} -{" "}
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-slate-500 shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-500 shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-4 bg-slate-800/20">
                      <div className="rounded-lg bg-slate-800/50 p-4">
                        <p className="text-xs text-slate-400 mb-1">
                          Description
                        </p>
                        <p className="text-sm text-slate-200 whitespace-pre-wrap">
                          {ticket.description}
                        </p>
                      </div>

                      {ticket.response && (
                        <div className="rounded-lg bg-orange-500/5 border border-orange-500/10 p-4">
                          <p className="text-xs text-orange-400 mb-1">
                            Admin Response
                          </p>
                          <p className="text-sm text-slate-200 whitespace-pre-wrap">
                            {ticket.response}
                          </p>
                        </div>
                      )}

                      {/* Respond form */}
                      <div className="space-y-3">
                        <textarea
                          value={responseText}
                          onChange={(e) => setResponseText(e.target.value)}
                          placeholder="Write a response..."
                          rows={3}
                          className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 resize-none"
                        />
                        <div className="flex items-center gap-3">
                          <select
                            value={responseStatus}
                            onChange={(e) => setResponseStatus(e.target.value)}
                            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 focus:border-orange-500 focus:outline-none"
                          >
                            <option value="open">Open</option>
                            <option value="in-progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                          </select>
                          <button
                            onClick={() => handleRespond(ticket.id)}
                            disabled={submitting || !responseText.trim()}
                            className="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <Send className="h-4 w-4" />
                            {submitting ? "Sending..." : "Send Response"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
