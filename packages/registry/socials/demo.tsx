"use client";

import { Socials } from "./socials";

export default function SocialsDemo() {
  return (
    <div className="flex flex-col items-center gap-6">
      <Socials
        links={{
          github: "https://github.com/justin06lee",
          x: "https://x.com/justin06lee",
          linkedin: "https://linkedin.com/in/justin06lee",
          email: "hi@example.com",
          website: "https://justin06lee.dev",
        }}
      />
      <Socials
        size="sm"
        gap="tight"
        links={{
          github: "https://github.com/justin06lee",
          youtube: "https://youtube.com/@justin06lee",
          instagram: "https://instagram.com/justin06lee",
        }}
      />
    </div>
  );
}
