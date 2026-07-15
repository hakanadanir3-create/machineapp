import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar } from "lucide-react";
import { buildMetadata, breadcrumbSchema, faqSchema, BASE_URL } from "@/lib/seo";

const SLUG = "kickboks-muay-thai-baslangic-rehberi";
const TITLE = "Kickboks ve Muay Thai: Başlangıç Rehberi";
const EXCERPT = "Bolu'da kickboks veya muay thai'ye yeni başlayacaklar için temel teknikler, ilk hafta neler beklemeli, doğru ekipman ve antrenman sıklığı önerileri.";
const COVER = "https://images.unsplash.com/photo-1604480132736-44c188fe4d20?w=1200&q=80";
const PUBLISHED = "2026-01-24T09:00:00Z";

export async function generateMetadata() {
  return buildMetadata({
    settingsKey: "seo_blog_kickboks_muay_thai_rehber",
    defaultTitle: `${TITLE} | Gym Machine Bolu`,
    defaultDesc: "Bolu'da kickboks ve muay thai'ye sıfırdan başlayacaklar için kapsamlı rehber: temel teknikler, ekipman ve antrenman sıklığı.",
    path: `/blog/${SLUG}`,
    keywords: ["bolu kickboks başlangıç", "bolu kickboks dersi", "bolu muay thai", "bolu kickboks", "bolu mma"],
  });
}

