import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar } from "lucide-react";
import { buildMetadata, breadcrumbSchema, faqSchema, BASE_URL } from "@/lib/seo";

const SLUG = "bolu-da-dovus-sporlari-neden-gym-machine";
const TITLE = "Bolu'da Dövüş Sporları: Neden Gym Machine?";
const EXCERPT = "Boks, kickboks ve muay thai arasındaki farklar, Bolu'da doğru dövüş salonunu seçerken dikkat edilmesi gereken kriterler ve Gym Machine'in sunduğu avantajlar.";
const COVER = "https://images.unsplash.com/photo-1549476464-37392f717541?w=1200&q=80";
const PUBLISHED = "2026-01-10T09:00:00Z";

export async function generateMetadata() {
  return buildMetadata({
    settingsKey: "seo_blog_bolu_dovus_sporlari",
    defaultTitle: `${TITLE} | Gym Machine Bolu`,
    defaultDesc: "Bolu'da boks, kickboks ve muay thai arasında karar veremiyor musunuz? Salon seçim kriterlerini ve Gym Machine'in farkını öğrenin.",
    path: `/blog/${SLUG}`,
    keywords: ["bolu dövüş salonu", "bolu boks salonu", "bolu kickboks", "bolu muay thai", "bolu'da dövüş sporları eğitimi"],
  });
}

