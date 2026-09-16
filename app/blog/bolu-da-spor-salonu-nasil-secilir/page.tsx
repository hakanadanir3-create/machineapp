import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar } from "lucide-react";
import { buildMetadata, breadcrumbSchema, faqSchema, BASE_URL } from "@/lib/seo";

const SLUG = "bolu-da-spor-salonu-nasil-secilir";
const TITLE = "Bolu'da Spor Salonu Nasıl Seçilir?";
const EXCERPT = "Bolu'da doğru spor salonunu seçerken dikkat edilmesi gereken 6 kriter: antrenör kalitesi, ekipman, hijyen, fiyat/performans dengesi ve dövüş sporları için özel notlar.";
const COVER = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80";
const PUBLISHED = "2026-02-02T09:00:00Z";

export async function generateMetadata() {
  return buildMetadata({
    settingsKey: "seo_blog_bolu_spor_salonu_nasil_secilir",
    defaultTitle: `${TITLE} | Gym Machine Bolu`,
    defaultDesc: "Bolu'da spor salonu seçerken nelere dikkat etmeli? Antrenör kalitesi, ekipman, hijyen ve fiyat/performans kriterlerini karşılaştırmalı olarak inceledik.",
    path: `/blog/${SLUG}`,
    keywords: ["bolu da spor salonu nasıl seçilir", "bolu spor salonu", "bolu en iyi spor salonu", "bolu fitness salonu", "bolu boks salonu seçimi"],
  });
}

