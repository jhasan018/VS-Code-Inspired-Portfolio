"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

const schema = z.object({
  name:    z.string().min(2, "Name is too short"),
  email:   z.string().email("Invalid email"),
  subject: z.string().min(2, "Subject is too short"),
  message: z.string().min(10, "Message is too short"),
});
type FormData = z.infer<typeof schema>;

export default function ContactPage() {
  const [sending, setSending] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setSending(true);
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (res.ok) { toast.success("Message sent! I'll reply soon."); reset(); }
      else toast.error("Something went wrong. Try again.");
    } catch { toast.error("Network error."); }
    finally { setSending(false); }
  };

  const inputClass = "w-full bg-[var(--vsc-bg)] border border-[var(--vsc-border)] rounded-md px-4 py-2.5 text-[var(--vsc-text)] text-sm outline-none focus:border-[var(--vsc-accent)] transition-colors placeholder:opacity-40";
  const labelClass = "block text-[11px] md:text-xs text-[var(--vsc-text-dim)] font-mono mb-2 tracking-wide uppercase opacity-80";
  const errorClass = "text-[10px] md:text-xs text-red-500 mt-1 font-mono";

  return (
    <div className="max-w-[90%] mx-auto py-10 md:py-16 animate-in fade-in duration-500">
      <div className="text-[var(--vsc-comment)] font-mono text-xs md:text-sm mb-6 opacity-80">
        {"// contact.tsx — Get in touch"}
      </div>
      <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--vsc-text-bright)] mb-2 font-syne">
        <span className="text-[var(--vsc-keyword)] font-mono">export</span>
        {" "}Contact
      </h1>
      <p className="text-[var(--vsc-text-dim)] text-sm md:text-base mb-12 opacity-90">
        Have a project in mind? Let&apos;s build something great together.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-10 md:gap-14">
        {/* Info Sidebar */}
        <div className="flex flex-col gap-5">
          <div className="vsc-card p-6 border border-[var(--vsc-border)] rounded-xl bg-white/[0.02]">
            <div className="text-3xl mb-4">📬</div>
            <div className="text-xs text-[var(--vsc-text-dim)] font-mono mb-1">// email</div>
            <div className="text-[var(--vsc-accent)] font-semibold break-all">jahid@example.com</div>
          </div>
          <div className="vsc-card p-6 border border-[var(--vsc-border)] rounded-xl bg-white/[0.02]">
            <div className="text-3xl mb-4">📍</div>
            <div className="text-xs text-[var(--vsc-text-dim)] font-mono mb-1">// location</div>
            <div className="text-[var(--vsc-green)] font-semibold">Dhaka, Bangladesh 🇧🇩</div>
          </div>
          <div className="vsc-card p-6 border border-[var(--vsc-border)] rounded-xl bg-white/[0.02]">
            <div className="text-3xl mb-4">🟢</div>
            <div className="text-xs text-[var(--vsc-text-dim)] font-mono mb-1">// status</div>
            <div className="text-[var(--vsc-green)] font-semibold">Available for exciting projects</div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="w-full">
              <label className={labelClass}>name</label>
              <input {...register("name")} className={inputClass} placeholder="John Doe" />
              {errors.name && <div className={errorClass}>{errors.name.message}</div>}
            </div>
            <div className="w-full">
              <label className={labelClass}>email</label>
              <input {...register("email")} type="email" className={inputClass} placeholder="john@example.com" />
              {errors.email && <div className={errorClass}>{errors.email.message}</div>}
            </div>
          </div>
          
          <div>
            <label className={labelClass}>subject</label>
            <input {...register("subject")} className={inputClass} placeholder="Project Inquiry" />
            {errors.subject && <div className={errorClass}>{errors.subject.message}</div>}
          </div>
          
          <div>
            <label className={labelClass}>message</label>
            <textarea {...register("message")} rows={6} className={`${inputClass} resize-none`} placeholder="Tell me about your project..." />
            {errors.message && <div className={errorClass}>{errors.message.message}</div>}
          </div>
          
          <button type="submit" className="btn-primary w-full md:w-auto px-8 py-3.5 rounded-md font-bold flex items-center justify-center gap-2.5 shadow-lg shadow-[var(--vsc-accent)]/20 transition-all active:scale-[0.98]" disabled={sending}>
            <PaperAirplaneIcon className={`w-5 h-5 ${sending ? 'animate-pulse' : ''}`} />
            {sending ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
}