const FAQ = [
  { question: "Boks mu kickboks mu muay thai mi tercih etmeliyim?", answer: "Sadece el tekniklerine odaklanmak isteyenler boksu, hem yumruk hem tekme çalışmak isteyenler kickboksu, ayrıca diz ve dirsek tekniklerini de öğrenmek isteyenler muay thai'yi tercih edebilir. Gym Machine'de üç branşı da deneyerek karar verebilirsiniz." },
  { question: "Bolu'da dövüş salonu seçerken nelere dikkat etmeliyim?", answer: "Antrenör sertifikasyonu, ekipman kalitesi (ring, kum torbası, pad), hijyen, salonun lokasyonu ve ulaşım kolaylığı, esnek ders saatleri ve kişiye özel program sunulup sunulmadığı önemli kriterlerdir." },
  { question: "Gym Machine'i diğer Bolu spor salonlarından ayıran nedir?", answer: "Gym Machine, klasik fitness hizmetlerinin yanı sıra boks, kickboks ve muay thai'yi aynı tesiste, kişiye özel programlarla ve modern ekipmanla sunan tek çatı altında bir merkezdir." },
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
          <img src={COVER} alt="Bolu'da dövüş sporları — boks eldiveni ve ring" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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
                {["Dövüş Sporları", "Bolu"].map((tag) => (
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
                Bolu&apos;da dövüş sporlarına başlamak isteyenlerin karşılaştığı ilk soru genellikle şu olur: <strong style={{ color: "#D4AF37" }}>boks mu, kickboks mu, yoksa muay thai mi?</strong> Her branşın kendine has teknikleri, fayda alanları ve zorluk seviyeleri var. Bu yazıda üç branşı kıyaslıyor, Bolu&apos;da bir dövüş salonu seçerken nelere dikkat etmeniz gerektiğini ve Gym Machine&apos;in bu alanda neden fark yarattığını anlatıyoruz.
              </p>

              <h2 style={{ color: "#fff", fontSize: "1.375rem", fontWeight: 700, margin: "2rem 0 0.875rem", fontFamily: "var(--font-heading)" }}>Boks, Kickboks ve Muay Thai Arasındaki Farklar</h2>
              <p style={{ marginBottom: "1.25rem" }}>
                <strong style={{ color: "#D4AF37" }}>Boks</strong>, sadece yumrukla yapılan bir dövüş sporudur. Ayak işi, duruş ve yumruk kombinasyonları üzerine yoğunlaşır; koordinasyon ve refleks gelişimi için idealdir.
              </p>
              <p style={{ marginBottom: "1.25rem" }}>
                <strong style={{ color: "#D4AF37" }}>Kickboks</strong>, boksun yumruk tekniklerine tekmeleri de ekler. Hem üst hem alt vücut kaslarını çalıştırdığı için daha yüksek kalori yakımı sağlar.
              </p>
              <p style={{ marginBottom: "1.25rem" }}>
                <strong style={{ color: "#D4AF37" }}>Muay Thai</strong> ise &quot;sekiz uzuv sanatı&quot; olarak bilinir: yumruk ve tekmenin yanı sıra diz ve dirsek darbelerini, ayrıca klinç çalışmasını da içerir. Daha kapsamlı bir teknik dağarcığı sunar.
              </p>

              <h2 style={{ color: "#fff", fontSize: "1.375rem", fontWeight: 700, margin: "2rem 0 0.875rem", fontFamily: "var(--font-heading)" }}>Bolu&apos;da Dövüş Salonu Seçerken Dikkat Edilmesi Gerekenler</h2>
              <ul style={{ paddingLeft: "1.5rem", marginBottom: "1.25rem" }}>
                <li style={{ marginBottom: "0.375rem" }}><strong style={{ color: "#D4AF37" }}>Antrenör kalitesi:</strong> Sertifikalı, deneyimli eğitmenler doğru teknik ve sakatlanma önleme açısından kritik.</li>
                <li style={{ marginBottom: "0.375rem" }}><strong style={{ color: "#D4AF37" }}>Ekipman:</strong> Profesyonel ring, çeşitli ağırlıklarda kum torbaları, pad seti ve koruyucu ekipman bulunmalı.</li>
                <li style={{ marginBottom: "0.375rem" }}><strong style={{ color: "#D4AF37" }}>Hijyen ve konfor:</strong> Temiz soyunma odaları, duş imkânı ve klimatize ortam.</li>
                <li style={{ marginBottom: "0.375rem" }}><strong style={{ color: "#D4AF37" }}>Esneklik:</strong> Grup dersi ve özel ders seçenekleri, esnek randevu saatleri.</li>
                <li style={{ marginBottom: "0.375rem" }}><strong style={{ color: "#D4AF37" }}>Lokasyon:</strong> Bolu merkeze yakınlık ve kolay ulaşım.</li>
              </ul>

              <h2 style={{ color: "#fff", fontSize: "1.375rem", fontWeight: 700, margin: "2rem 0 0.875rem", fontFamily: "var(--font-heading)" }}>Gym Machine&apos;in Farkı</h2>
              <p style={{ marginBottom: "1.25rem" }}>
                <Link href="/bolu-dovus-salonu" style={{ color: "#D4AF37", textDecoration: "underline" }}>Gym Machine Bolu Dövüş Salonu</Link>, boks, kickboks ve muay thai branşlarını profesyonel antrenörler eşliğinde tek çatı altında sunan 600 m² modern bir tesistir. Bizi diğer Bolu spor salonlarından ayıran temel fark, hem klasik fitness hizmetlerini hem de dövüş sporlarını aynı tesiste, kişiye özel programlarla sunmamızdır. Böylece tek üyelikle hem formunuzu korur hem öz savunma becerisi kazanırsınız.
              </p>
              <p style={{ marginBottom: "1.25rem" }}>
                Boks özel dersi ile fitness hedeflerinizi nasıl birleştirebileceğinizi <Link href="/blog/boks-ozel-dersi-ile-fitness" style={{ color: "#D4AF37", textDecoration: "underline" }}>Boks Özel Dersi ile Fitness</Link> yazımızda, kickboks ve muay thai&apos;ye nasıl başlayacağınızı ise <Link href="/blog/kickboks-muay-thai-baslangic-rehberi" style={{ color: "#D4AF37", textDecoration: "underline" }}>Kickboks ve Muay Thai: Başlangıç Rehberi</Link> yazımızda bulabilirsiniz.
              </p>
            </div>

            <div style={{ marginTop: "3.5rem", background: "rgba(106,13,37,0.08)", border: "1px solid rgba(106,13,37,0.2)", borderRadius: "20px", padding: "2rem", textAlign: "center" }}>
              <p style={{ color: "#D4AF37", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.625rem" }}>Gym Machine&apos;de Antrenman Yap</p>
              <h3 style={{ color: "#fff", fontWeight: 800, fontSize: "1.25rem", fontFamily: "var(--font-heading)", marginBottom: "0.625rem" }}>Branşını Seç, Bugün Başla</h3>
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
