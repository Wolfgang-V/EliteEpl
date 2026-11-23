"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase-browser";
import { button, card, input } from "./ui";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setLoading(false);
  }

  return (
    <form onSubmit={signIn} className={`${card} mx-auto max-w-sm space-y-4`}>
      <h1 className="font-display text-3xl uppercase text-ink">Admin login</h1>

      <label className="block space-y-1 text-sm font-semibold">
        <span>Email</span>
        <input className={input} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>

      <label className="block space-y-1 text-sm font-semibold">
        <span>Password</span>
        <input className={input} type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>

      {error && <p className="text-sm font-semibold text-red-600">{error}</p>}

      <button className={`${button} w-full`} disabled={loading}>
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
