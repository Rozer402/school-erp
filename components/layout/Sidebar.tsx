"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { SCHOOL } from "@/config/school";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Calendar,
  CheckCircle,
  DollarSign,
  Library,
  LogOut,
  Bell,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { useState } from "react";

const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "teacher", "student"],
  },
  {
    name: "Fees",
    href: "/fees",
    icon: DollarSign,
    roles: ["admin", "student"],
  },
  {
    name: "Attendance",
    href: "/attendance",
    icon: CheckCircle,
    roles: ["admin", "teacher", "student"],
  },
  {
    name: "Timetable",
    href: "/timetable",
    icon: Calendar,
    roles: ["admin", "teacher"],
  },
  {
    name: "Notices",
    href: "/notices",
    icon: Bell,
    roles: ["admin", "teacher", "student"],
  },
  {
    name: "Library",
    href: "/library",
    icon: Library,
    roles: ["admin", "student"],
  },
  {
    name: "Profile",
    href: "/profile",
    icon: User,
    roles: ["admin", "teacher", "student"],
  },
];

export function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-background border-r border-border font-sans">
      {/* School Header */}
      <div className="p-4 border-b border-border">
        <p className="font-semibold">{SCHOOL.name}</p>
        <p className="text-xs text-muted-foreground">{SCHOOL.academicYear}</p>
      </div>

      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto hide-scrollbar pt-6">
        {navItems
          .filter((item) => !user || item.roles.includes(user.role))
          .map((item) => {
            const isActive =
              pathname === item.href || pathname?.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 group relative",
                  isActive
                    ? "bg-indigo-50 text-indigo-600 font-bold dark:bg-indigo-900/20 dark:text-indigo-400"
                    : "text-muted-foreground hover:bg-gray-100 dark:hover:bg-accent hover:text-foreground",
                )}
              >
                {isActive && (
                  <div className="absolute left-0 w-1 h-6 bg-indigo-600 rounded-r-full" />
                )}
                <Icon
                  className={cn(
                    "h-5 w-5 transition-transform group-hover:scale-110",
                    isActive
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-muted-foreground",
                  )}
                />
                <span className="text-sm tracking-tight">{item.name}</span>
              </Link>
            );
          })}
      </nav>

      <div className="p-4 border-t border-border/50">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-2xl py-6"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-bold">Logout</span>
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block fixed inset-y-0 left-0 w-72">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          className="rounded-xl shadow-sm glass border-border/50"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-72 h-full bg-background shadow-lg overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}
