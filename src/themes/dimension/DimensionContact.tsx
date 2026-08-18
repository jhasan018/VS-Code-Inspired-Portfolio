"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import toast from "react-hot-toast";

import { LiquidButton } from "@/components/ui/liquid-glass-button";

export default function DimensionContact() {
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
   toast.success("Message transmitted.");
   e.currentTarget.reset();
  } else {
   toast.error("Transmission failed.");
  }
 }

 return (
     <form
         className="dimension-form"
         onSubmit={submit}
     >
      <label>
       <span>Your name</span>

       <input
           name="name"
           required
           minLength={2}
       />
      </label>

      <label>
       <span>Email address</span>

       <input
           name="email"
           type="email"
           required
       />
      </label>

      <label>
       <span>Project subject</span>

       <input
           name="subject"
           required
           minLength={2}
       />
      </label>

      <label>
       <span>Tell me about it</span>

       <textarea
           name="message"
           required
           minLength={10}
           rows={5}
       />
      </label>

      <LiquidButton
          type="submit"
          size="large"
          disabled={sending}
      >
       {sending ? "Transmitting…" : "Send Message"}

       <ArrowUpRight />
      </LiquidButton>
     </form>
 );
}