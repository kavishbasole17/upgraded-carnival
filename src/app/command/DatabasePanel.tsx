"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import type { Task, Member, SessionUser, Priority, TaskStatus } from "@/types";

const PRIORITY_COLORS: Record<Priority, string> = {
  HIGH: "#e05050",
  MEDIUM: "#d4900a",
  LOW: "#3a8a5a",
};

const STATUS_COLORS: Record<TaskStatus, string> = {
  OPEN: "#e05050",
  IN_PROGRESS: "#d4900a",
  RESOLVED: "#3a8a5a",
};

interface DatabasePanelProps {
  user: SessionUser;
}

type TableTab = "tasks" | "members";

export default function DatabasePanel({ user }: DatabasePanelProps) {
  const [tab, setTab] = useState<TableTab>("tasks");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const [taskModal, setTaskModal] = useState<{
    open: boolean;
    mode: "add" | "edit";
    task?: Task;
  }>({ open: false, mode: "add" });

  const [memberModal, setMemberModal] = useState<{
    open: boolean;
    mode: "add" | "edit";
    member?: Member;
  }>({ open: false, mode: "add" });

  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: "task" | "member";
    id: string;
  } | null>(null);

  const loadData = useCallback(() => {
    setLoading(true);
    Promise.all([
      fetch("/api/tasks").then((r) => r.json()),
      fetch("/api/members").then((r) => r.json()),
    ])
      .then(([tasksData, membersData]) => {
        setTasks(tasksData.tasks ?? []);
        setMembers(membersData.members ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function deleteTask(id: string) {
    await fetch("/api/tasks", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setDeleteConfirm(null);
    loadData();
  }

  async function deleteMember(id: string) {
    await fetch("/api/members", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setDeleteConfirm(null);
    loadData();
  }

  const isAdmin = user.role === "ADMIN";

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold mb-1" style={{ color: "#2c2c2c" }}>
            Organization Database
          </h2>
          <p className="text-xs" style={{ color: "#6b6560" }}>
            {isAdmin ? "Full CRUD access" : "Read-only view"}
          </p>
        </div>

        {isAdmin && (
          <button
            type="button"
            onClick={() => {
              if (tab === "tasks") {
                setTaskModal({ open: true, mode: "add" });
              } else {
                setMemberModal({ open: true, mode: "add" });
              }
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
            style={{ backgroundColor: "#c1704a", color: "#fff" }}
          >
            <Plus className="w-4 h-4" />
            Add {tab === "tasks" ? "Task" : "Member"}
          </button>
        )}
      </div>

      <div
        className="flex rounded-xl mb-4 p-1"
        style={{ backgroundColor: "#ddd5c8" }}
      >
        {(["tasks", "members"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
            style={
              tab === t
                ? { backgroundColor: "#c1704a", color: "#fff" }
                : { color: "#6b6560", backgroundColor: "transparent" }
            }
          >
            {t === "tasks" ? "Tasks" : "Members"}
          </button>
        ))}
      </div>

      <div
        className="flex-1 overflow-auto rounded-xl"
        style={{ border: "1px solid #ddd5c8" }}
      >
        {loading ? (
          <div className="p-6 text-sm text-center" style={{ color: "#6b6560" }}>
            Loading…
          </div>
        ) : tab === "tasks" ? (
          <TasksTable
            tasks={tasks}
            isAdmin={isAdmin}
            onEdit={(task) => setTaskModal({ open: true, mode: "edit", task })}
            onDelete={(id) => setDeleteConfirm({ type: "task", id })}
          />
        ) : (
          <MembersTable
            members={members}
            currentUserId={user.id}
            isAdmin={isAdmin}
            onEdit={(member) => setMemberModal({ open: true, mode: "edit", member })}
            onDelete={(id) => setDeleteConfirm({ type: "member", id })}
          />
        )}
      </div>

      {taskModal.open && (
        <TaskModal
          mode={taskModal.mode}
          task={taskModal.task}
          onClose={() => setTaskModal({ open: false, mode: "add" })}
          onSave={loadData}
        />
      )}

      {memberModal.open && (
        <MemberModal
          mode={memberModal.mode}
          member={memberModal.member}
          onClose={() => setMemberModal({ open: false, mode: "add" })}
          onSave={loadData}
        />
      )}

      {deleteConfirm && (
        <ConfirmDelete
          onCancel={() => setDeleteConfirm(null)}
          onConfirm={() => {
            if (deleteConfirm.type === "task") deleteTask(deleteConfirm.id);
            else deleteMember(deleteConfirm.id);
          }}
        />
      )}
    </div>
  );
}

function TasksTable({
  tasks,
  isAdmin,
  onEdit,
  onDelete,
}: {
  tasks: Task[];
  isAdmin: boolean;
  onEdit: (t: Task) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr style={{ backgroundColor: "#e8e0d5", borderBottom: "1px solid #ddd5c8" }}>
          {["Description", "Priority", "Status", "Location"].map((h) => (
            <th
              key={h}
              className="text-left px-4 py-3 text-xs font-semibold"
              style={{ color: "#6b6560" }}
            >
              {h}
            </th>
          ))}
          {isAdmin && (
            <th
              className="text-left px-4 py-3 text-xs font-semibold"
              style={{ color: "#6b6560" }}
            >
              Actions
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {tasks.length === 0 ? (
          <tr>
            <td
              colSpan={isAdmin ? 5 : 4}
              className="px-4 py-6 text-center text-sm"
              style={{ color: "#6b6560" }}
            >
              No tasks found.
            </td>
          </tr>
        ) : (
          tasks.map((task, i) => (
            <tr
              key={task.id}
              style={{
                backgroundColor: i % 2 === 0 ? "#faf8f5" : "#f5f0ea",
                borderBottom: "1px solid #ddd5c8",
              }}
            >
              <td className="px-4 py-3" style={{ color: "#2c2c2c", maxWidth: 200 }}>
                <span className="line-clamp-2">{task.description}</span>
              </td>
              <td className="px-4 py-3">
                <span
                  className="px-2 py-0.5 rounded-lg text-xs font-semibold"
                  style={{
                    backgroundColor: `${PRIORITY_COLORS[task.priority]}22`,
                    color: PRIORITY_COLORS[task.priority],
                  }}
                >
                  {task.priority}
                </span>
              </td>
              <td className="px-4 py-3">
                <span
                  className="px-2 py-0.5 rounded-lg text-xs font-semibold"
                  style={{
                    backgroundColor: `${STATUS_COLORS[task.status]}22`,
                    color: STATUS_COLORS[task.status],
                  }}
                >
                  {task.status.replace("_", " ")}
                </span>
              </td>
              <td className="px-4 py-3 text-xs" style={{ color: "#6b6560" }}>
                {task.lat.toFixed(4)}, {task.lng.toFixed(4)}
              </td>
              {isAdmin && (
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(task)}
                      className="p-1.5 rounded-lg"
                      style={{ backgroundColor: "#e8e0d5", color: "#6b6560" }}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(task.id)}
                      className="p-1.5 rounded-lg"
                      style={{ backgroundColor: "#fde8e8", color: "#e05050" }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

function MembersTable({
  members,
  currentUserId,
  isAdmin,
  onEdit,
  onDelete,
}: {
  members: Member[];
  currentUserId: string;
  isAdmin: boolean;
  onEdit: (m: Member) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr style={{ backgroundColor: "#e8e0d5", borderBottom: "1px solid #ddd5c8" }}>
          {["Name", "Email", "Role"].map((h) => (
            <th
              key={h}
              className="text-left px-4 py-3 text-xs font-semibold"
              style={{ color: "#6b6560" }}
            >
              {h}
            </th>
          ))}
          {isAdmin && (
            <th
              className="text-left px-4 py-3 text-xs font-semibold"
              style={{ color: "#6b6560" }}
            >
              Actions
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {members.length === 0 ? (
          <tr>
            <td
              colSpan={isAdmin ? 4 : 3}
              className="px-4 py-6 text-center text-sm"
              style={{ color: "#6b6560" }}
            >
              No members found.
            </td>
          </tr>
        ) : (
          members.map((member, i) => (
            <tr
              key={member.id}
              style={{
                backgroundColor: i % 2 === 0 ? "#faf8f5" : "#f5f0ea",
                borderBottom: "1px solid #ddd5c8",
              }}
            >
              <td className="px-4 py-3 font-medium" style={{ color: "#2c2c2c" }}>
                {member.name}
                {member.id === currentUserId && (
                  <span
                    className="ml-2 text-xs px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: "#e8e0d5", color: "#6b6560" }}
                  >
                    You
                  </span>
                )}
              </td>
              <td className="px-4 py-3" style={{ color: "#6b6560" }}>
                {member.email}
              </td>
              <td className="px-4 py-3">
                <span
                  className="px-2 py-0.5 rounded-lg text-xs font-semibold"
                  style={{
                    backgroundColor: member.role === "ADMIN" ? "#c1704a22" : "#e8e0d5",
                    color: member.role === "ADMIN" ? "#c1704a" : "#6b6560",
                  }}
                >
                  {member.role}
                </span>
              </td>
              {isAdmin && (
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(member)}
                      className="p-1.5 rounded-lg"
                      style={{ backgroundColor: "#e8e0d5", color: "#6b6560" }}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    {member.id !== currentUserId && (
                      <button
                        type="button"
                        onClick={() => onDelete(member.id)}
                        className="p-1.5 rounded-lg"
                        style={{ backgroundColor: "#fde8e8", color: "#e05050" }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

function TaskModal({
  mode,
  task,
  onClose,
  onSave,
}: {
  mode: "add" | "edit";
  task?: Task;
  onClose: () => void;
  onSave: () => void;
}) {
  const [description, setDescription] = useState(task?.description ?? "");
  const [priority, setPriority] = useState<Priority>(task?.priority ?? "MEDIUM");
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? "OPEN");
  const [lat, setLat] = useState(String(task?.lat ?? "20.5937"));
  const [lng, setLng] = useState(String(task?.lng ?? "78.9629"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const body =
        mode === "add"
          ? { description, priority, status, lat, lng }
          : { id: task!.id, description, priority, status, lat, lng };
      const res = await fetch("/api/tasks", {
        method: mode === "add" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error ?? "Failed");
        return;
      }
      onSave();
      onClose();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ModalOverlay onClose={onClose}>
      <h3 className="text-base font-semibold mb-4" style={{ color: "#2c2c2c" }}>
        {mode === "add" ? "Add Task" : "Edit Task"}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs mb-1" style={{ color: "#6b6560" }}>
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            required
            className="w-full px-3 py-2 rounded-xl text-sm outline-none resize-none"
            style={{
              backgroundColor: "#faf8f5",
              border: "1px solid #ddd5c8",
              color: "#2c2c2c",
            }}
          />
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-xs mb-1" style={{ color: "#6b6560" }}>
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full px-3 py-2 rounded-xl text-sm outline-none"
              style={{
                backgroundColor: "#faf8f5",
                border: "1px solid #ddd5c8",
                color: "#2c2c2c",
              }}
            >
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-xs mb-1" style={{ color: "#6b6560" }}>
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="w-full px-3 py-2 rounded-xl text-sm outline-none"
              style={{
                backgroundColor: "#faf8f5",
                border: "1px solid #ddd5c8",
                color: "#2c2c2c",
              }}
            >
              <option value="OPEN">OPEN</option>
              <option value="IN_PROGRESS">IN PROGRESS</option>
              <option value="RESOLVED">RESOLVED</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-xs mb-1" style={{ color: "#6b6560" }}>
              Latitude
            </label>
            <input
              type="number"
              step="any"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-sm outline-none"
              style={{
                backgroundColor: "#faf8f5",
                border: "1px solid #ddd5c8",
                color: "#2c2c2c",
              }}
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs mb-1" style={{ color: "#6b6560" }}>
              Longitude
            </label>
            <input
              type="number"
              step="any"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-sm outline-none"
              style={{
                backgroundColor: "#faf8f5",
                border: "1px solid #ddd5c8",
                color: "#2c2c2c",
              }}
            />
          </div>
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 rounded-xl text-sm font-medium"
            style={{ backgroundColor: "#e8e0d5", color: "#6b6560" }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2 rounded-xl text-sm font-semibold"
            style={{
              backgroundColor: "#c1704a",
              color: "#fff",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Saving…" : mode === "add" ? "Add Task" : "Update Task"}
          </button>
        </div>
      </form>
    </ModalOverlay>
  );
}

function MemberModal({
  mode,
  member,
  onClose,
  onSave,
}: {
  mode: "add" | "edit";
  member?: Member;
  onClose: () => void;
  onSave: () => void;
}) {
  const [name, setName] = useState(member?.name ?? "");
  const [email, setEmail] = useState(member?.email ?? "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"ADMIN" | "USER">(member?.role ?? "USER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const body =
        mode === "add"
          ? { name, email, password, role }
          : { id: member!.id, name, email, role };
      const res = await fetch("/api/members", {
        method: mode === "add" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error ?? "Failed");
        return;
      }
      onSave();
      onClose();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ModalOverlay onClose={onClose}>
      <h3 className="text-base font-semibold mb-4" style={{ color: "#2c2c2c" }}>
        {mode === "add" ? "Add Member" : "Edit Member"}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs mb-1" style={{ color: "#6b6560" }}>
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 rounded-xl text-sm outline-none"
            style={{
              backgroundColor: "#faf8f5",
              border: "1px solid #ddd5c8",
              color: "#2c2c2c",
            }}
          />
        </div>
        <div>
          <label className="block text-xs mb-1" style={{ color: "#6b6560" }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 rounded-xl text-sm outline-none"
            style={{
              backgroundColor: "#faf8f5",
              border: "1px solid #ddd5c8",
              color: "#2c2c2c",
            }}
          />
        </div>
        {mode === "add" && (
          <div>
            <label className="block text-xs mb-1" style={{ color: "#6b6560" }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-xl text-sm outline-none"
              style={{
                backgroundColor: "#faf8f5",
                border: "1px solid #ddd5c8",
                color: "#2c2c2c",
              }}
            />
          </div>
        )}
        <div>
          <label className="block text-xs mb-1" style={{ color: "#6b6560" }}>
            Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as "ADMIN" | "USER")}
            className="w-full px-3 py-2 rounded-xl text-sm outline-none"
            style={{
              backgroundColor: "#faf8f5",
              border: "1px solid #ddd5c8",
              color: "#2c2c2c",
            }}
          >
            <option value="USER">Member</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 rounded-xl text-sm font-medium"
            style={{ backgroundColor: "#e8e0d5", color: "#6b6560" }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2 rounded-xl text-sm font-semibold"
            style={{
              backgroundColor: "#c1704a",
              color: "#fff",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading
              ? "Saving…"
              : mode === "add"
              ? "Add Member"
              : "Update Member"}
          </button>
        </div>
      </form>
    </ModalOverlay>
  );
}

function ConfirmDelete({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <ModalOverlay onClose={onCancel}>
      <div className="text-center">
        <div
          className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4"
          style={{ backgroundColor: "#fde8e8" }}
        >
          <Trash2 className="w-6 h-6" style={{ color: "#e05050" }} />
        </div>
        <h3 className="text-base font-semibold mb-2" style={{ color: "#2c2c2c" }}>
          Confirm Delete
        </h3>
        <p className="text-sm mb-6" style={{ color: "#6b6560" }}>
          This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium"
            style={{ backgroundColor: "#e8e0d5", color: "#6b6560" }}
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold"
            style={{ backgroundColor: "#e05050", color: "#fff" }}
          >
            <Check className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
}

function ModalOverlay({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6 relative"
        style={{
          backgroundColor: "#f0ebe3",
          border: "1px solid #ddd5c8",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg"
          style={{ color: "#6b6560", backgroundColor: "#e8e0d5" }}
        >
          <X className="w-4 h-4" />
        </button>
        {children}
      </div>
    </div>
  );
}
