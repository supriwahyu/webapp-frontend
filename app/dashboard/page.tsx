"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "../../lib/api";

type User = {
  username: string;
};

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    apiRequest("/api/getProfile", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((data: User) => setUser(data))
      .catch(() => router.push("/login"));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const goToProfile = () => {
    router.push("/profile"); // navigate to Profile page
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4 gap-6">
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      {user ? <p>Welcome, {user.username}</p> : <p>Loading...</p>}

      <div className="flex flex-col gap-4">
        <button
          onClick={goToProfile}
          className="bg-green-600 py-2 px-4 rounded hover:bg-green-700"
        >
          Edit Profile
        </button>

        <button
          onClick={handleLogout}
          className="bg-red-600 py-2 px-4 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
