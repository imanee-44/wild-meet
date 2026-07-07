import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const slugify = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "outing";

export const joinOuting = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ outing_id: z.string() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: outing, error: oe } = await supabase
      .from("outings").select("id,spots_total").eq("id", data.outing_id).maybeSingle();
    if (oe) throw new Error(oe.message);
    if (!outing) throw new Error("Outing not found");
    const { count } = await supabase
      .from("outing_participants")
      .select("*", { count: "exact", head: true })
      .eq("outing_id", data.outing_id);
    if ((count ?? 0) >= outing.spots_total) throw new Error("Sortie complète");
    const { error } = await supabase
      .from("outing_participants")
      .insert({ outing_id: data.outing_id, user_id: userId });
    if (error && error.code !== "23505") throw new Error(error.message);
    return { ok: true };
  });

export const leaveOuting = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ outing_id: z.string() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("outing_participants").delete()
      .eq("outing_id", data.outing_id).eq("user_id", userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const createOuting = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({
      title: z.string().min(3).max(120),
      destination: z.string().min(2).max(200),
      category: z.enum(["Camping", "Beach", "Mountain"]),
      date: z.string(),
      spots_total: z.number().int().min(2).max(50),
      description: z.string().min(10).max(4000),
      what_to_bring: z.array(z.string()).max(30),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const base = slugify(data.title);
    let id = `${base}-${Math.random().toString(36).slice(2, 6)}`;
    const image_key = data.category.toLowerCase();
    const { error } = await supabase.from("outings").insert({
      id, title: data.title, destination: data.destination, category: data.category,
      date: data.date, spots_total: data.spots_total, description: data.description,
      what_to_bring: data.what_to_bring, image_key, organizer_id: userId,
    });
    if (error) throw new Error(error.message);
    await supabase.from("outing_participants").insert({ outing_id: id, user_id: userId });
    return { id };
  });

export const updateMyProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({
      name: z.string().min(1).max(80).optional(),
      bio: z.string().max(500).optional(),
      city: z.string().max(80).optional(),
      tags: z.array(z.string()).max(10).optional(),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const patch: any = { ...data };
    if (data.name) {
      const parts = data.name.trim().split(/\s+/);
      patch.initials = ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? parts[0]?.[1] ?? "")).toUpperCase() || "WM";
    }
    const { error } = await supabase.from("profiles").update(patch).eq("id", userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getMe = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
    const { data: hosted } = await supabase.from("outings").select("id").eq("organizer_id", userId);
    const { data: joined } = await supabase.from("outing_participants").select("outing_id").eq("user_id", userId);
    return {
      user_id: userId,
      profile,
      hosted_ids: (hosted ?? []).map((r: any) => r.id),
      joined_ids: (joined ?? []).map((r: any) => r.outing_id),
    };
  });
