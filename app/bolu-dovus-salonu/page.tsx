import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Dumbbell, Shield, Zap, Target, MapPin, Users } from "lucide-react";
import { buildMetadata, breadcrumbSchema, faqSchema, BASE_URL } from "@/lib/seo";

export async function generateMetadata() {
  return buildMetadata({
    settingsKey: "seo_bolu_dovus_salonu",
    defaultTitle: "Bolu Dövüş Salonu | Gym Machine Bolu — Boks, Kickboks, Muay Thai",
    defaultDesc: "Bolu'nun dövüş sporları merkezi Gym Machine: boks özel dersi, kickboks, muay thai ve MMA eğitimi. Profesyonel antrenörler, ring ve modern ekipman ile Bolu merkezde hizmet verir.",
    path: "/bolu-dovus-salonu",
    keywords: [
      "bolu dövüş salonu", "bolu boks salonu", "bolu kickboks", "bolu muay thai", "bolu mma",
      "bolu boks dersi", "bolu kickboks dersi", "bolu özel ders fitness", "bolu spor salonu dövüş",
      "bolu'da dövüş sporları eğitimi", "bolu boks özel ders fiyatları", "bolu kickboks başlangıç",
    ],
  });
}

const BRANSLAR = [
  {
    Icon: Target,
    title: "Boks",
    desc: "Ayak işi, duruş, kombinasyon vuruşları ve savunma teknikleriyle boksun temellerinden ileri seviyeye kadar özel ders imkânı. Kondisyon ve öz güven kazandıran tam vücut antrenmanı.",
  },
  {
    Icon: Zap,
    title: "Kickboks",
    desc: "Yumruk ve tekme tekniklerinin birleştiği kickboks dersleriyle hem kondisyon hem koordinasyon geliştirin. Grup ve bire bir ders seçenekleri mevcuttur.",
  },
  {
    Icon: Shield,
    title: "Muay Thai",
    desc: "Tayland'ın milli sporu Muay Thai'de yumruk, tekme, diz ve dirsek tekniklerini öğrenin. Sekiz uzuv sanatıyla disiplin, güç ve esneklik kazanın.",
  },
  {
    Icon: Dumbbell,
    title: "MMA Hazırlık",
    desc: "Boks, kickboks ve güreş tekniklerini harmanlayan MMA odaklı kondisyon ve teknik çalışmalarıyla çok yönlü bir dövüş sporcusu olun.",
  },
];

const OZEL_DERS_AVANTAJLARI = [
  "Kişiye özel teknik düzeltme ve birebir ilgi",
  "Seviyenize uygun hızda ilerleme programı",
  "Esnek randevu saatleri",
  "Sakatlık geçmişine göre uyarlanmış çalışma",
  "Hızlı teknik gelişim ve motivasyon takibi",
];

const DOVUS_FAQ = [
  { question: "Bolu'da hangi dövüş salonu tavsiye edilir?", answer: "Bolu merkezde Gym Machine, boks, kickboks, muay thai ve MMA branşlarını profesyonel antrenörler eşliğinde tek çatı altında sunan 600 m² modern bir dövüş sporları ve fitness merkezidir." },
  { question: "Bolu'da boks dersine sıfırdan başlayabilir miyim?", answer: "Evet. Gym Machine'de sıfırdan başlayanlar için özel başlangıç programları mevcuttur. Herhangi bir ön deneyim gerekmez." },
  { question: "Kickboks ve muay thai arasındaki fark nedir?", answer: "Kickboks yumruk ve tekme tekniklerini kullanırken, muay thai bunlara ek olarak diz ve dirsek darbelerini de içerir. Muay thai 'sekiz uzuv sanatı' olarak bilinir ve klinç çalışmasına izin verir." },
  { question: "Dövüş sporları özel dersi ne kadar sürer?", answer: "Özel dersler genellikle 45-60 dakika sürer ve seviyenize göre ısınma, teknik çalışma, pad/torba antrenmanı ve kondisyon bölümlerinden oluşur." },
  { question: "Gym Machine'de ring ve kum torbası var mı?", answer: "Evet, tesisimizde profesyonel boks ringi, çeşitli ağırlıklarda kum torbaları ve pad ekipmanları bulunmaktadır." },
  { question: "Bolu'da dövüş sporları antrenmanı hem fitness hem savunma sağlar mı?", answer: "Evet. Boks, kickboks ve muay thai dersleri kalori yakımı, kas dayanıklılığı, koordinasyon ve öz savunma becerisini aynı anda geliştiren tam vücut antrenmanlarıdır." },
];