const FAQ = [
  { question: "Kickboks'a sıfırdan başlayabilir miyim?", answer: "Evet. Kickboksta yaş veya deneyim sınırı yoktur. Gym Machine'de başlangıç seviyesine özel programlarla temel teknikleri öğrenerek ilerleyebilirsiniz." },
  { question: "Muay Thai için hangi ekipmanlar gerekli?", answer: "Başlangıçta el bandajı, boks eldiveni ve rahat spor kıyafeti yeterlidir. İleri seviyede şin koruyucu ve kafalık gibi ek ekipmanlar önerilir. Gym Machine'de temel ekipmanlar tesiste mevcuttur." },
  { question: "Haftada kaç gün kickboks veya muay thai dersi almalıyım?", answer: "Yeni başlayanlar için haftada 2-3 gün idealdir. Vücudun toparlanması için dersler arasında en az bir gün dinlenme önerilir." },
  { question: "Kickboks ve muay thai kondisyonu ne kadar sürede artırır?", answer: "Düzenli katılımla (haftada 2-3 ders) 4-6 hafta içinde belirgin kondisyon artışı ve teknik gelişim gözlemlenir." },
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
          <img src={COVER} alt="Bolu'da kickboks ve muay thai antrenmanı, başlangıç rehberi" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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
                {["Kickboks", "Muay Thai", "Başlangıç"].map((tag) => (
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
                <strong style={{ color: "#D4AF37" }}>Bolu&apos;da kickboks veya muay thai&apos;ye başlamak</strong> istiyorsanız ilk adım doğru beklentilerle salona gitmektir. Bu rehberde yeni başlayanların merak ettiği temel teknikleri, ilk haftalarda neler beklemeleri gerektiğini ve antrenman sıklığını anlatıyoruz.
              </p>

              <h2 style={{ color: "#fff", fontSize: "1.375rem", fontWeight: 700, margin: "2rem 0 0.875rem", fontFamily: "var(--font-heading)" }}>Temel Teknikler: Nereden Başlamalı?</h2>
              <p style={{ marginBottom: "1.25rem" }}>
                İlk derslerde genellikle temel duruş (stans), ayak işi, jab-cross gibi temel yumruk kombinasyonları ve düz tekme (push kick) öğretilir. Muay Thai&apos;de buna ek olarak diz vuruşu ve klinç pozisyonunun temelleri de erken aşamada tanıtılır.
              </p>

              <h2 style={{ color: "#fff", fontSize: "1.375rem", fontWeight: 700, margin: "2rem 0 0.875rem", fontFamily: "var(--font-heading)" }}>İlk Hafta Ne Beklemeli?</h2>
              <ul style={{ paddingLeft: "1.5rem", marginBottom: "1.25rem" }}>
                <li style={{ marginBottom: "0.375rem" }}>Kas ağrısı normaldir; vücut yeni hareket kalıplarına alışır.</li>
                <li style={{ marginBottom: "0.375rem" }}>Isınma, temel teknik tekrarı ve hafif pad çalışması ilk derslerin ana yapısını oluşturur.</li>
                <li style={{ marginBottom: "0.375rem" }}>Eğitmenler yeni başlayanlar için tempoyu kasıtlı olarak düşük tutar.</li>
                <li style={{ marginBottom: "0.375rem" }}>Kendinizi diğer öğrencilerle kıyaslamayın; herkesin gelişim hızı farklıdır.</li>
              </ul>

              <h2 style={{ color: "#fff", fontSize: "1.375rem", fontWeight: 700, margin: "2rem 0 0.875rem", fontFamily: "var(--font-heading)" }}>Gerekli Ekipmanlar</h2>
              <p style={{ marginBottom: "1.25rem" }}>
                Başlangıçta el bandajı, boks eldiveni ve rahat spor kıyafeti yeterlidir. İleri seviyede şin koruyucu ve kafalık gibi ek ekipmanlar önerilir. Gym Machine&apos;de temel ekipmanlar tesiste mevcuttur, kendi ekipmanınızı getirmeniz şart değildir.
              </p>

              <h2 style={{ color: "#fff", fontSize: "1.375rem", fontWeight: 700, margin: "2rem 0 0.875rem", fontFamily: "var(--font-heading)" }}>Antrenman Sıklığı Önerisi</h2>
              <p style={{ marginBottom: "1.25rem" }}>
                Yeni başlayanlar için haftada 2-3 gün idealdir. Bu sıklık, tekniklerin pekişmesini sağlarken vücuda toparlanma süresi de tanır. Kondisyon arttıkça antrenman sıklığı ve süresi kişiye özel olarak artırılabilir.
              </p>

              <h2 style={{ color: "#fff", fontSize: "1.375rem", fontWeight: 700, margin: "2rem 0 0.875rem", fontFamily: "var(--font-heading)" }}>Gym Machine&apos;de Kickboks ve Muay Thai</h2>
              <p style={{ marginBottom: "1.25rem" }}>
                <Link href="/bolu-dovus-salonu" style={{ color: "#D4AF37", textDecoration: "underline" }}>Gym Machine Bolu</Link>&apos;da sertifikalı antrenörler eşliğinde sıfırdan başlangıç programlarımızla kickboks ve muay thai öğrenebilirsiniz. İlk deneme dersi ücretsizdir.
              </p>
              <p style={{ marginBottom: "1.25rem" }}>
                Boks özel dersinin fitness faydaları hakkında daha fazla bilgi için <Link href="/blog/boks-ozel-dersi-ile-fitness" style={{ color: "#D4AF37", textDecoration: "underline" }}>Boks Özel Dersi ile Fitness</Link> yazımıza, Bolu&apos;da doğru dövüş salonunu seçme kriterleri için <Link href="/blog/bolu-da-dovus-sporlari-neden-gym-machine" style={{ color: "#D4AF37", textDecoration: "underline" }}>Bolu&apos;da Dövüş Sporları: Neden Gym Machine?</Link> yazımıza göz atabilirsiniz.
              </p>
            </div>

            <div style={{ marginTop: "3.5rem", background: "rgba(106,13,37,0.08)", border: "1px solid rgba(106,13,37,0.2)", borderRadius: "20px", padding: "2rem", textAlign: "center" }}>
              <p style={{ color: "#D4AF37", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.625rem" }}>Gym Machine&apos;de Antrenman Yap</p>
              <h3 style={{ color: "#fff", fontWeight: 800, fontSize: "1.25rem", fontFamily: "var(--font-heading)", marginBottom: "0.625rem" }}>Kickboks veya Muay Thai&apos;ye Bugün Başla</h3>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>Uzman kadromuzla hedeflerine ulaşmaya bugün başla. İlk deneme dersi ücretsiz.</p>
              <Link href="/randevu" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.875rem 2rem", background: "#6A0D25", color: "#fff", fontWeight: 700, fontSize: "0.9375rem", borderRadius: "12px", border: "1px solid rgba(212,175,55,0.3)", textDecoration: "none" }}>
                Deneme Dersi Al <ArrowRight style={{ width: "16px", height: "16px" }} />
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
