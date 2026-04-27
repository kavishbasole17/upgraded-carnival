export type Role = "ADMIN" | "USER";
export type Priority = "HIGH" | "MEDIUM" | "LOW";
export type TaskStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  organizationId: string;
  organizationName: string;
}

export interface Task {
  id: string;
  description: string;
  priority: Priority;
  status: TaskStatus;
  lat: number;
  lng: number;
  organizationId: string;
  createdAt: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  role: Role;
  organizationId: string;
}

export interface PromptHistoryItem {
  id: string;
  input: string;
  assignedPriority: Priority;
  status: TaskStatus;
  createdAt: string;
}
