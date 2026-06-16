"use client";

import { LoginForm } from "./login-form";

export default function LoginFormDemo() {
  // Fake async submit: "secret" succeeds, "limit" rate-limits, anything else fails.
  async function onSubmit(credentials: Record<string, string>) {
    await new Promise((r) => setTimeout(r, 700));
    const pw = credentials.password;
    if (pw === "limit") return { rateLimited: true as const };
    if (pw !== "secret") return { error: "wrong password." };
    // success — nothing to return.
  }

  return (
    <div className="flex w-full items-center justify-center p-4">
      <LoginForm onSubmit={onSubmit} />
    </div>
  );
}
