# mcp-newsfeed

한국 **최신 주요뉴스 top N**을 제목+링크로 반환하는 MCP 서버. 키 불필요.

> 소스: **연합뉴스 RSS**(1차, 직접 기사 링크) → 실패/0건 시 **Google News RSS**(폴백) 하이브리드.
> 연합뉴스 링크는 클릭 시 기사로 바로 열린다(Google News의 CBM 리다이렉트 우회).

## 도구

### `get_news`
| 파라미터 | 타입 | 필수 | 기본 | 설명 |
|---|---|---|---|---|
| `count` | number | | 5 | 가져올 기사 수 (1–20) |
| `category` | string | | 종합 | 종합/정치/경제/사회/세계/IT/스포츠/문화 |

**출력**: `[{title, url}]` 형태의 구조화 텍스트(번호 리스트, 출처 표기). 제목 중복 제거.

## 설치

```bash
git clone https://github.com/molpass/mcp-newsfeed.git
cd mcp-newsfeed
npm install && npm run build
```

예제(라이브 5건):

```bash
npm run example
```

## Hermes / MCP 등록

```json
{
  "mcpServers": {
    "newsfeed": { "command": "node", "args": ["/abs/path/mcp-newsfeed/dist/index.js"] }
  }
}
```

> `/abs/path` 는 클론한 실제 절대경로로 바꾼다. Windows 예: `"C:/Users/<you>/mcp-newsfeed/dist/index.js"`.

## 스택

- Node 20+ / TypeScript
- [`@modelcontextprotocol/sdk`](https://github.com/modelcontextprotocol/typescript-sdk) (stdio)
- [`fast-xml-parser`](https://www.npmjs.com/package/fast-xml-parser) (RSS 파싱, 파서 전용)
- 소스: 연합뉴스 RSS(1차) · Google News RSS(폴백)

## 스킬

페어링 스킬: [`skill/newsfeed.skill.md`](skill/newsfeed.skill.md) — 의도를 `get_news` 파라미터로 매핑한다.

## 저작권

헤드라인 + 원문 링크만 제공한다. 기사 본문 전체는 재현하지 않는다.

## License

MIT