const sportsActivityLocationSchema = {
  "@context": "https://schema.org",
  "@type": "SportsActivityLocation",
  name: "Gym Machine Bolu — Dövüş Salonu",
  description: "Bolu merkezde boks, kickboks, muay thai ve MMA eğitimi veren dövüş sporları ve fitness merkezi.",
  url: `${BASE_URL}/bolu-dovus-salonu`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Tabaklar Mahallesi, Uygur Sokak No:3",
    addressLocality: "Bolu Merkez",
    addressRegion: "Bolu",
    postalCode: "14300",
    addressCountry: "TR",
  },
  geo: { "@type": "GeoCoordinates", latitude: 40.7395, longitude: 31.6060 },
  telephone: "+90 374 270 14 55",
  sport: ["Boxing", "Kickboxing", "Muay Thai", "Mixed Martial Arts"],
};

const serviceSchemas = ["Boks", "Kickboks", "Muay Thai"].map((name) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: name,
  name: `${name} Dersi — Gym Machine Bolu`,
  description: BRANSLAR.find((b) => b.title === name)?.desc,
  provider: {
    "@type": "SportsActivityLocation",
    name: "Gym Machine Bolu",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Tabaklar Mahallesi, Uygur Sokak No:3",
      addressLocality: "Bolu Merkez",
      addressRegion: "Bolu",
      postalCode: "14300",
      addressCountry: "TR",
    },
  },
  areaServed: { "@type": "City", name: "Bolu" },
}));

