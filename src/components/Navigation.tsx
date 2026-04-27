"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Shield, LayoutDashboard, Map, Database, LogOut } from "lucide-react";
import type { SessionUser } from "@/types";

interface NavProps {
  user: SessionUser;
}

export default function Navigation({ user }: NavProps) {
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ...(user.role === "ADMIN"
      ? [{ href: "/heatmap", label: "Heatmap", icon: Map }]
      : []),
    { href: "/command", label: "Command Center", icon: Database },
  ];

  return (
    <nav
      className="flex items-center justify-between px-6 py-4"
      style={{
        backgroundColor: "#f0ebe3",
        borderBottom: "1px solid #ddd5c8",
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center w-9 h-9 rounded-xl"
          style={{ backgroundColor: "#c1704a" }}
        >
          <Shield className="w-5 h-5 text-white" />
        </div>
        <span className="font-semibold text-base" style={{ color: "#2c2c2c" }}>
          NGO Command Center
        </span>
      </div>

      <div className="flex items-center gap-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={
                active
                  ? { backgroundColor: "#c1704a", color: "#fff" }
                  : { color: "#6b6560", backgroundColor: "transparent" }
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium" style={{ color: "#2c2c2c" }}>
            {user.name}
          </p>
          <p className="text-xs" style={{ color: "#6b6560" }}>
            {user.role === "ADMIN" ? "Administrator" : "Member"} ·{" "}
            {user.organizationName}
          </p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center justify-center w-9 h-9 rounded-xl transition-all"
          style={{
            backgroundColor: "#e8e0d5",
            color: "#6b6560",
          }}
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
}
