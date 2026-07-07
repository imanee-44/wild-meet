import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

function publicClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
}

export type OutingRow = {
  id: string;
  title: string;
  destination: string;
  category: "Camping" | "Beach" | "Mountain";
  date: string;
  image_key: string | null;
  image_url: string | null;
  spots_total: number;
  organizer_id: string | null;
  description: string;
  what_to_bring: string[];
  organizer: { name: string; initials: string; avatar_color: string } | null;
  participants: { user_id: string; name: string; initials: string; avatar_color: string }[];
  spots_taken: number;
};

async function hydrate(rows: any[]): Promise<OutingRow[]> {
  if (rows.length === 0) return [];
  const sb = publicClient();
  const ids = rows.map((r) => r.id);
  const organizerIds = Array.from(new Set(rows.map((r) => r.organizer_id).filter(Boolean)));

  const [{ data: parts }, { data: profs }] = await Promise.all([
    sb.from("outing_participants").select("outing_id,user_id").in("outing_id", ids),
    organizerIds.length
      ? sb.from("profiles").select("id,name,initials,avatar_color").in("id", organizerIds as string[])
      : Promise.resolve({ data: [] as any[] }),
  ]);

  const partUserIds = Array.from(new Set((parts ?? []).map((p: any) => p.user_id)));
  const { data: partProfs } = partUserIds.length
    ? await sb.from("profiles").select("id,name,initials,avatar_color").in("id", partUserIds)
    : { data: [] as any[] };

  const profById = new Map((profs ?? []).map((p: any) => [p.id, p]));
  const partProfById = new Map((partProfs ?? []).map((p: any) => [p.id, p]));
  const partsByOuting = new Map<string, any[]>();
  for (const p of parts ?? []) {
    const arr = partsByOuting.get(p.outing_id) ?? [];
    const prof = partProfById.get(p.user_id);
    if (prof) arr.push({ user_id: p.user_id, name: prof.name, initials: prof.initials, avatar_color: prof.avatar_color });
    partsByOuting.set(p.outing_id, arr);
  }

  return rows.map((r) => {
    const org = r.organizer_id ? profById.get(r.organizer_id) : null;
    const participants = partsByOuting.get(r.id) ?? [];
    return {
      ...r,
      organizer: org ? { name: org.name, initials: org.initials, avatar_color: org.avatar_color } : null,
      participants,
      spots_taken: participants.length,
    } as OutingRow;
  });
}

export const listOutings = createServerFn({ method: "GET" }).handler(async () => {
  const sb = publicClient();
  const { data, error } = await sb.from("outings").select("*").order("date", { ascending: true });
  if (error) throw new Error(error.message);
  return hydrate(data ?? []);
});

export const getOutingById = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ id: z.string() }).parse(input))
  .handler(async ({ data }) => {
    const sb = publicClient();
    const { data: row, error } = await sb.from("outings").select("*").eq("id", data.id).maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) return null;
    const [full] = await hydrate([row]);
    return full;
  });
