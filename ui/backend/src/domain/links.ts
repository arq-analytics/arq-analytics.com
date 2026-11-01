/** The only place a wa.me, tel or mailto URL is built. Numbers come from site.json. */

export function whatsappUrl(whatsappNumber: string, text?: string): string {
  const digits = whatsappNumber.replace(/\D/g, "");
  return text ? `https://wa.me/${digits}?text=${encodeURIComponent(text)}` : `https://wa.me/${digits}`;
}

export const telUrl = (phoneE164: string): string => `tel:${phoneE164}`;

export const mailtoUrl = (email: string): string => `mailto:${email}`;
