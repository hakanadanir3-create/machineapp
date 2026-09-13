import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar } from "lucide-react";
import { buildMetadata, breadcrumbSchema, faqSchema, BASE_URL } from "@/lib/seo";

const SLUG = "boks-ozel-dersi-ile-fitness";
const TITLE = "Boks Özel Dersi ile Fitness: Aynı Anda Hem Form Hem Savunma";
const EXCERPT = "Bolu'da boks özel dersi almanın fitness hedeflerinize sağladığı faydalar: kalori yakımı, kas dayanıklılığı, koordinasyon ve öz savunma becerisi bir arada.";
const COVER = "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&q=80";
const PUBLISHED = "2026-01-17T09:00:00Z";

export async function generateMetadata() {
  return buildMetadata({
    settingsKey: "seo_blog_boks_ozel_dersi_fitness",
    defaultTitle: `${TITLE} | Gym Machine Bolu`,
    defaultDesc: "Bolu'da boks özel dersi ile hem formunuzu koruyun hem öz savunma öğrenin. Boks derslerinin fitness faydalarını keşfedin.",
    path: `/blog/${SLUG}`,
    keywords: ["bolu boks dersi", "bolu boks özel ders fiyatları", "bolu özel ders fitness", "bolu boks salonu"],
  });
}

const FAQ = [
  { question: "Boks özel dersi kaç kalori yaktırır?", answer: "Yoğunluğa bağlı olarak 60 dakikalık bir boks özel dersi ortalama 500-800 kalori yaktırabilir. Bu, koşu veya bisiklet gibi kardiyo aktivitelerine göre oldukça yüksektir." },
  { question: "Boks fitness için uygun mu?", answer: "Evet. Boks; kardiyovasküler dayanıklılık, kas gücü, koordinasyon ve çeviklik gibi fitness bileşenlerinin tamamını geliştiren tam vücut bir antrenmandır." },
  { question: "Boks özel dersi ne sıklıkla alınmalı?", answer: "Başlangıç seviyesi için haftada 2-3 özel ders idealdir. Kondisyon arttıkça sıklık ve süre kişiye özel olarak artırılabilir." },
];

