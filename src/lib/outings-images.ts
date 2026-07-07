import outing1 from "@/assets/outing1.jpg";
import outing2 from "@/assets/outing2.jpg";
import outing3 from "@/assets/outing3.jpg";
import outing4 from "@/assets/outing4.jpg";
import outing5 from "@/assets/outing5.jpg";
import outing6 from "@/assets/outing6.jpg";
import campingImg from "@/assets/camping.jpg";
import beachImg from "@/assets/beach.jpg";
import mountainImg from "@/assets/mountain.jpg";

const KEYS: Record<string, string> = {
  outing1, outing2, outing3, outing4, outing5, outing6,
  camping: campingImg, beach: beachImg, mountain: mountainImg,
};

export function outingImage(row: { image_key?: string | null; image_url?: string | null; category: string }): string {
  if (row.image_url) return row.image_url;
  if (row.image_key && KEYS[row.image_key]) return KEYS[row.image_key];
  const cat = row.category.toLowerCase();
  if (cat in KEYS) return KEYS[cat];
  return campingImg;
}
