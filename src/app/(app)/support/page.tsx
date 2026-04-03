"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  Send,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface Ticket {
  id: string;
  subject: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  response: string | null;
  createdAt: string;
}

const categories = [
  { value: "bug", label: "Bug Report" },
  { value: "feature", label: "Feature Request" },
  { value: "billing", label: "Billing" },
  { value: "account", label: "Account" },
  { value: "other", label: "Other" },
];

const priorities = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("other");
  const [priority, setPriority] = useState("medium");

  useEffect(() => {
    fetchTickets();
  }, []);

  async function fetchTickets() {
    try {
      const res = await fetch("/api/support");
      const data = await res.json();
      setTickets(data.tickets || []);
    } catch {
      console.error("Failed to fetch tickets");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, description, category, priority }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create ticket");
        return;
      }

      setSuccess("Ticket submitted successfully. We will get back to you soon.");
      setSubject("");
      setDescription("");
      setCategory("other");
      setPriority("medium");
      setShowForm(false);
      fetchTickets();
    } catch {
      setError("Failed to create ticket");
    } finally {
      setSubmitting(false);
    }
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case "open":
        return <Clock className="h-4 w-4 text-yellow-400" />;
      case "in-progress":
        return <AlertCircle className="h-4 w-4 text-blue-400" />;
      case "resolved":
        return <CheckCircle2 className="h-4 w-4 text-green-400" />;
      default:
        return <Clock className="h-4 w-4 text-slate-400" />;
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "open":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
      case "in-progress":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      case "resolved":
        return "bg-green-500/10 text-green-400 border-green-500/30";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/30";
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Support</h1>
          <p className="mt-1 text-sm text-slate-400">
            Need help? Submit a ticket and we will respond as soon as possible.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-orange-500"
        >
          <Send className="h-4 w-4" />
          New Ticket
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-300">
          {success}
        </div>
      )}

      {/* New ticket form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 rounded-xl border border-slate-800 bg-slate-900/50 p-6"
        >
          <h2 className="text-lg font-semibold text-white mb-4">
            Submit a Ticket
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief summary of your issue"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none"
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm text-slate-400 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none"
                >
                  {priorities.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your issue in detail (minimum 20 characters)"
                rows={5}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none resize-none"
                required
                minLength={20}
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-500 disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Submit Ticket
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-400 hover:bg-slate-800"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Tickets list */}
      {tickets.length > 0 ? (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="rounded-xl border border-slate-800 bg-slate-900/50 p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {getStatusIcon(ticket.status)}
                    <h3 className="text-sm font-semibold text-white">
                      {ticket.subject}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">
                    {new Date(ticket.createdAt).toLocaleDateString()} -{" "}
                    <span className="capitalize">{ticket.category}</span> -{" "}
                    <span className="capitalize">{ticket.priority}</span>{" "}
                    priority
                  </p>
                  <p className="text-sm text-slate-400">{ticket.description}</p>
                </div>
                <span
                  className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${getStatusColor(
                    ticket.status
                  )}`}
                >
                  {ticket.status}
                </span>
              </div>

              {ticket.response && (
                <div className="mt-4 rounded-lg border border-orange-500/20 bg-orange-500/5 p-3">
                  <p className="text-xs font-medium text-orange-400 mb-1">
                    Response from Support
                  </p>
                  <p className="text-sm text-slate-300">{ticket.response}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        !showForm && (
          <div className="text-center py-16">
            <MessageSquare className="mx-auto h-12 w-12 text-slate-700 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              No tickets yet
            </h3>
            <p className="text-sm text-slate-400 mb-6">
              Have a question or issue? We are here to help.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-500"
            >
              <Send className="h-4 w-4" />
              Submit Your First Ticket
            </button>
          </div>
        )
      )}
    </div>
  );
}