export default function BlogPost() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: TITLE,
    description: EXCERPT,
    image: COVER,
    datePublished: PUBLISHED,
    dateModified: PUBLISHED,
    url: `${BASE_URL}/blog/${SLUG}`,
    author: { "@type": "Organization", name: "Gym Machine", url: BASE_URL },
    publisher: { "@type": "Organization", name: "Gym Machine", url: BASE_URL, logo: { "@type": "ImageObject", url: `${BASE_URL}/logo.png` } },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE_URL}/blog/${SLUG}` },
  };
  const breadcrumbJsonLd = breadcrumbSchema([
    { name: "Ana Sayfa", url: BASE_URL },
    { name: "Blog", url: `${BASE_URL}/blog` },
    { name: TITLE, url: `${BASE_URL}/blog/${SLUG}` },
  ]);
  const faqJsonLd = faqSchema(FAQ);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Navbar />
      <main style={{ minHeight: "100vh", background: "#0B0B0B" }}>
        <div style={{ position: "relative", height: "400px", overflow: "hidden" }}>
          <img src={COVER} alt="Bolu'da boks özel dersi ile fitness antrenmanı" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(11,11,11,0.3), rgba(11,11,11,0.85))" }} />
          <div style={{ position: "absolute", top: "80px", left: 0, right: 0 }}>
            <div className="page-container">
              <Link href="/blog" style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", color: "rgba(255,255,255,0.7)", fontSize: "0.8125rem", textDecoration: "none", padding: "0.375rem 0.875rem", background: "rgba(0,0,0,0.4)", borderRadius: "8px", backdropFilter: "blur(8px)" }}>
                <ArrowLeft style={{ width: "14px", height: "14px" }} /> Blog&apos;a Dön
              </Link>
            </div>
          </div>
        </div>

        <div className="page-container" style={{ paddingBottom: "5rem" }}>
          <article style={{ maxWidth: "720px", marginInline: "auto" }}>
            <div style={{ paddingTop: "2.5rem", marginBottom: "2.5rem" }}>
              <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                {["Boks", "Fitness"].map((tag) => (
                  <span key={tag} style={{ padding: "0.25rem 0.75rem", background: "rgba(106,13,37,0.25)", color: "#D4AF37", fontSize: "0.75rem", fontWeight: 600, borderRadius: "9999px", border: "1px solid rgba(106,13,37,0.4)" }}>{tag}</span>
                ))}
              </div>
              <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 800, color: "#fff", fontFamily: "var(--font-heading)", lineHeight: 1.25, marginBottom: "1rem" }}>{TITLE}</h1>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "1.0625rem", lineHeight: 1.65, borderLeft: "3px solid #6A0D25", paddingLeft: "1rem", marginBottom: "1rem" }}>{EXCERPT}</p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "rgba(255,255,255,0.3)", fontSize: "0.8125rem" }}>
                <Calendar style={{ width: "14px", height: "14px" }} />
                <span>{new Date(PUBLISHED).toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" })}</span>
                <span style={{ margin: "0 0.25rem" }}>·</span>
                <span>Gym Machine</span>
              </div>
            </div>

            <div style={{ height: "1px", background: "#2A2A2A", marginBottom: "2.5rem" }} />

            <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.9375rem", lineHeight: 1.8 }}>
              <p style={{ marginBottom: "1.25rem" }}>
                Fitness hedefi olan pek çok kişi, klasik kardiyo ve ağırlık antrenmanlarının monotonluğundan sıkılır. <strong style={{ color: "#D4AF37" }}>Bolu&apos;da boks özel dersi</strong>, bu monotonluğu kırarken hem formunuzu korumanızı hem de öz savunma becerisi kazanmanızı sağlayan iki yönlü bir çözümdür.
              </p>

              <h2 style={{ color: "#fff", fontSize: "1.375rem", fontWeight: 700, margin: "2rem 0 0.875rem", fontFamily: "var(--font-heading)" }}>Boks Özel Dersinin Fitness Faydaları</h2>
              <ul style={{ paddingLeft: "1.5rem", marginBottom: "1.25rem" }}>
                <li style={{ marginBottom: "0.375rem" }}><strong style={{ color: "#D4AF37" }}>Yüksek kalori yakımı:</strong> Yoğun tempo torba ve pad çalışmaları, klasik kardiyoya göre daha fazla kalori yaktırır.</li>
                <li style={{ marginBottom: "0.375rem" }}><strong style={{ color: "#D4AF37" }}>Tam vücut kas çalışması:</strong> Yumruk atarken bacak, gövde ve kol kasları eş zamanlı çalışır.</li>
                <li style={{ marginBottom: "0.375rem" }}><strong style={{ color: "#D4AF37" }}>Koordinasyon ve refleks:</strong> Kombinasyon vuruşları el-göz koordinasyonunu geliştirir.</li>
                <li style={{ marginBottom: "0.375rem" }}><strong style={{ color: "#D4AF37" }}>Stres atma:</strong> Torba çalışması, birikmiş stresi fiziksel olarak boşaltmanın etkili bir yoludur.</li>
                <li style={{ marginBottom: "0.375rem" }}><strong style={{ color: "#D4AF37" }}>Öz savunma:</strong> Doğru duruş ve temel savunma teknikleri günlük hayatta özgüven kazandırır.</li>
              </ul>

              <h2 style={{ color: "#fff", fontSize: "1.375rem", fontWeight: 700, margin: "2rem 0 0.875rem", fontFamily: "var(--font-heading)" }}>Özel Ders Neden Grup Dersinden Daha Hızlı Sonuç Verir?</h2>
              <p style={{ marginBottom: "1.25rem" }}>
                Birebir antrenmanda eğitmen sadece size odaklanır; duruşunuzu, yumruk açınızı ve nefes tekniğinizi anlık olarak düzeltir. Bu, teknik hatalardan kaynaklanan sakatlanma riskini azaltırken gelişim hızınızı da belirgin şekilde artırır.
              </p>

              <h2 style={{ color: "#fff", fontSize: "1.375rem", fontWeight: 700, margin: "2rem 0 0.875rem", fontFamily: "var(--font-heading)" }}>Gym Machine&apos;de Boks Özel Dersi</h2>
              <p style={{ marginBottom: "1.25rem" }}>
                <Link href="/bolu-dovus-salonu" style={{ color: "#D4AF37", textDecoration: "underline" }}>Gym Machine Bolu</Link>&apos;da profesyonel boks ringi, çeşitli ağırlıklarda kum torbaları ve sertifikalı antrenörlerle özel ders alabilirsiniz. Program seviyenize göre uyarlanır.
              </p>
              <p style={{ marginBottom: "1.25rem" }}>
                Boks dışında kickboks ve muay thai seçeneklerini karşılaştırmak isterseniz <Link href="/blog/kickboks-muay-thai-baslangic-rehberi" style={{ color: "#D4AF37", textDecoration: "underline" }}>Kickboks ve Muay Thai: Başlangıç Rehberi</Link> yazımıza, Bolu&apos;da dövüş salonu seçim kriterlerine göz atmak için ise <Link href="/blog/bolu-da-dovus-sporlari-neden-gym-machine" style={{ color: "#D4AF37", textDecoration: "underline" }}>Bolu&apos;da Dövüş Sporları: Neden Gym Machine?</Link> yazımıza bakabilirsiniz.
              </p>
            </div>

            <div style={{ marginTop: "3.5rem", background: "rgba(106,13,37,0.08)", border: "1px solid rgba(106,13,37,0.2)", borderRadius: "20px", padding: "2rem", textAlign: "center" }}>
              <p style={{ color: "#D4AF37", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.625rem" }}>Gym Machine&apos;de Antrenman Yap</p>
              <h3 style={{ color: "#fff", fontWeight: 800, fontSize: "1.25rem", fontFamily: "var(--font-heading)", marginBottom: "0.625rem" }}>Boks Özel Dersine Bugün Başla</h3>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>Uzman kadromuzla hedeflerine ulaşmaya bugün başla.</p>
              <Link href="/randevu" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.875rem 2rem", background: "#6A0D25", color: "#fff", fontWeight: 700, fontSize: "0.9375rem", borderRadius: "12px", border: "1px solid rgba(212,175,55,0.3)", textDecoration: "none" }}>
                Randevu Al <ArrowRight style={{ width: "16px", height: "16px" }} />
              </Link>
            </div>
          </article>
        </div>
      </main>
      <WhatsAppButton />
      <Footer />
    </>
  );
}
