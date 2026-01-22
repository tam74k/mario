import { supabase } from "./supabaseClient.js";

export async function uploadImage({ bucket, file, pathPrefix = "" }){
  const sb = supabase();
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const filename = `${crypto.randomUUID()}.${ext}`;
  const path = `${pathPrefix}${filename}`;

  const { error: upErr } = await sb.storage.from(bucket).upload(path, file, {
    upsert: false,
    cacheControl: "3600",
    contentType: file.type || "image/jpeg",
  });
  if (upErr) throw upErr;

  const { data } = sb.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
