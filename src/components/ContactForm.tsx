"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { BUDGETS, HOME_TYPES, MAILTO_TO, MESSAGE_MAX, enquiryText, mailtoUrl, whatsappUrl, type Enquiry } from "@/lib/contact";
import { AlertIcon, CheckIcon, ChevronDownIcon } from "./ContactIcons";

type Field = keyof Enquiry;
type Channel = "whatsapp" | "email";

/** Field order: the first invalid one in this order gets focus on submit. */
const ORDER: Field[] = ["name", "phone", "email", "homeType", "locality", "budget", "message"];

const EMPTY: Enquiry = { name: "", phone: "", email: "", homeType: "", locality: "", budget: BUDGETS[0], message: "" };

function validate(v: Enquiry): Partial<Record<Field, string>> {
  const errors: Partial<Record<Field, string>> = {};
  if (v.name.trim().length < 2) errors.name = "Please enter your name.";
  const phone = v.phone.trim();
  const digits = phone.replace(/\D/g, "").length;
  if (!phone) errors.phone = "Please enter a phone number we can reach you on.";
  else if (!/^[+\d][\d\s()-]*$/.test(phone)) errors.phone = "Use only digits, spaces and an optional + at the start, e.g. +91 98200 12345.";
  else if (digits < 10 || digits > 13) errors.phone = "That number looks incomplete. Use 10 digits, e.g. 98200 12345.";
  if (v.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) errors.email = "This email doesn't look right. Check it, or leave it blank.";
  if (!v.homeType) errors.homeType = "Please choose the type of home.";
  return errors;
}

const id = (f: Field) => `enquiry-${f}`;

const control =
  "block w-full border border-ink/25 bg-white/70 px-4 text-base transition-colors placeholder:text-ink/40 hover:border-ink/45 focus:border-navy aria-invalid:border-error";

/** Label above, control, optional helper, then an always-present live region for the error. */
function FieldRow({ field, label, required, hint, error, children, className = "" }: { field: Field; label: string; required?: boolean; hint?: string; error?: string; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label htmlFor={id(field)} className="flex items-baseline gap-1.5 text-[0.9375rem] font-bold text-ink">
        {label}
        {required ? (
          <span aria-hidden className="text-gold-deep">
            *
          </span>
        ) : (
          <span className="text-sm font-normal text-ink/60">(optional)</span>
        )}
      </label>
      {hint && (
        <p id={`${id(field)}-hint`} className="mt-1 text-sm leading-snug text-ink/65">
          {hint}
        </p>
      )}
      <div className="mt-2">{children}</div>
      <p id={`${id(field)}-error`} aria-live="polite" className="text-sm leading-snug text-error empty:hidden">
        {error && (
          <span className="mt-2 flex items-start gap-1.5">
            <AlertIcon className="mt-px size-4 shrink-0" />
            {error}
          </span>
        )}
      </p>
    </div>
  );
}

