import type { ReactNode } from "react";

/** Line icons for the contact page: one family, 24px grid, 1.5px stroke, currentColor. Decorative (aria-hidden). */
function Icon({ children, className = "size-5" }: { children: ReactNode; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
      {children}
    </svg>
  );
}

type P = { className?: string };

export const ChatIcon = (p: P) => (
  <Icon {...p}>
    <path d="M7.9 20A9 9 0 1 0 4 16.1L2.5 21.5Z" />
    <path d="M9 10.5h.01M12 10.5h.01M15 10.5h.01" />
  </Icon>
);

export const PhoneIcon = (p: P) => (
  <Icon {...p}>
    <path d="M21.5 16.4v2.9a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 1.6 3.6 2 2 0 0 1 3.6 1.5h2.9a2 2 0 0 1 2 1.7c.1.9.4 1.9.7 2.8a2 2 0 0 1-.5 2.1L7.5 9.3a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.8.7a2 2 0 0 1 1.9 2.1Z" />
  </Icon>
);

export const MailIcon = (p: P) => (
  <Icon {...p}>
    <rect x="2.5" y="4.5" width="19" height="15" rx="1.5" />
    <path d="m3 6 9 7 9-7" />
  </Icon>
);

export const ArrowUpRightIcon = (p: P) => (
  <Icon {...p}>
    <path d="M7 17 17 7M8 7h9v9" />
  </Icon>
);

export const ChevronDownIcon = (p: P) => (
  <Icon {...p}>
    <path d="m6 9 6 6 6-6" />
  </Icon>
);

export const CheckIcon = (p: P) => (
  <Icon {...p}>
    <path d="M20 6 9 17l-5-5" />
  </Icon>
);

export const AlertIcon = (p: P) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5v5M12 16.25h.01" />
  </Icon>
);

export const InstagramIcon = (p: P) => (
  <Icon {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <path d="M17.5 6.5h.01" />
  </Icon>
);

export const YouTubeIcon = (p: P) => (
  <Icon {...p}>
    <path d="M2.5 17a24 24 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.6 49.6 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24 24 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.6 49.6 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <path d="m10 15 5-3-5-3Z" />
  </Icon>
);

export const PinterestIcon = (p: P) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9.5" />
    <path d="M11 13.5 9.5 20.5" />
    <path d="M9.4 14.2A4.5 4.5 0 0 1 8 10.8C8 8.2 9.9 6.5 12.3 6.5c2.3 0 3.9 1.6 3.9 3.8 0 2.6-1.3 4.5-3.2 4.5-1 0-1.7-.8-1.5-1.8l.7-2.8" />
  </Icon>
);
