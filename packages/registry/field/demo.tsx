"use client";

import { useState } from "react";
import { Field } from "./field";
import { Input } from "../input/input";
import { Textarea } from "../textarea/textarea";

export default function FieldDemo() {
  const [email, setEmail] = useState("not-an-email");
  const valid = /.+@.+\..+/.test(email);

  return (
    <div className="flex w-full max-w-md flex-col gap-6 border border-white/10 bg-black p-6">
      <Field
        label="email"
        required
        hint="the invite goes here."
        error={valid ? undefined : "that doesn't look like an email address."}
      >
        {(props) => (
          <Input
            {...props}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        )}
      </Field>

      <Field label="anything i should know?" optional>
        {(props) => <Textarea {...props} rows={3} placeholder="context, links, a question" />}
      </Field>
    </div>
  );
}
