const TOP = "https://news.google.com/rss?hl=ko&gl=KR&ceid=KR:ko";
const TOPIC = (t: string) =>
  `https://news.google.com/rss/headlines/section/topic/${t}?hl=ko&gl=KR&ceid=KR:ko`;

const CATEGORY_MAP: Record<string, string> = {
  종합: TOP,
  정치: TOPIC("NATION"),
  사회: TOPIC("NATION"),
  경제: TOPIC("BUSINESS"),
  세계: TOPIC("WORLD"),
  IT: TOPIC("TECHNOLOGY"),
  과학: TOPIC("SCIENCE"),
  기술: TOPIC("TECHNOLOGY"),
  건강: TOPIC("HEALTH"),
  스포츠: TOPIC("SPORTS"),
  연예: TOPIC("ENTERTAINMENT"),
};

export function rssUrlFor(category?: string): string {
  if (!category) return TOP;
  return CATEGORY_MAP[category.trim()] ?? TOP;
}

export interface NewsItem {
  title: string;
  url: string;
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
