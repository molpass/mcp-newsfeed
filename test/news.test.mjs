import { test } from "node:test";
import assert from "node:assert/strict";
import { ynaRssUrlFor, googleRssUrlFor, dedupeByTitle, decodeEntities } from "../dist/news.js";

test("ynaRssUrlFor 종합 → news.xml (1차 소스)", () => {
  assert.equal(ynaRssUrlFor("종합"), "https://www.yna.co.kr/rss/news.xml");
});

test("ynaRssUrlFor 경제 → economy.xml", () => {
  assert.equal(ynaRssUrlFor("경제"), "https://www.yna.co.kr/rss/economy.xml");
});

test("ynaRssUrlFor 미매칭/undefined → news.xml fallback", () => {
  assert.equal(ynaRssUrlFor(undefined), "https://www.yna.co.kr/rss/news.xml");
  assert.equal(ynaRssUrlFor("아무거나"), "https://www.yna.co.kr/rss/news.xml");
});

test("googleRssUrlFor 경제 → BUSINESS topic feed (폴백 소스)", () => {
  assert.equal(
    googleRssUrlFor("경제"),
    "https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=ko&gl=KR&ceid=KR:ko"
  );
});

test("googleRssUrlFor 미매칭 → top fallback", () => {
  assert.equal(googleRssUrlFor("아무거나"), "https://news.google.com/rss?hl=ko&gl=KR&ceid=KR:ko");
});

test("decodeEntities 공통 엔티티 디코드", () => {
  assert.equal(decodeEntities("美 &quot;이란&quot; 압박"), '美 "이란" 압박');
  assert.equal(decodeEntities("&apos;사후 재심&apos;"), "'사후 재심'");
  assert.equal(decodeEntities("A &amp; B"), "A & B");
  assert.equal(decodeEntities("&#39;test&#39;"), "'test'");
});

test("dedupeByTitle 공백·대소문자 정규화 후 제목 중복 제거, 순서 보존", () => {
  const items = [
    { title: "  속보  AAA", url: "u1" },
    { title: "속보 AAA", url: "u2" },
    { title: "BBB", url: "u3" },
  ];
  const out = dedupeByTitle(items);
  assert.equal(out.length, 2);
  assert.deepEqual(out.map((i) => i.url), ["u1", "u3"]);
});