/** Enquiry form for /contact. No backend: a valid submit opens WhatsApp (or email) with the answers filled in. */
export default function ContactForm() {
  const [values, setValues] = useState<Enquiry>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<"idle" | "opening" | "done">("idle");
  const [channel, setChannel] = useState<Channel>("whatsapp");
  const [blocked, setBlocked] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);
  const timer = useRef<number | undefined>(undefined);

  // Without JavaScript the browser's own validation and the mailto: action run. Once hydrated, we validate ourselves.
  useEffect(() => {
    if (formRef.current) formRef.current.noValidate = true;
    return () => window.clearTimeout(timer.current);
  }, []);

  useEffect(() => {
    if (status === "done") doneRef.current?.focus();
  }, [status]);

  const errors = validate(values);
  const shown = (f: Field) => (touched[f] || submitted ? errors[f] : undefined);
  const errorCount = ORDER.filter((f) => errors[f]).length;
  const text = enquiryText(values);
  const wa = whatsappUrl(text);
  const mail = mailtoUrl(values);

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const f = e.target.dataset.field as Field;
    const value = f === "message" ? e.target.value.slice(0, MESSAGE_MAX) : e.target.value;
    setValues((v) => ({ ...v, [f]: value }));
  };
  const onBlur = (f: Field) => () => setTouched((t) => (t[f] ? t : { ...t, [f]: true }));

  const describedBy = (f: Field, hint?: boolean) => [hint && `${id(f)}-hint`, f === "message" && `${id(f)}-count`, `${id(f)}-error`].filter(Boolean).join(" ");
  const common = (f: Field, hint?: boolean) => ({
    id: id(f),
    "data-field": f,
    value: values[f],
    onChange,
    onBlur: onBlur(f),
    "aria-invalid": shown(f) ? true : undefined,
    "aria-describedby": describedBy(f, hint),
  });

  function send(via: Channel) {
    setSubmitted(true);
    const first = ORDER.find((f) => errors[f]);
    if (first) {
      document.getElementById(id(first))?.focus();
      return;
    }
    setChannel(via);
    if (via === "whatsapp") {
      // Open synchronously inside the click/submit so popup blockers treat it as user-initiated.
      const w = window.open(wa, "_blank");
      if (w) w.opener = null;
      setBlocked(!w);
    } else {
      window.location.assign(mail);
    }
    setStatus("opening");
    timer.current = window.setTimeout(() => setStatus("done"), 700);
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (status === "idle") send("whatsapp");
  };

  if (status === "done") {
    const viaWa = channel === "whatsapp";
    return (
      <div className="border-t border-black/10 pt-10">
        <span className="grid size-12 place-items-center rounded-full border border-navy/25 text-navy">
          <CheckIcon className="size-6" />
        </span>
        <h3 ref={doneRef} tabIndex={-1} style={{ outline: "none" }} className="mt-6 font-serif text-[1.75rem] font-normal leading-tight sm:text-[2rem]">
          {viaWa && blocked ? "Almost there: open WhatsApp to send." : viaWa ? "Your enquiry is ready in WhatsApp. Press send." : "Your enquiry is ready in your email app. Press send."}
        </h3>
        <p className="mt-4 max-w-[52ch] leading-[1.7] text-ink/75">
          {viaWa && blocked
            ? "Your browser stopped the new tab. Use the button below and your answers will be waiting in the chat."
            : viaWa
              ? "We've written the message for you in a new WhatsApp tab. Check it, press send, and Sanket or Ishita will get back to you."
              : `We've filled in an email to ${MAILTO_TO.replace(",", " and ")}. Check it, press send, and we will get back to you.`}
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
          <a
            href={viaWa ? wa : mail}
            {...(viaWa ? { target: "_blank", rel: "noreferrer" } : {})}
            className="inline-flex min-h-12 items-center justify-center bg-navy px-8 font-logo text-label font-medium uppercase tracking-[0.22em] text-ivory transition-colors hover:bg-gold-deep"
          >
            {viaWa ? (blocked ? "Open WhatsApp" : "Open WhatsApp again") : "Open email again"}
          </a>
          <a href={viaWa ? mail : wa} {...(viaWa ? {} : { target: "_blank", rel: "noreferrer" })} className="inline-flex min-h-12 items-center text-[0.9375rem] underline decoration-ink/30 underline-offset-4 hover:text-gold-deep hover:decoration-gold-deep">
            {viaWa ? "Prefer email? Send by email" : "Prefer WhatsApp? Send on WhatsApp"}
          </a>
        </div>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 inline-flex min-h-11 items-center text-[0.9375rem] text-ink/70 underline decoration-ink/30 underline-offset-4 hover:text-gold-deep"
        >
          Edit my answers
        </button>
      </div>
    );
  }

  const opening = status === "opening";

  return (
    <form ref={formRef} action={`mailto:${MAILTO_TO}?subject=${encodeURIComponent("Plan my home: enquiry")}`} method="post" encType="text/plain" onSubmit={onSubmit} aria-describedby="enquiry-note">
      <p id="enquiry-note" className="text-sm text-ink/65">
        Fields marked <span className="text-gold-deep">*</span> are required.
      </p>

      <div className="mt-6 grid gap-x-6 gap-y-7 sm:grid-cols-2">
        <FieldRow field="name" label="Your name" required error={shown("name")} className="sm:col-span-2">
          <input {...common("name")} name="Name" type="text" required autoComplete="name" autoCapitalize="words" enterKeyHint="next" className={`${control} h-12`} />
        </FieldRow>

        <FieldRow field="phone" label="Phone" required hint="We'll call or WhatsApp you on this." error={shown("phone")}>
          <input {...common("phone", true)} name="Phone" type="tel" required inputMode="tel" autoComplete="tel" enterKeyHint="next" placeholder="+91 98200 12345" className={`${control} h-12`} />
        </FieldRow>

        <FieldRow field="email" label="Email" hint="If you'd also like a reply by email." error={shown("email")}>
          <input {...common("email", true)} name="Email" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" spellCheck={false} enterKeyHint="next" className={`${control} h-12`} />
        </FieldRow>

        <FieldRow field="homeType" label="Home type" required error={shown("homeType")}>
          <div className="relative">
            <select {...common("homeType")} name="Home type" required className={`${control} h-12 appearance-none pr-11 ${values.homeType ? "" : "text-ink/55"}`}>
              <option value="" disabled>
                Choose one
              </option>
              {HOME_TYPES.map((t) => (
                <option key={t} value={t} className="text-ink">
                  {t}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-ink/60" />
          </div>
        </FieldRow>

        <FieldRow field="budget" label="Budget" error={shown("budget")}>
          <div className="relative">
            <select {...common("budget")} name="Budget" className={`${control} h-12 appearance-none pr-11`}>
              {BUDGETS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-ink/60" />
          </div>
        </FieldRow>

        <FieldRow field="locality" label="Locality in Mumbai" hint="For example Bandra West, Powai or Juhu." error={shown("locality")} className="sm:col-span-2">
          <input {...common("locality", true)} name="Locality" type="text" autoComplete="address-level3" autoCapitalize="words" enterKeyHint="next" className={`${control} h-12`} />
        </FieldRow>

        <FieldRow field="message" label="Tell us about your home" hint="Rooms, timelines, a style you love, anything that helps." error={shown("message")} className="sm:col-span-2">
          <textarea {...common("message", true)} name="Message" rows={4} maxLength={MESSAGE_MAX} className={`${control} min-h-32 resize-y py-3 leading-[1.6]`} />
          {/* Not a live region: screen readers hear the count via aria-describedby when they reach the field. */}
          <p id={`${id("message")}-count`} className={`mt-1.5 text-right text-sm tabular-nums ${values.message.length >= MESSAGE_MAX ? "text-error" : "text-ink/60"}`}>
            <span className="sr-only">Characters used: </span>
            {values.message.length} / {MESSAGE_MAX}
          </p>
        </FieldRow>
      </div>

      <p aria-live="polite" className="text-sm text-error empty:hidden">
        {submitted && errorCount > 0 && <span className="mt-6 block">{errorCount === 1 ? "Please check the highlighted field." : `Please check the ${errorCount} highlighted fields.`}</span>}
      </p>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
        <button
          type="submit"
          aria-disabled={opening || undefined}
          className="inline-flex min-h-12 items-center justify-center gap-3 bg-navy px-8 font-logo text-label font-medium uppercase tracking-[0.22em] text-ivory transition-colors hover:bg-gold-deep aria-disabled:cursor-progress aria-disabled:opacity-80"
        >
          {opening && <span aria-hidden className="size-4 rounded-full border-2 border-ivory/30 border-t-ivory motion-safe:animate-spin" />}
          {opening ? (channel === "whatsapp" ? "Opening WhatsApp" : "Opening email") : "Plan my home"}
        </button>
        <button
          type="button"
          onClick={() => status === "idle" && send("email")}
          className="inline-flex min-h-11 items-center self-start text-[0.9375rem] underline decoration-ink/30 underline-offset-4 hover:text-gold-deep hover:decoration-gold-deep sm:self-auto"
        >
          Prefer email? Send by email
        </button>
      </div>
      <p className="mt-4 max-w-[56ch] text-sm leading-[1.6] text-ink/65">
        Plan my home opens WhatsApp with your answers written out, so you can read the message before you send it. Nothing is stored on this website.
      </p>
      <noscript>
        <p className="mt-4 max-w-[56ch] text-sm leading-[1.6] text-ink/75">With JavaScript off, this form opens your email app instead. You can also use the WhatsApp, phone and email links on this page.</p>
      </noscript>
      <span aria-live="polite" className="sr-only">
        {opening ? (channel === "whatsapp" ? "Opening WhatsApp in a new tab." : "Opening your email app.") : ""}
      </span>
    </form>
  );
}
