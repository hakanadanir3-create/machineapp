import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://machinegym.biz";
const INDEXNOW_KEY = "1f611e06f2dd9a5bcbb19826404cc8bc";
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

// AI motorlarının ve arama motorlarının önceliklendirmesi istenen sayfalar.
// Bing, Yandex, Naver, Seznam gibi IndexNow ortaklarına tek istekle iletilir
// (api.indexnow.org, katılımcı tüm motorlara otomatik dağıtır).
const DEFAULT_URLS = [
  `${BASE_URL}/`,
  `${BASE_URL}/sss`,
  `${BASE_URL}/blog`,
  `${BASE_URL}/blog/bolu-da-spor-salonu-nasil-secilir`,
  `${BASE_URL}/blog/bolu-da-dovus-sporlari-neden-gym-machine`,
  `${BASE_URL}/blog/boks-ozel-dersi-ile-fitness`,
  `${BASE_URL}/blog/kickboks-muay-thai-baslangic-rehberi`,
  `${BASE_URL}/bolu-dovus-salonu`,
  `${BASE_URL}/fiyatlar`,
  `${BASE_URL}/randevu`,
];

async function submit(urlList: string[]) {
  const host = new URL(BASE_URL).host;
  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host,
      key: INDEXNOW_KEY,
      keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
      urlList,
    }),
  });
  return { status: res.status, ok: res.ok };
}

/** GET /api/indexnow — varsayılan öncelikli sayfaları IndexNow'a bildirir. */
export async function GET() {
  try {
    const result = await submit(DEFAULT_URLS);
    return NextResponse.json({ ok: result.ok, submittedStatus: result.status, urls: DEFAULT_URLS });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

/** POST /api/indexnow { urls: string[] } — belirli sayfaları IndexNow'a bildirir. */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const urls: string[] = Array.isArray(body?.urls) && body.urls.length > 0 ? body.urls : DEFAULT_URLS;
    const result = await submit(urls);
    return NextResponse.json({ ok: result.ok, submittedStatus: result.status, urls });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
