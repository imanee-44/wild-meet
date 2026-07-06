import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { outings } from "@/lib/mock-data";

export default defineTool({
  name: "list_outings",
  title: "List outings",
  description:
    "List upcoming WildMeet outings in Morocco. Optionally filter by category (Camping, Beach, Mountain).",
  inputSchema: {
    category: z
      .enum(["Camping", "Beach", "Mountain"])
      .optional()
      .describe("Filter outings by category."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ category }) => {
    const filtered = category ? outings.filter((o) => o.category === category) : outings;
    const rows = filtered.map((o) => ({
      id: o.id,
      title: o.title,
      destination: o.destination,
      category: o.category,
      date: o.date,
      spots: `${o.spotsTaken}/${o.spotsTotal}`,
      organizer: o.organizer.name,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      structuredContent: { outings: rows },
    };
  },
});
