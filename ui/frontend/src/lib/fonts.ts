import { Manrope, Noto_Sans_Devanagari, Noto_Sans_Gujarati } from "next/font/google";

export const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-latin",
});

// The Indic fonts are split by unicode-range, so a browser downloads one only when
// a page actually shows that script. They are not preloaded.
export const devanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: false,
  variable: "--font-deva",
});

export const gujarati = Noto_Sans_Gujarati({
  subsets: ["gujarati", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: false,
  variable: "--font-guj",
});
