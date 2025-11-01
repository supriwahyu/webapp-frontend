"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "../../lib/api";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await apiRequest("/api/register", {
        method: "POST",
        body: JSON.stringify({ username, email, password }),
      });
      localStorage.setItem("token", data.access_token);
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };

  return (
    <form onSubmit={handleRegister} className="flex flex-col gap-3 max-w-sm mx-auto mt-20">
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border p-2 rounded bg-gray-800 text-white"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded bg-gray-800 text-white"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 rounded bg-gray-800 text-white"
      />
      <button className="bg-blue-600 text-white py-2 rounded">Register</button>
    </form>
  );
}
