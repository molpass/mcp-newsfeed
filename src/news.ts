import { XMLParser } from "fast-xml-parser";

export interface NewsItem {
  title: string;
  url: string;
}

export interface NewsResult {
  items: NewsItem[];
  source: string;
}

// ── 연합뉴스(YNA): 1차 소스. 직접 기사 링크 → 클릭 시 기사 바로 오픈. ──
const YNA_BASE = "https://www.yna.co.kr/rss";
const YNA_CATEGORY: Record<string, string> = {
  종합: "news",
  정치: "politics",
  경제: "economy",
  사회: "society",
  세계: "international",
  국제: "international",
  IT: "industry",
  기술: "industry",
  산업: "industry",
  스포츠: "sports",
  문화: "culture",
};

export function ynaRssUrlFor(category?: string): string {
  const slug = (category && YNA_CATEGORY[category.trim()]) || "news";
  return `${YNA_BASE}/${slug}.xml`;
}

// ── Google News: 폴백 소스(연합 실패/0건 시). 링크는 CBM 리다이렉트일 수 있음. ──
const G_TOP = "https://news.google.com/rss?hl=ko&gl=KR&ceid=KR:ko";
const G_TOPIC = (t: string) =>
  `https://news.google.com/rss/headlines/section/topic/${t}?hl=ko&gl=KR&ceid=KR:ko`;
const G_CATEGORY: Record<string, string> = {
  종합: G_TOP,
  정치: G_TOPIC("NATION"),
  사회: G_TOPIC("NATION"),
  경제: G_TOPIC("BUSINESS"),
  세계: G_TOPIC("WORLD"),
  국제: G_TOPIC("WORLD"),
  IT: G_TOPIC("TECHNOLOGY"),
  기술: G_TOPIC("TECHNOLOGY"),
  스포츠: G_TOPIC("SPORTS"),
  문화: G_TOPIC("ENTERTAINMENT"),
};

export function googleRssUrlFor(category?: string): string {
  if (!category) return G_TOP;
  return G_CATEGORY[category.trim()] ?? G_TOP;
}

// processEntities:false로 엔티티 확장 폭탄(구글 RSS description)을 회피하므로,
// 비활성화한 공통 엔티티는 제목에서 직접 디코드한다.
export function decodeEntities(s: string): string {
  return s
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&amp;/g, "&");
}

export function dedupeByTitle(items: NewsItem[]): NewsItem[] {
  const seen = new Set<string>();
  const out: NewsItem[] = [];
  for (const it of items) {
    const key = it.title.replace(/\s+/g, " ").trim().toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(it);
  }
  return out;
}

const parser = new XMLParser({ ignoreAttributes: false, trimValues: true, processEntities: false });

function parseRss(xml: string): NewsItem[] {
  const doc = parser.parse(xml);
  const raw = doc?.rss?.channel?.item ?? [];
  const arr = Array.isArray(raw) ? raw : [raw];
  return arr
    .map((it: any) => ({
      title: decodeEntities(typeof it?.title === "string" ? it.title : String(it?.title ?? "")).trim(),
      url: (typeof it?.link === "string" ? it.link : String(it?.link ?? "")).trim(),
    }))
    .filter((it: NewsItem) => it.title && it.url);
}

async function fetchRss(url: string): Promise<NewsItem[]> {
  const res = await fetch(url, { headers: { "User-Agent": "mcp-newsfeed/1.0" } });
  if (!res.ok) throw new Error(`RSS HTTP ${res.status} (${url})`);
  return dedupeByTitle(parseRss(await res.text()));
}

// 연합뉴스 1차 → 실패/0건이면 Google News 폴백.
export async function fetchNews(category: string | undefined, count: number): Promise<NewsResult> {
  try {
    const items = await fetchRss(ynaRssUrlFor(category));
    if (items.length > 0) return { items: items.slice(0, count), source: "연합뉴스" };
  } catch {
    // 폴백으로 진행
  }
  const items = await fetchRss(googleRssUrlFor(category));
  return { items: items.slice(0, count), source: "Google News" };
}
