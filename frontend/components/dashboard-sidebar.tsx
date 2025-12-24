"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import "crypto";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
interface SidebarItem {
  id?: string;
  label: string;
  href: string;
  icon: string;
}

interface DashboardSidebarProps {
  activeItem?: string;
}

export function DashboardSidebar({
  activeItem = "tailor",
}: DashboardSidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [User, setUser] = useState({
    name: "User",
    email: "example@gmaail.com",
    url: "https://media.istockphoto.com/id/1451587807/vector/user-profile-icon-vector-avatar-or-person-icon-profile-picture-portrait-symbol-vector.jpg?s=1024x1024&w=is&k=20&c=ZVVVbYUtoZgPqbVSDxoltjnrW3G_4DLKYk6QZ0uu5_w=",
  });
  useEffect(() => {
    const loadProfile = async () => {
      const res = await fetch("/api/profile", {
        credentials: "include",
      });

      if (!res.ok) {
        return;
      }

      const data = await res.json();
      setUser({ name: data.name, email: data.email, url: data.profilePicture });
    };

    loadProfile();
  }, []);
  const router = useRouter();
  const items: SidebarItem[] = [
    {
      id: crypto.randomUUID(),
      label: "Tailor Resume",
      href: "/dashboard",
      icon: "✨",
    },
    {
      id: crypto.randomUUID(),
      label: "Resume History",
      href: "/dashboard/history",
      icon: "📚",
    },
    {
      id: crypto.randomUUID(),
      label: "Profile",
      href: "/dashboard/profile",
      icon: "👤",
    },
    { id: crypto.randomUUID(), label: "Cover Letter", href: "#", icon: "📝" },
    { id: crypto.randomUUID(), label: "Interview Tips", href: "#", icon: "🎯" },
  ];
  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      router.push("/"); // or window.location.href = "/"
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };
  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.4 }}
      className="w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border h-screen flex flex-col fixed left-0 top-0"
    >
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <h2 className="text-2xl font-bold text-sidebar-foreground">
          Resume Tailor
        </h2>
      </div>
      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {items.map((item) => (
          <Link key={item.id} href={item.href}>
            <motion.div
              whileHover={{ x: 4 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                activeItem === item.label.toLowerCase().replace(" ", "-")
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "hover:bg-sidebar-accent/20 text-sidebar-foreground"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </motion.div>
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-3 px-3 py-2 hover:bg-muted  rounded-2xl cursor-pointer transition">
        <Avatar className="object-contain w-10 h-10 rounded-full">
          <AvatarImage
            src={User.url}
            alt={User.name[0]}
            className="rounded-full"
          />
          <AvatarFallback className="bg-secondary text-secondary-foreground  font-semibold">
            {User.name[0]}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-white  truncate">
            {User.name}
          </p>
          <p className="text-xs text-white  truncate">{User.email}</p>
        </div>
      </div>
      {/* Logout Button */}
      <div className=" border-t border-sidebar-border">
        <Button
          onClick={handleLogout}
          className="w-full bg-sidebar-accent cursor-pointer hover:bg-sidebar-accent/90 text-sidebar-accent-foreground rounded-lg font-semibold"
        >
          Logout
        </Button>
      </div>
    </motion.div>
  );
}
