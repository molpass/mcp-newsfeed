import { test } from "node:test";
import assert from "node:assert/strict";
import { rssUrlFor, dedupeByTitle } from "../dist/news.js";

test("rssUrlFor 종합 → top stories feed", () => {
  assert.equal(rssUrlFor("종합"), "https://news.google.com/rss?hl=ko&gl=KR&ceid=KR:ko");
});

test("rssUrlFor 경제 → BUSINESS topic feed", () => {
  assert.equal(
    rssUrlFor("경제"),
    "https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=ko&gl=KR&ceid=KR:ko"
  );
});

test("rssUrlFor 미매칭/undefined → top fallback", () => {
  assert.equal(rssUrlFor(undefined), "https://news.google.com/rss?hl=ko&gl=KR&ceid=KR:ko");
  assert.equal(rssUrlFor("아무거나"), "https://news.google.com/rss?hl=ko&gl=KR&ceid=KR:ko");
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
