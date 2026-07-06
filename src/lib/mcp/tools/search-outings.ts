import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { outings, type Category } from "@/lib/mock-data";

export default defineTool({
  name: "search_outings",
  title: "Search outings",
  description:
    "Full-text search across WildMeet outings by title, destination, or description. Optionally filter by category and only-with-spots-left.",
  inputSchema: {
    query: z.string().trim().min(1).describe("Search text."),
    category: z.enum(["Camping", "Beach", "Mountain"]).optional(),
    onlyWithSpotsLeft: z.boolean().optional(),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ query, category, onlyWithSpotsLeft }) => {
    const q = query.toLowerCase();
    const results = outings.filter((o) => {
      if (category && o.category !== (category as Category)) return false;
      if (onlyWithSpotsLeft && o.spotsTaken >= o.spotsTotal) return false;
      return (
        o.title.toLowerCase().includes(q) ||
        o.destination.toLowerCase().includes(q) ||
        o.description.toLowerCase().includes(q)
      );
    });
    const rows = results.map((o) => ({
      id: o.id,
      title: o.title,
      destination: o.destination,
      category: o.category,
      date: o.date,
      spotsLeft: o.spotsTotal - o.spotsTaken,
    }));
    return {
      content: [
        {
          type: "text",
          text: rows.length
            ? JSON.stringify(rows, null, 2)
            : `No outings match "${query}".`,
        },
      ],
      structuredContent: { results: rows, count: rows.length },
    };
  },
});
