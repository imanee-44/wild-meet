import { defineMcp } from "@lovable.dev/mcp-js";
import listOutings from "./tools/list-outings";
import getOuting from "./tools/get-outing";
import searchOutings from "./tools/search-outings";

export default defineMcp({
  name: "wildmeet-mcp",
  title: "WildMeet MCP",
  version: "0.1.0",
  instructions:
    "Tools for WildMeet, a social platform for outdoor outings in Morocco (Imsouane, Taghazout, Atlas, and more). Use `list_outings` to browse, `search_outings` to filter by keyword or category, and `get_outing` for full details of a specific outing.",
  tools: [listOutings, getOuting, searchOutings],
});