export default function BoluDovusSalonuPage() {
  const faqJsonLd = faqSchema(DOVUS_FAQ);
  const breadcrumbJsonLd = breadcrumbSchema([
    { name: "Ana Sayfa", url: BASE_URL },
    { name: "Bolu Dövüş Salonu", url: `${BASE_URL}/bolu-dovus-salonu` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(sportsActivityLocationSchema) }} />
      {serviceSchemas.map((schema) => (
        <script key={schema.serviceType} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Navbar />
      <main style={{ minHeight: "100vh", background: "#0B0B0B" }}>

        {/* Hero */}
        <div style={{ paddingTop: "96px", paddingBottom: "3.5rem", background: "linear-gradient(to bottom, #111111, #0B0B0B)", borderBottom: "1px solid rgba(106,13,37,0.15)" }}>
          <div className="page-container" style={{ textAlign: "center" }}>
            <p style={{ color: "#D4AF37", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.75rem" }}>Bolu&apos;nun Dövüş Sporları Merkezi</p>
            <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.25rem)", fontWeight: 800, color: "#fff", fontFamily: "var(--font-heading)", marginBottom: "1rem", lineHeight: 1.15 }}>
              Bolu Dövüş Salonu | Gym Machine Bolu
            </h1>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.9375rem", maxWidth: "38rem", marginInline: "auto", lineHeight: 1.75 }}>
              Bolu merkezde boks, kickboks, muay thai ve MMA eğitimi veren profesyonel dövüş salonu. Uzman antrenör kadrosu, profesyonel ring ve modern ekipmanlarla hem fitness hem öz savunma hedeflerinize ulaşın.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap", marginTop: "1.75rem" }}>
              <Link href="/randevu" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.875rem 1.75rem", background: "#6A0D25", color: "#fff", fontWeight: 700, fontSize: "0.9375rem", borderRadius: "12px", border: "1px solid rgba(212,175,55,0.3)", textDecoration: "none" }}>
                Özel Ders İçin Randevu Al <ArrowRight style={{ width: "16px", height: "16px" }} />
              </Link>
              <Link href="/iletisim" style={{ display: "inline-flex", alignItems: "center", padding: "0.875rem 1.75rem", background: "#1A1A1A", color: "rgba(255,255,255,0.7)", fontWeight: 500, fontSize: "0.9375rem", borderRadius: "12px", border: "1px solid #2A2A2A", textDecoration: "none" }}>
                Bize Ulaşın
              </Link>
            </div>
          </div>
        </div>

        <div className="page-container" style={{ paddingTop: "3.5rem", paddingBottom: "5rem" }}>

          {/* Intro */}
          <div style={{ maxWidth: "48rem", marginBottom: "3.5rem" }}>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.9375rem", lineHeight: 1.8, marginBottom: "1.25rem" }}>
              <strong style={{ color: "#D4AF37" }}>Bolu&apos;da dövüş sporları</strong> arayanlar için Gym Machine, boks, kickboks ve muay thai branşlarını profesyonel antrenörler eşliğinde tek çatı altında sunan 600 m² modern bir tesistir. Bolu boks salonu arayışında olan yeni başlayanlardan yarışmaya hazırlanan sporculara kadar her seviyeye uygun programlarımız mevcuttur.
            </p>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.9375rem", lineHeight: 1.8 }}>
              Gym Machine&apos;i Bolu&apos;daki diğer spor salonlarından ayıran temel fark: hem klasik fitness hem de dövüş sporlarını aynı tesiste, kişiye özel programlarla ve modern ekipmanla sunmamızdır. Böylece tek bir üyelikle hem formunuzu korur hem de öz savunma becerisi kazanırsınız.
            </p>
          </div>

          {/* Branşlar */}
          <div style={{ marginBottom: "4rem" }}>
            <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 800, color: "#fff", fontFamily: "var(--font-heading)", marginBottom: "0.75rem" }}>
              Dövüş Sporları Branşlarımız
            </h2>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.875rem", marginBottom: "2rem", maxWidth: "36rem" }}>
              Boks, kickboks, muay thai ve MMA hazırlık dersleriyle hedeflerinize en uygun branşı seçin.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
              {BRANSLAR.map(({ Icon, title, desc }) => (
                <div key={title} style={{ background: "#1A1A1A", border: "1px solid #2A2A2A", borderRadius: "20px", padding: "1.75rem" }}>
                  <div style={{ width: "48px", height: "48px", background: "rgba(106,13,37,0.2)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
                    <Icon style={{ width: "24px", height: "24px", color: "#D4AF37" }} />
                  </div>
                  <h3 style={{ color: "#fff", fontWeight: 700, fontSize: "1.0625rem", fontFamily: "var(--font-heading)", marginBottom: "0.625rem" }}>{title}</h3>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.875rem", lineHeight: 1.7 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Özel Ders Avantajları */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "3rem", marginBottom: "4rem", alignItems: "center" }} className="dovus-ozel-ders">
            <style>{`@media (min-width: 768px) { .dovus-ozel-ders { grid-template-columns: 1fr 1fr !important; } }`}</style>
            <div>
              <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 800, color: "#fff", fontFamily: "var(--font-heading)", marginBottom: "1.25rem", lineHeight: 1.2 }}>
                Bolu Boks Özel Ders Avantajları
              </h2>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.875rem", lineHeight: 1.75, marginBottom: "1.5rem" }}>
                Grup derslerinin yanı sıra Bolu&apos;da özel ders (birebir antrenman) seçeneğiyle daha hızlı teknik gelişim sağlıyoruz. Kişiye özel program, sertifikalı eğitmen kadromuz ve esnek randevu sistemiyle hedeflerinize kısa sürede ulaşın.
              </p>
              <ul style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {OZEL_DERS_AVANTAJLARI.map((item) => (
                  <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: "0.625rem" }}>
                    <CheckCircle2 style={{ width: "17px", height: "17px", color: "#D4AF37", flexShrink: 0, marginTop: "2px" }} />
                    <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.875rem", lineHeight: 1.5 }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ borderRadius: "20px", overflow: "hidden", height: "320px", background: "#1A1A1A" }}>
              <img src="https://images.unsplash.com/photo-1549476464-37392f717541?w=900&q=80" alt="Bolu'da boks özel dersi — Gym Machine antrenörü ile birebir antrenman" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          </div>

          {/* Antrenör Kalitesi & Ekipman */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem", marginBottom: "4rem" }}>
            <div style={{ background: "#1A1A1A", border: "1px solid #2A2A2A", borderRadius: "20px", padding: "1.75rem" }}>
              <div style={{ width: "48px", height: "48px", background: "rgba(106,13,37,0.2)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
                <Users style={{ width: "24px", height: "24px", color: "#D4AF37" }} />
              </div>
              <h3 style={{ color: "#fff", fontWeight: 700, fontSize: "1.0625rem", fontFamily: "var(--font-heading)", marginBottom: "0.625rem" }}>Uzman Antrenör Kadrosu</h3>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.875rem", lineHeight: 1.7 }}>
                Sertifikalı boks, kickboks ve muay thai antrenörlerimiz her seviyeye uygun teknik düzeltme ve program tasarımı sunar. Deneyimli kadromuz, sakatlanma riskini azaltarak doğru teknik gelişimi önceliklendirir.
              </p>
            </div>
            <div style={{ background: "#1A1A1A", border: "1px solid #2A2A2A", borderRadius: "20px", padding: "1.75rem" }}>
              <div style={{ width: "48px", height: "48px", background: "rgba(106,13,37,0.2)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
                <Dumbbell style={{ width: "24px", height: "24px", color: "#D4AF37" }} />
              </div>
              <h3 style={{ color: "#fff", fontWeight: 700, fontSize: "1.0625rem", fontFamily: "var(--font-heading)", marginBottom: "0.625rem" }}>Profesyonel Ring & Ekipman</h3>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.875rem", lineHeight: 1.7 }}>
                Standartlara uygun boks ringi, çeşitli ağırlıklarda kum torbaları, pad seti ve koruyucu ekipmanlarla güvenli ve verimli bir antrenman ortamı sunuyoruz.
              </p>
            </div>
            <div style={{ background: "#1A1A1A", border: "1px solid #2A2A2A", borderRadius: "20px", padding: "1.75rem" }}>
              <div style={{ width: "48px", height: "48px", background: "rgba(106,13,37,0.2)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
                <MapPin style={{ width: "24px", height: "24px", color: "#D4AF37" }} />
              </div>
              <h3 style={{ color: "#fff", fontWeight: 700, fontSize: "1.0625rem", fontFamily: "var(--font-heading)", marginBottom: "0.625rem" }}>Bolu Merkezde Kolay Ulaşım</h3>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.875rem", lineHeight: 1.7 }}>
                Tabaklar Mahallesi, Uygur Sokak No:3, Bolu Merkez adresinde yer alan tesisimize şehir merkezinin her noktasından kolayca ulaşabilirsiniz. Otopark imkânı mevcuttur.
              </p>
            </div>
          </div>

          {/* FAQ */}
          <div style={{ marginBottom: "4rem", maxWidth: "48rem" }}>
            <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 800, color: "#fff", fontFamily: "var(--font-heading)", marginBottom: "1.5rem" }}>
              Bolu Dövüş Salonu Hakkında Sık Sorulan Sorular
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {DOVUS_FAQ.map((faq) => (
                <div key={faq.question} style={{ background: "#1A1A1A", border: "1px solid #2A2A2A", borderRadius: "14px", padding: "1.25rem 1.5rem" }}>
                  <h3 style={{ color: "#fff", fontWeight: 700, fontSize: "0.9375rem", marginBottom: "0.5rem" }}>{faq.question}</h3>
                  <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.875rem", lineHeight: 1.7 }}>{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* İlgili Yazılar */}
          <div style={{ marginBottom: "4rem" }}>
            <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: "#fff", fontFamily: "var(--font-heading)", marginBottom: "1.25rem" }}>
              İlgili Yazılar
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
              {[
                { href: "/blog/bolu-da-dovus-sporlari-neden-gym-machine", title: "Bolu'da Dövüş Sporları: Neden Gym Machine?" },
                { href: "/blog/boks-ozel-dersi-ile-fitness", title: "Boks Özel Dersi ile Fitness: Aynı Anda Hem Form Hem Savunma" },
                { href: "/blog/kickboks-muay-thai-baslangic-rehberi", title: "Kickboks ve Muay Thai: Başlangıç Rehberi" },
              ].map((p) => (
                <Link key={p.href} href={p.href} style={{ background: "#1A1A1A", border: "1px solid #2A2A2A", borderRadius: "14px", padding: "1.25rem", color: "rgba(255,255,255,0.75)", fontSize: "0.875rem", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
                  {p.title} <ArrowRight style={{ width: "15px", height: "15px", color: "#D4AF37", flexShrink: 0 }} />
                </Link>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{ background: "rgba(106,13,37,0.08)", border: "1px solid rgba(106,13,37,0.2)", borderRadius: "20px", padding: "2.5rem", textAlign: "center" }}>
            <p style={{ color: "#D4AF37", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.75rem" }}>Bolu&apos;da Dövüş Sporlarına Başla</p>
            <h3 style={{ color: "#fff", fontWeight: 800, fontSize: "1.5rem", fontFamily: "var(--font-heading)", marginBottom: "0.75rem" }}>Özel Ders İçin Randevu Al</h3>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.875rem", marginBottom: "1.75rem", maxWidth: "28rem", marginInline: "auto" }}>
              Boks, kickboks veya muay thai — hangi branş sana uygun görmek için bugün randevu al, tesisimizi gez, antrenörlerimizle tanış.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/randevu" style={{ padding: "0.75rem 1.75rem", background: "#6A0D25", color: "#fff", fontWeight: 700, fontSize: "0.875rem", borderRadius: "12px", border: "1px solid rgba(212,175,55,0.3)", textDecoration: "none" }}>Randevu Al</Link>
              <Link href="/hizmetler" style={{ padding: "0.75rem 1.75rem", background: "#1A1A1A", color: "rgba(255,255,255,0.7)", fontWeight: 500, fontSize: "0.875rem", borderRadius: "12px", border: "1px solid #2A2A2A", textDecoration: "none" }}>Tüm Hizmetler</Link>
            </div>
          </div>
        </div>
      </main>
      <WhatsAppButton />
      <Footer />
    </>
  );
}
