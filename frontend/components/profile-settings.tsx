"use client";

import type React from "react";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useRef, useState } from "react"; // ✅ useRef added
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
interface ProfileSettingsProps {
  user?: {
    name: string;
    email: string;
    profilePicture?: string;
  };
  onSave?: (data: any) => void;
}

export function ProfileSettings({
  user = {
    name: "",
    email: "",
  },
  onSave,
}: ProfileSettingsProps) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null); // ✅ FIX
  const router = useRouter();
  const [User, setUser] = useState<{
    name: string;
    email: string;
    profilePicture?: string;
  }>({ name: "", email: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      const res = await fetch("/api/profile", {
        credentials: "include",
      });

      if (!res.ok) {
        setLoading(false);
        return;
      }

      const data = await res.json();
      setUser(data);
      setFormData({ name: data.name, email: data.email });
      setLoading(false);
    };

    loadProfile();
  }, []);
  const handleAvatarUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }

    const toastId = toast.loading("Uploading profile picture…");

    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch("/api/profile/avatar", {
        method: "POST",
        credentials: "include",
        body: form,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setUser((prev) => ({
        ...prev,
        profilePicture: data.profilePicture,
      }));

      toast.success("Profile picture updated", { id: toastId });
    } catch (err: any) {
      toast.error(err.message || "Upload failed", { id: toastId });
    }
  };

  const [saving, setSaving] = useState(false);
  const [resetPassword, setResetPassword] = useState(false);
  const [saved, setSaved] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (saving) return; // prevent double submit

    try {
      setSaving(true);

      if (!formData.name?.trim()) {
        toast.error("Name can't be empty");
        return;
      }

      if (formData.name.trim().length < 3) {
        toast.error("Name is too short");
        return;
      }

      const res = await fetch("/api/profile", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: formData.name.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to update profile");
        return;
      }

      toast.success("Profile name updated");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const changePassword = async () => {
    if (!currentPassword || !password || !confirmPassword) {
      toast.error("Fill all the fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    try {
      const res = await fetch("/api/profile/password", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword: password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to update password");
        return;
      }

      toast.success("Password updated successfully");

      // Optional: clear fields
      setCurrentPassword("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };
  const handleDelete = async () => {
    try {
      const res = await fetch("/api/profile", {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to delete account");
        return;
      }
      toast.success("Account deleted successfully");
      router.push("/");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6 max-w-2xl"
    >
      <div>
        <h1 className="text-4xl font-bold text-primary mb-2">
          Profile Settings
        </h1>
        <p className="text-muted-foreground text-lg">
          Manage your account information and preferences.
        </p>
      </div>

      {/* Profile Picture */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-2xl p-6"
      >
        <h3 className="text-lg font-bold text-primary mb-4">Profile Picture</h3>
        <div className="flex items-center gap-6">
          <Avatar className="w-20 h-20">
            <AvatarImage
              src={User.profilePicture || "/placeholder.svg"}
              alt={User.name || "User"}
            />
            <AvatarFallback className="text-lg font-bold bg-secondary text-secondary-foreground">
              {User.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleAvatarUpload(file);
              }

              // allow re-selecting same file
              e.target.value = "";
            }}
          />

          <Button
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10 font-semibold rounded-lg"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
          >
            Upload New Picture
          </Button>
        </div>
      </motion.div>

      {/* Personal Information */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-2xl p-6"
      >
        <h3 className="text-lg font-bold text-primary mb-6">
          Personal Information
        </h3>
        <div className="space-y-6">
          {/* Name */}
          <div>
            <Label
              htmlFor="name"
              className="text-base font-medium text-foreground"
            >
              Full Name
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="mt-2 h-11 rounded-lg border-border bg-background text-foreground"
            />
          </div>

          {/* Email */}
          <div>
            <Label
              htmlFor="email"
              className="text-base font-medium text-foreground"
            >
              Email Address
            </Label>
            <Input
              disabled
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-2 h-11 rounded-lg border-border bg-background text-foreground"
            />
          </div>

          {/* Save Button */}
          <motion.div whileHover={{ y: -2 }}>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold h-12 rounded-lg"
            >
              {saved ? "Saved!" : saving ? "Saving..." : "Save Changes"}
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Security */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-card border border-border rounded-2xl p-6"
      >
        <h3 className="text-lg font-bold text-primary mb-6">Security</h3>

        <p className="text-muted-foreground mb-4">
          Keep your account secure by regularly updating your password.
        </p>

        {!resetPassword ? (
          <Button
            type="button"
            onClick={() => setResetPassword(true)}
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10 font-semibold rounded-lg"
          >
            Change Password
          </Button>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              changePassword();
            }}
            className="space-y-4 pt-2"
          >
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current password"
              className="h-11 rounded-lg border-border"
              required
            />

            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
              className="h-11 rounded-lg border-border"
              required
            />

            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="h-11 rounded-lg border-border"
              required
            />

            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold h-11 rounded-lg"
              >
                Reset Password
              </Button>

              <Button
                type="button"
                onClick={() => setResetPassword(false)}
                variant="outline"
                className="flex-1 font-semibold h-11 rounded-lg"
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-red-50 border-2 border-destructive rounded-2xl p-6"
      >
        <h3 className="text-lg font-bold text-destructive mb-3">Danger Zone</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Deleting your account is permanent and cannot be undone. All your data
          will be lost.
        </p>
        <Button
          onClick={handleDelete}
          variant="outline"
          className="border-destructive text-destructive hover:bg-destructive/10 font-semibold rounded-lg bg-transparent"
        >
          Delete Account
        </Button>
      </motion.div>
    </motion.div>
  );
}