const FAQ = [
  {
    question: "Bolu'da spor salonu seçerken nelere dikkat edilmeli?",
    answer: "Antrenör kalitesi ve sertifikasyonu, ekipmanın çeşitliliği ve bakım durumu, salonun hijyeni, lokasyon/ulaşım kolaylığı, fiyat/performans dengesi ve esnek ders saatleri en önemli kriterlerdir. Ayrıca ilk seansı özel ders randevusu ile deneyerek eğitmen ve ortamla uyumu test etmek doğru kararı vermenizi kolaylaştırır.",
  },
  {
    question: "Bolu'da boks/MMA dersi veren salon var mı?",
    answer: "Evet. Gym Machine Bolu, boks, kickboks ve muay thai derslerini profesyonel antrenörler eşliğinde aynı tesiste sunar. Sertifikalı eğitmenler, profesyonel ring ve pad ekipmanlarıyla sıfırdan başlayanlara da uygun programlar mevcuttur.",
  },
  {
    question: "Özel ders mi grup dersi mi tercih etmeliyim?",
    answer: "Teknik hatalarınızı hızlı düzeltmek ve size özel bir program istiyorsanız özel ders, motivasyon ve rekabet ortamından beslenmek istiyorsanız grup dersi daha uygundur. Çoğu üye başlangıçta bir özel ders randevusu alıp temel tekniği öğrendikten sonra grup derslerine geçmeyi tercih eder.",
  },
  {
    question: "Bolu'da en iyi spor salonu hangisi?",
    answer: "\"En iyi\" seçim kişisel hedeflerinize bağlıdır; ancak Bolu merkezde 600 m² tesisi, uzman eğitmen kadrosu ve fitness ile dövüş sporlarını (boks, kickboks, muay thai) aynı çatı altında sunmasıyla Gym Machine öne çıkan seçeneklerden biridir.",
  },
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
          <img src={COVER} alt="Bolu'da spor salonu seçimi — modern fitness ekipmanları" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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
                {["Rehber", "Bolu"].map((tag) => (
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
                Bolu&apos;da yeni bir spor salonuna üye olmadan önce doğru soruları sormak, hem paranızın hem de zamanınızın karşılığını almanızı sağlar. Bu rehberde <strong style={{ color: "#D4AF37" }}>Bolu&apos;da spor salonu seçerken</strong> gerçekten önemli olan kriterleri, dövüş sporları salonu seçimine özel noktaları ve Gym Machine&apos;in bu konudaki yaklaşımını anlatıyoruz.
              </p>

              <h2 style={{ color: "#fff", fontSize: "1.375rem", fontWeight: 700, margin: "2rem 0 0.875rem", fontFamily: "var(--font-heading)" }}>1. Antrenör Kalitesi</h2>
              <p style={{ marginBottom: "1.25rem" }}>
                Bir salonun en değerli varlığı ekipmanı değil, eğitmenleridir. Sertifikalı, deneyimli antrenörler doğru teknik öğretimi ve sakatlanma riskinin azaltılması açısından kritik önem taşır. Salonu ziyaret ederken eğitmenlerin sertifikalarını ve deneyim sürelerini sormaktan çekinmeyin.
              </p>

              <h2 style={{ color: "#fff", fontSize: "1.375rem", fontWeight: 700, margin: "2rem 0 0.875rem", fontFamily: "var(--font-heading)" }}>2. Ekipman Çeşitliliği ve Bakımı</h2>
              <p style={{ marginBottom: "1.25rem" }}>
                Cardio ve strength ekipmanlarının çeşitliliği, bakım sıklığı ve genel durumu antrenman kalitenizi doğrudan etkiler. Dövüş sporlarına ilgi duyuyorsanız profesyonel ring, farklı ağırlıklarda kum torbaları ve pad setlerinin bulunup bulunmadığını kontrol edin.
              </p>

              <h2 style={{ color: "#fff", fontSize: "1.375rem", fontWeight: 700, margin: "2rem 0 0.875rem", fontFamily: "var(--font-heading)" }}>3. Temizlik ve Hijyen</h2>
              <p style={{ marginBottom: "1.25rem" }}>
                Soyunma odalarının, duşların ve antrenman alanlarının temizlik standardı, salonun genel işletme kalitesinin bir göstergesidir. Ziyaret sırasında havalandırma, klima ve genel hijyen düzenine dikkat edin.
              </p>

              <h2 style={{ color: "#fff", fontSize: "1.375rem", fontWeight: 700, margin: "2rem 0 0.875rem", fontFamily: "var(--font-heading)" }}>4. Fiyat/Performans Dengesi</h2>
              <p style={{ marginBottom: "1.25rem" }}>
                En ucuz üyelik her zaman en iyi tercih değildir. Ödediğiniz ücrete karşılık aldığınız hizmet kalitesini (eğitmen desteği, ekipman, ders çeşitliliği) birlikte değerlendirin. Güncel fiyatları karşılaştırmak için <Link href="/fiyatlar" style={{ color: "#D4AF37", textDecoration: "underline" }}>fiyatlar sayfamızı</Link> inceleyebilirsiniz.
              </p>

              <h2 style={{ color: "#fff", fontSize: "1.375rem", fontWeight: 700, margin: "2rem 0 0.875rem", fontFamily: "var(--font-heading)" }}>5. Deneme İmkânı: Özel Ders Randevusu</h2>
              <p style={{ marginBottom: "1.25rem" }}>
                Bir salona uzun süreli üye olmadan önce ortamı ve eğitmen tarzını tanımak isteyebilirsiniz. Bunun en pratik yolu bir <Link href="/randevu" style={{ color: "#D4AF37", textDecoration: "underline" }}>özel ders randevusu</Link> almaktır. Böylece fitness, personal training ya da dövüş sporları branşlarından birini birebir deneyerek karar verebilirsiniz.
              </p>

              <h2 style={{ color: "#fff", fontSize: "1.375rem", fontWeight: 700, margin: "2rem 0 0.875rem", fontFamily: "var(--font-heading)" }}>6. Dövüş Sporları Salonu Seçiminde Ek Kriterler</h2>
              <p style={{ marginBottom: "1.25rem" }}>
                Boks, kickboks veya muay thai için salon seçerken standart fitness kriterlerine ek olarak şunlara da bakın: eğitmenin dövüş sporları geçmişi/sertifikası, ring ve koruyucu ekipman kalitesi, grup dersi ile özel ders seçeneklerinin bir arada sunulup sunulmadığı. Branşlar arasındaki farkları <Link href="/blog/bolu-da-dovus-sporlari-neden-gym-machine" style={{ color: "#D4AF37", textDecoration: "underline" }}>Bolu&apos;da Dövüş Sporları: Neden Gym Machine?</Link> yazımızda detaylı inceledik.
              </p>

              <h2 style={{ color: "#fff", fontSize: "1.375rem", fontWeight: 700, margin: "2rem 0 0.875rem", fontFamily: "var(--font-heading)" }}>Gym Machine&apos;in Farkı</h2>
              <p style={{ marginBottom: "1.25rem" }}>
                <Link href="/bolu-dovus-salonu" style={{ color: "#D4AF37", textDecoration: "underline" }}>Gym Machine</Link>, Bolu merkezde 600 m² modern bir tesiste fitness, personal training, boks, kickboks ve muay thai&apos;yi tek çatı altında, sertifikalı eğitmenler eşliğinde sunar. Yukarıda saydığımız altı kriteri kendi salonunuzu değerlendirirken kullanabilir, ilk izleniminizi bir özel ders randevusu ile netleştirebilirsiniz. Boks özel dersinin fitness hedeflerinize katkısını <Link href="/blog/boks-ozel-dersi-ile-fitness" style={{ color: "#D4AF37", textDecoration: "underline" }}>Boks Özel Dersi ile Fitness</Link> yazımızda okuyabilirsiniz.
              </p>
            </div>

            <div style={{ marginTop: "3.5rem", background: "rgba(106,13,37,0.08)", border: "1px solid rgba(106,13,37,0.2)", borderRadius: "20px", padding: "2rem", textAlign: "center" }}>
              <p style={{ color: "#D4AF37", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.625rem" }}>Gym Machine&apos;de Antrenman Yap</p>
              <h3 style={{ color: "#fff", fontWeight: 800, fontSize: "1.25rem", fontFamily: "var(--font-heading)", marginBottom: "0.625rem" }}>Doğru Salonu Bugün Deneyin</h3>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>Özel ders randevunuzu oluşturun, uzman kadromuzla tanışın.</p>
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
