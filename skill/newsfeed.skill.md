---
name: newsfeed
description: Use when the user wants the latest top news headlines — "오늘 뉴스", "주요뉴스 5개", "경제 뉴스 알려줘". Maps intent to the get_news MCP tool and returns a title+link list.
---

# newsfeed

`mcp-newsfeed` 서버의 `get_news` 도구를 호출해 한국 최신 주요뉴스 top N을 가져온다.
도구는 "사실"(헤드라인 수집: 연합뉴스 1차 + Google News 폴백), 이 스킬은 "의미"(의도 → count/category 매핑 + 요약)를 담당한다.

## 트리거

- "오늘 뉴스 / 주요뉴스 알려줘"
- "뉴스 N개", "경제/세계/IT/스포츠 뉴스"
- 데일리 리포트용 주요뉴스 수집

## 동작

1. 개수 표현을 `count`로 매핑한다 (기본 5, 1–20).
2. 분야 표현을 `category`로 매핑한다 (종합/정치/경제/사회/세계/IT/스포츠/문화). 미지정이면 종합.
3. `get_news` 를 호출한다.
4. 반환된 제목+링크를 사용자에게 번호 리스트로 보여준다. 필요하면 한 줄 요약을 덧붙인다.

## 파라미터 요약

`count`(기본 5, 1–20), `category`(기본 종합).

## 주의

- 저작권: **헤드라인 + 원문 링크만**. 기사 본문 전체를 재현하지 않는다.
- 링크는 연합뉴스 직접 기사 URL이 기본이며, 폴백 시 Google News 리다이렉트가 섞일 수 있다.
- 같은 제목은 중복 제거된다.
