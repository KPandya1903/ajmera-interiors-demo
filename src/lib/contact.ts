/** Studio contact details (from the original site) and the enquiry-message builders used by /contact. */

export const WHATSAPP_NUMBER = "919326451272";

export const PHONES = [
  { display: "+91 93264 51272", tel: "+919326451272" },
  { display: "+91 70213 36382", tel: "+917021336382" },
] as const;

export const EMAILS = [
  { address: "sanket@ajmerainteriors.com", name: "Sanket Ajmera", role: "Founder" },
  { address: "ishita@ajmerainteriors.com", name: "Ishita Mehta", role: "Co-founder" },
] as const;

export const SOCIAL = [
  { label: "Instagram", href: "https://instagram.com/ajmerainteriors" },
  { label: "YouTube", href: "https://www.youtube.com/@AjmeraInteriors" },
  { label: "Pinterest", href: "https://pin.it/2ymAAT2rU" },
] as const;

/** Both founders, comma-separated, for mailto: links and the no-JS form action. */
export const MAILTO_TO = EMAILS.map((e) => e.address).join(",");

export const HOME_TYPES = ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5 BHK+", "Villa", "Commercial"] as const;

export const BUDGETS = ["Not sure yet", "Up to ₹15 lakh", "₹15–30 lakh", "₹30–60 lakh", "₹60 lakh+"] as const;

/** Longest free-text message the form accepts. */
export const MESSAGE_MAX = 600;

export type Enquiry = {
  name: string;
  phone: string;
  email: string;
  homeType: string;
  locality: string;
  budget: string;
  message: string;
};

/** Plain-text enquiry, the same for WhatsApp and email. Empty optional answers are left out. */
export function enquiryText(e: Enquiry) {
  const rows: [string, string][] = [
    ["Name", e.name],
    ["Phone", e.phone],
    ["Email", e.email],
    ["Home", e.homeType],
    ["Locality", e.locality ? `${e.locality}, Mumbai` : ""],
    ["Budget", e.budget],
  ];
  const lines = rows.filter(([, v]) => v.trim()).map(([k, v]) => `${k}: ${v.trim()}`);
  const note = e.message.trim();
  return ["Hi Ajmera Interiors, I'd like to plan my home.", "", ...lines, ...(note ? ["", note] : [])].join("\n");
}

export const whatsappUrl = (text: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

/** Encoded mailto: bodies above this are cut off by some mail apps and browsers. */
const MAILTO_BODY_MAX = 1800;

/**
 * Email draft to both founders. If the encoded body is too long for a mailto: link (a long message,
 * or non-Latin text that encodes to ~9 characters per letter), the free-text message is left out.
 */
export function mailtoUrl(e: Enquiry, subject = "Plan my home: enquiry") {
  let body = encodeURIComponent(enquiryText(e));
  if (body.length > MAILTO_BODY_MAX) body = encodeURIComponent(`${enquiryText({ ...e, message: "" })}\n\nFull details sent on WhatsApp.`);
  return `mailto:${MAILTO_TO}?subject=${encodeURIComponent(subject)}&body=${body}`;
}
