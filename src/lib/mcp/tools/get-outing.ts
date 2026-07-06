import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { getOuting } from "@/lib/mock-data";

export default defineTool({
  name: "get_outing",
  title: "Get outing details",
  description: "Get full details of a single WildMeet outing by its id.",
  inputSchema: {
    id: z.string().min(1).describe("Outing id, e.g. 'imsouane-surf-morning'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ id }) => {
    const outing = getOuting(id);
    if (!outing) {
      return {
        content: [{ type: "text", text: `No outing found with id "${id}".` }],
        isError: true,
      };
    }
    const detail = {
      id: outing.id,
      title: outing.title,
      destination: outing.destination,
      category: outing.category,
      date: outing.date,
      description: outing.description,
      whatToBring: outing.whatToBring,
      spotsTaken: outing.spotsTaken,
      spotsTotal: outing.spotsTotal,
      spotsLeft: outing.spotsTotal - outing.spotsTaken,
      organizer: outing.organizer.name,
      participants: outing.participants.map((p) => p.name),
    };
    return {
      content: [{ type: "text", text: JSON.stringify(detail, null, 2) }],
      structuredContent: detail,
    };
  },
});
