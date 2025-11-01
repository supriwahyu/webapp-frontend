"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "../../lib/api";

type Profile = {
  username?: string;
  fullName?: string;
  bio?: string;
  avatarUrl?: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Load existing profile
  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    apiRequest("/api/getProfile", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((data: Profile) => setProfile(data))
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setSaving(true);

    try {
      const endpoint = profile?.username ? "/api/updateProfile" : "/api/createProfile";
      const data = await apiRequest(endpoint, {
        method: profile?.username ? "PUT" : "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(profile),
      });
      alert("Profile saved successfully!");
      setProfile(data);
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-white text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-semibold mb-6">Profile</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={profile.fullName || ""}
          onChange={handleChange}
          className="border p-2 rounded bg-gray-800 text-white"
        />
        <textarea
          name="bio"
          placeholder="Bio"
          value={profile.bio || ""}
          onChange={handleChange}
          rows={3}
          className="border p-2 rounded bg-gray-800 text-white"
        />
        <input
          type="text"
          name="avatarUrl"
          placeholder="Avatar URL"
          value={profile.avatarUrl || ""}
          onChange={handleChange}
          className="border p-2 rounded bg-gray-800 text-white"
        />

        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 py-2 rounded mt-2 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>

      {profile.avatarUrl && (
        <img
          src={profile.avatarUrl}
          alt="Avatar"
          className="mt-6 w-24 h-24 rounded-full border-2 border-gray-700 object-cover"
        />
      )}
    </div>
  );
}
