import type { Metadata } from "next";
import { breadcrumbSchema, faqSchema, BASE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Randevu Al — Machine Gym | Bolu Spor Salonu Online Randevu",
  description: "Machine Gym Bolu'da özel ders randevusu alın. Boks, kickboks, muay thai, personal trainer.",
  keywords: ["machine gym randevu", "bolu spor salonu randevu", "boks dersi randevu bolu"],
  alternates: { canonical: `${BASE_URL}/randevu` },
  openGraph: {
    title: "Randevu Al — Machine Gym Bolu",
    description: "Özel ders randevusu için online randevu alın.",
    url: `${BASE_URL}/randevu`,
    siteName: "Machine Gym",
    locale: "tr_TR",
    type: "website",
  },
};

const RANDEVU_FAQ = [
  { question: "Machine Gym'de özel ders randevusu nasıl alınır?", answer: "Online randevu formunu doldurarak tercih ettiğiniz tarih ve saati seçin. Randevu onayı WhatsApp ile iletilir." },
  { question: "Hangi hizmetler için randevu alabiliyorum?", answer: "Personal trainer, boks özel dersi, kickboks ve muay thai için randevu alabilirsiniz." },
];

const breadcrumbJsonLd = breadcrumbSchema([
  { name: "Ana Sayfa", url: BASE_URL },
  { name: "Randevu Al", url: `${BASE_URL}/randevu` },
]);
const faqJsonLd = faqSchema(RANDEVU_FAQ);

export default function RandevuLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      {children}
    </>
  );
}
