import { fetchNews } from "../dist/news.js";

const { items, source } = await fetchNews("종합", 5);
console.log(`종합 주요뉴스 ${items.length}건 (출처: ${source})\n`);
for (const [i, it] of items.entries()) {
  console.log(`${i + 1}. ${it.title}`);
  console.log(`   ${it.url}\n`);
}
