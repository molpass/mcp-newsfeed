#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { fetchNews } from "./news.js";

const server = new McpServer({ name: "newsfeed", version: "1.0.0" });

server.registerTool(
  "get_news",
  {
    title: "Get Top News",
    description:
      "Google News(ko-KR)의 최신 주요뉴스 top N을 제목+링크 리스트로 반환한다. 중복 제거됨.",
    inputSchema: {
      count: z.number().int().min(1).max(20).default(5).describe("가져올 기사 수"),
      category: z
        .string()
        .optional()
        .describe("카테고리(종합/정치/경제/사회/세계/IT/스포츠/연예 등). 미지정 시 종합."),
    },
  },
  async ({ count, category }) => {
    const { items, source } = await fetchNews(category, count);
    const header = `${category ?? "종합"} 주요뉴스 ${items.length}건 (출처: ${source})`;
    const lines = items.map((it, i) => `${i + 1}. ${it.title}\n   ${it.url}`);
    return {
      content: [{ type: "text", text: [header, ...lines].join("\n") }],
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
