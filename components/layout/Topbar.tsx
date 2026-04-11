"use client";

import { SCHOOL } from "@/config/school";
import Image from "next/image";
import {
  Bell,
  Settings,
  Moon,
  Sun,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";

export function Topbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh(); // Crucial to update the Server Components' cookie store
    } catch (error) {
      console.error("Failed to logout", error);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <header className="h-20 bg-background/80 backdrop-blur-md border-b border-border/50 flex items-center justify-between px-6 md:px-10 z-30 sticky top-0 md:pl-80 pl-20 transition-all duration-300">
      {/* Left: School Branding */}
      <div className="flex items-center gap-3">
        <div className="relative h-10 w-10 shrink-0">
          <Image
            src="/logo.png"
            alt={`${SCHOOL.name} Logo`}
            fill
            className="object-contain drop-shadow-sm"
            sizes="40px"
            priority
          />
        </div>
        <div className="hidden sm:block">
          <p className="text-sm font-semibold">{SCHOOL.name}</p>
          <p className="text-xs text-muted-foreground">{SCHOOL.tagline}</p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 p-1 bg-muted/20 dark:bg-muted/10 rounded-2xl border border-border/30">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-xl hover:bg-background transition-all"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-amber-500" />
            ) : (
              <Moon className="h-4 w-4 text-indigo-600" />
            )}
          </Button>

          <div className="w-[1px] h-4 bg-border/50 mx-1" />

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-xl hover:bg-background transition-all relative group"
          >
            <Bell className="h-4 w-4 text-muted-foreground group-hover:text-amber-500 transition-colors" />
            <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-rose-500 rounded-full border-2 border-background shadow-lg"></span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-xl hover:bg-background transition-all relative group"
          >
            <Settings className="h-4 w-4 text-muted-foreground group-hover:text-indigo-600 transition-colors group-hover:rotate-45" />
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 cursor-pointer p-1.5 pr-3 hover:bg-muted/30 rounded-2xl transition-all duration-200 group border border-transparent hover:border-border/50">
              <div className="h-10 w-10 border-2 border-indigo-500/20 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/20 transition-all group-hover:shadow-indigo-500/30 group-hover:-translate-y-0.5 shrink-0">
                AM
              </div>
              <div className="text-left hidden lg:block">
                <div className="flex items-center gap-1">
                  <p className="text-sm font-black text-foreground leading-none">
                    Arjun Mehta
                  </p>
                  <ChevronDown className="h-3 w-3 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                </div>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1.5">
                  ST-2023-0492
                </p>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 rounded-2xl p-2 mt-2 shadow-2xl border-border/50"
            align="end"
          >
            <DropdownMenuLabel className="font-black text-xs uppercase tracking-widest text-muted-foreground px-3 py-2">
              Account Control
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border/50" />
            <DropdownMenuItem className="rounded-xl flex items-center gap-3 px-3 py-2.5 font-bold text-sm cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400">
              <User className="h-4 w-4" />
              <span>Personal Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-xl flex items-center gap-3 px-3 py-2.5 font-bold text-sm cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400">
              <Settings className="h-4 w-4" />
              <span>User Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border/50" />
            <DropdownMenuItem
              onClick={handleLogout}
              className="rounded-xl flex items-center gap-3 px-3 py-2.5 font-bold text-sm cursor-pointer text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:text-rose-600"
            >
              <LogOut className="h-4 w-4" />
              <span>Direct Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
