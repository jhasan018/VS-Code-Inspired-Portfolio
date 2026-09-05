"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import toast from "react-hot-toast";

export default function LumeContactForm() {
  const [sending, setSending] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);

    const form = new FormData(e.currentTarget);

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Object.fromEntries(form)),
    });

    setSending(false);

    if (res.ok) {
      toast.success("Message transmitted. Thank you.");
      e.currentTarget.reset();
    } else {
      toast.error("Transmission failed. Please try again.");
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2.5 block text-[10px] uppercase tracking-[0.2em] text-[#8a8174]">
            Your name
          </span>
          <input
            name="name"
            required
            minLength={2}
            placeholder="Full name"
            className="w-full rounded-xl border border-white/[0.08] bg-[#0c0a08] px-4 py-3 text-sm text-[#f4efe6] outline-none transition-colors placeholder:text-[#6f675c] focus:border-[hsl(258_94%_76%_/_0.5)]"
          />
        </label>

        <label className="block">
          <span className="mb-2.5 block text-[10px] uppercase tracking-[0.2em] text-[#8a8174]">
            Email address
          </span>
          <input
            name="email"
            type="email"
            required
            placeholder="you@company.com"
            className="w-full rounded-xl border border-white/[0.08] bg-[#0c0a08] px-4 py-3 text-sm text-[#f4efe6] outline-none transition-colors placeholder:text-[#6f675c] focus:border-[hsl(258_94%_76%_/_0.5)]"
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-2.5 block text-[10px] uppercase tracking-[0.2em] text-[#8a8174]">
          Project subject
        </span>
        <input
          name="subject"
          required
          minLength={2}
          placeholder="What should we build?"
          className="w-full rounded-xl border border-white/[0.08] bg-[#0c0a08] px-4 py-3 text-sm text-[#f4efe6] outline-none transition-colors placeholder:text-[#6f675c] focus:border-[hsl(258_94%_76%_/_0.5)]"
        />
      </label>

      <label className="block">
        <span className="mb-2.5 block text-[10px] uppercase tracking-[0.2em] text-[#8a8174]">
          Tell me about it
        </span>
        <textarea
          name="message"
          required
          minLength={10}
          rows={5}
          placeholder="Context, outcome, and any constraints that matter."
          className="w-full resize-none rounded-xl border border-white/[0.08] bg-[#0c0a08] px-4 py-3 text-sm leading-relaxed text-[#f4efe6] outline-none transition-colors placeholder:text-[#6f675c] focus:border-[hsl(258_94%_76%_/_0.5)]"
        />
      </label>

      <button
        type="submit"
        disabled={sending}
        className="group relative inline-flex w-fit items-center gap-2.5 overflow-hidden rounded-full px-7 py-3.5 text-sm font-semibold text-[#0b0907] transition-transform duration-300 hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="absolute inset-0 bg-[linear-gradient(135deg,#E0D5FE,#A78BFA_55%,#7c3aed)]" />
        <span className="absolute inset-0 translate-y-full bg-[linear-gradient(135deg,#E0D5FE,#e0bd6b)] transition-transform duration-300 group-hover:translate-y-0" />
        <span className="relative z-10 inline-flex items-center gap-2.5">
          {sending ? "Transmitting…" : "Send Message"}
          <ArrowUpRight className="size-4" />
        </span>
      </button>
    </form>
  );
}