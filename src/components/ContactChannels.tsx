import type { ReactNode } from "react";
import { EMAILS, PHONES, SOCIAL } from "@/lib/contact";
import { ArrowUpRightIcon, ChatIcon, InstagramIcon, MailIcon, PhoneIcon, PinterestIcon, YouTubeIcon } from "./ContactIcons";
import { WHATSAPP } from "./ui";

const SOCIAL_ICONS = { Instagram: InstagramIcon, YouTube: YouTubeIcon, Pinterest: PinterestIcon } as const;

/** One large tappable contact row (min 64px): icon, small caps label, the number or address, arrow. */
function Row({ href, icon, label, value, note, external, primary }: { href: string; icon: ReactNode; label: string; value: string; note?: string; external?: boolean; primary?: boolean }) {
  return (
    <li>
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
        className={`group flex min-h-16 items-center gap-4 py-4 transition-colors sm:gap-5 ${primary ? "bg-sand px-4 sm:px-5" : "border-b border-black/10"} hover:text-gold-deep`}
      >
        <span className={`grid size-10 shrink-0 place-items-center rounded-full border ${primary ? "border-navy/25 text-navy" : "border-black/15 text-ink/70"} transition-colors group-hover:border-gold-deep group-hover:text-gold-deep`}>
          {icon}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-logo text-label font-medium uppercase tracking-[0.22em] text-gold-deep">
            {label}
            {note && <span className="tracking-[0.12em] text-ink/55 normal-case"> · {note}</span>}
          </span>
          <span className="mt-1 block text-lg leading-snug [overflow-wrap:anywhere] sm:text-xl">{value}</span>
        </span>
        <ArrowUpRightIcon className="size-4 shrink-0 text-ink/40 transition-[color,transform] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold-deep" />
      </a>
    </li>
  );
}

/** Left column of /contact: WhatsApp first, then phones, emails and socials. */
export default function ContactChannels() {
  return (
    <section aria-labelledby="channels-title">
      <h2 id="channels-title" className="font-serif text-[1.75rem] font-normal leading-tight sm:text-[2rem]">
        Talk to us directly
      </h2>
      <p className="mt-3 max-w-[44ch] leading-[1.7] text-ink/75">Free first consultation, at your home or ours.</p>

      <ul className="mt-8">
        <Row primary external href={WHATSAPP} icon={<ChatIcon />} label="WhatsApp" note="fastest reply" value={PHONES[0].display} />
        {PHONES.map((p) => (
          <Row key={p.tel} href={`tel:${p.tel}`} icon={<PhoneIcon />} label="Call" value={p.display} />
        ))}
        {EMAILS.map((e) => (
          <Row key={e.address} href={`mailto:${e.address}`} icon={<MailIcon />} label="Email" note={`${e.name}, ${e.role.toLowerCase()}`} value={e.address} />
        ))}
      </ul>

      <p className="mt-8 max-w-[44ch] text-[0.9375rem] leading-[1.7] text-ink/70">
        We work across Mumbai. Our design fee is 10% of the project cost, and we will walk you through it at the first meeting.
      </p>

      <div className="mt-10">
        <p className="font-logo text-label font-medium uppercase tracking-[0.22em] text-gold-deep">Follow our work</p>
        <ul className="mt-3 flex gap-2">
          {SOCIAL.map(({ label, href }) => {
            const I = SOCIAL_ICONS[label];
            return (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Ajmera Interiors on ${label}`}
                  className="grid size-12 place-items-center rounded-full border border-black/15 text-ink/75 transition-colors hover:border-gold-deep hover:text-gold-deep"
                >
                  <I className="size-5" />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
